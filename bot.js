require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ActivityType, REST, Routes, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

const SCYTEDTV_API_KEY = process.env.SCYTEDTV_API_KEY;
const BASE_API_URL = "https://api.scyted.tv/v2/banx/settings/";
const CUSTOM_DOMAINS_API = "https://api.scyted.tv/v2/banx/customdomains/";
const COUNT_API_URL = "https://api.scyted.tv/v2/banx/count";
const SERVER_INFO_API = "https://api.scyted.tv/v2/banx/info/";

const CATEGORY_FILES = {
    default: "DOMAINS.txt",
    fakenews: "DOMAINS_FAKENEWS.txt",
    gambling: "DOMAINS_GAMBLING.txt",
    ipgrabber: "DOMAINS_IP_GRABBER.txt",
    nsfw: "DOMAINS_NSFW.txt",
    scams: "DOMAINS_SCAMS.txt",
    social: "DOMAINS_SOCIAL.txt"
};

const serverSettingsCache = new Map();
const customDomainsCache = new Map();
const categoryTries = new Map();

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    containsBannedDomain(message) {
        let node;
        for (let i = 0; i < message.length; i++) {
            node = this.root;
            for (let j = i; j < message.length; j++) {
                if (!node.children[message[j]]) break;
                node = node.children[message[j]];
                if (node.isEndOfWord) {

                    const before = message[i - 1] || " ";
                    const after = message[j + 1] || " ";
    
                    const isBeforeValid = !/[a-zA-Z0-9]/.test(before);
                    const isAfterValid = !/[a-zA-Z0-9]/.test(after);
    
                    if (isBeforeValid && isAfterValid) {
                        return message.slice(i, j + 1);
                    }
                }
            }
        }
        return null;
    }
}

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    await cacheServerSettings();
    await cacheCustomDomains();

    updateServerInfo()

    await loadCategoryTries();
    setInterval(loadCategoryTries, 60 * 60 * 1000);

    updateStatus();
    setInterval(updateStatus, 20000);
});

async function updateServerInfo() {
    const guilds = client.guilds.cache.map(guild => guild.id);
    for (const guildId of guilds) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            const iconUrl = guild.iconURL({ format: "png", dynamic: true, size: 1024 }) || null;
            await fetch(`${SERVER_INFO_API}${guildId}`, {
                method: "POST",
                body: JSON.stringify({
                    name: guild.name,
                    icon: iconUrl
                }),
                headers: {
                    Authorization: `Bearer ${SCYTEDTV_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }).catch(error => console.error(`Failed to update server info for ${guildId}:\n${error.stack}`));
        }
    }
}

client.on("guildUpdate", async (oldGuild, newGuild) => {
    if (oldGuild.name !== newGuild.name || oldGuild.icon !== newGuild.icon) {
        const iconUrl = newGuild.iconURL({ format: "png", dynamic: true, size: 1024 }) || null;
        await fetch(`${SERVER_INFO_API}${newGuild.id}`, {
            method: "POST",
            body: JSON.stringify({
                name: newGuild.name,
                icon: iconUrl
            }),
            headers: {
                Authorization: `Bearer ${SCYTEDTV_API_KEY}`,
                "Content-Type": "application/json"
            }
        }).catch(error => console.error(`Failed to update server info for ${newGuild.id}:\n${error.stack}`));
    }
});

async function getLatestRelease() {
    try {
        const response = await fetch("https://api.github.com/repos/ScytedTV-Studios/BanX/releases/latest", {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);
        const data = await response.json();

        return data.tag_name || "Unknown Version";
    } catch (error) {
        console.error(`Failed to fetch the latest release from GitHub:\n${error.stack}`);
        return "v1.3";
    }
}

async function getCurrentCount() {
    try {
        const response = await fetch(COUNT_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.SCYTEDTV_API_KEY}`
            }
        });

        if (!response.ok) throw new Error(`GET request failed with status ${response.status}`);

        const data = await response.json();
        return data.count ?? 0;
    } catch (error) {
        console.error(`Failed to fetch count from API:\n${error.stack}`);
        return 0;
    }
}

const statuses = [
    async () => {
        const latestRelease = await getLatestRelease();
        return { name: `${latestRelease}`, type: ActivityType.Playing };
    },
    async () => {
        const count = await getCurrentCount();
        return { name: `${count} messages blocked`, type: ActivityType.Custom };
    },
    () => {
        const serverCount = client.guilds.cache.size;
        return { name: `${serverCount} servers`, type: ActivityType.Watching };
    },
    () => {
        const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        return { name: `${userCount} users`, type: ActivityType.Listening };
    },
];

let statusIndex = 0;
async function updateStatus() {
    if (client.user) {
        const statusFunction = statuses[statusIndex];
        const status = await statusFunction();
        client.user.setPresence({
            status: 'dnd',
            activities: [{ name: status.name, type: status.type }],
        });
        statusIndex = (statusIndex + 1) % statuses.length;
    }
}

async function loadCategoryTries() {
    console.log("Building Tries for all categories...");

    for (const [category, fileName] of Object.entries(CATEGORY_FILES)) {
        const trie = new Trie();
        const filePath = path.resolve(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            content.split("\n").map(domain => domain.trim()).filter(Boolean).forEach(domain => {
                trie.insert(domain);
            });
        }
        categoryTries.set(category, trie);
    }

    console.log("All category Tries built.");
}

async function fetchServerSettings(guildId) {
    try {
        const response = await fetch(`${BASE_API_URL}${guildId}`, {
            headers: { Authorization: `Bearer ${SCYTEDTV_API_KEY}` }
        });
        const data = await response.json();

        serverSettingsCache.set(guildId, data);
        return data;
    } catch (error) {
        if (error?.status === 404) {
            console.log(`No settings found for server ${guildId}, initializing defaults...`);
            await fetch(`${BASE_API_URL}${guildId}`, {
                method: "POST",
                body: JSON.stringify({
                    default: true,
                    fakenews: false,
                    gambling: false,
                    ipgrabber: false,
                    nsfw: false,
                    scams: false,
                    social: false
                }),
                headers: {
                    Authorization: `Bearer ${SCYTEDTV_API_KEY}`,
                    "Content-Type": "application/json"
                }
            });
            return { default: true, fakenews: false, gambling: false, ipgrabber: false, nsfw: false, scams: false, social: false };
        }
        console.error(`Error fetching settings for ${guildId}:\n${error.stack}`);
        return null;
    }
}

async function fetchCustomDomains(guildId) {
    try {
        const response = await fetch(`${CUSTOM_DOMAINS_API}${guildId}`, {
            headers: { Authorization: `Bearer ${SCYTEDTV_API_KEY}` }
        });
        const data = await response.json();

        customDomainsCache.set(guildId, data);
        return data;
    } catch (error) {
        if (error?.status === 404) {
            await fetch(`${CUSTOM_DOMAINS_API}${guildId}`, {
                method: "POST",
                body: "[]",
                headers: {
                    Authorization: `Bearer ${SCYTEDTV_API_KEY}`,
                    "Content-Type": "application/json"
                }
            });
            customDomainsCache.set(guildId, []);
            return [];
        }
        console.error(`Error fetching custom domains for ${guildId}:\n${error.stack}`);
        return [];
    }
}

async function cacheServerSettings() {
    const guilds = client.guilds.cache.map(guild => guild.id);
    for (const guildId of guilds) {
        await fetchServerSettings(guildId);
    }
}

async function cacheCustomDomains() {
    const guilds = client.guilds.cache.map(guild => guild.id);
    for (const guildId of guilds) {
        await fetchCustomDomains(guildId);
    }
}

client.on("guildCreate", async (guild) => {
    console.log(`Joined new server: ${guild.name} (${guild.id})`);
    await fetchServerSettings(guild.id);
    await fetchCustomDomains(guild.id);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;
    const settings = await fetchServerSettings(guildId) || {};
    const customDomains = await fetchCustomDomains(guildId) || [];

    let matchedDomain = null;

    if (!matchedDomain) {
        for (const [category, enabled] of Object.entries(settings)) {
            if (enabled && categoryTries.has(category)) {
                matchedDomain = categoryTries.get(category).containsBannedDomain(message.content.toLowerCase());
                if (matchedDomain) break;
            }
        }
    }

    if (!matchedDomain) {
        customDomains.forEach(domain => {
            if (message.content.includes(domain)) matchedDomain = domain;
        });
    }

    if (matchedDomain) {
        await message.delete();
    
        const channelEmbed = new EmbedBuilder()
            .setDescription(`<@${message.author.id}> your message has been deleted for containing \`${matchedDomain}\`.`)
            .setColor("#ff5050");
    
        const warningMessage = await message.channel.send({ embeds: [channelEmbed] });
        setTimeout(() => warningMessage.delete(), 5000);
    
        const dmEmbed = new EmbedBuilder()
            .setTitle("Your message was deleted")
            .setDescription(`\`\`\`${message.content}\`\`\`\n**Your message contained** \`${matchedDomain}\`**.**`)
            .setColor("#ff5050");
    
        const actionRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(message.guild.name).setStyle(ButtonStyle.Secondary).setDisabled(true).setCustomId("disabled_server_button")
        );

        try {
            await message.author.send({ embeds: [dmEmbed], components: [actionRow] });
        } catch (e) {
            console.error(`Could not send DM to ${message.author.tag}:`, e);
        }

        try {
            const response = await fetch(COUNT_API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${process.env.SCYTEDTV_API_KEY}`
                }
            });
    
            if (!response.ok) throw new Error(`GET request failed with status ${response.status}`);
    
            const data = await response.json();
            const previousCount = data.count ?? 0;
    
            await fetch(COUNT_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.SCYTEDTV_API_KEY}`
                },
                body: JSON.stringify({ count: previousCount + 1 })
            });
    
        } catch (error) {
            console.error(`Failed to update count on API:\n${error.stack}`);
        }
    }
});

client.commands = new Collection();
const commands = [];
const commandsPath = path.join(__dirname, "commands");

fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith(".js")) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
});

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

client.once("ready", async () => {
    try {
        console.log("Registering slash commands...");
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log("Slash commands registered successfully.");
    } catch (error) {
        console.error(`Error registering slash commands:\n${error.stack}`);
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            await interaction.deferReply();
            console.error(error);
            await interaction.editReply({ content: "An error occurred while executing this command.", ephemeral: true });
        }
    }
});

client.login(process.env.BOT_TOKEN);