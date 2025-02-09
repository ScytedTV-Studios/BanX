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

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    updateStatus();
    setInterval(updateStatus, 20000);
});

const statuses = [
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
function updateStatus() {
    if (client.user) {
        const status = statuses[statusIndex]();
        client.user.setPresence({
            status: 'dnd',
            activities: [{ name: status.name, type: status.type }],
        });
        statusIndex = (statusIndex + 1) % statuses.length;
    }
}

function loadDomains() {
    const filePath = path.resolve(__dirname, "DOMAINS.txt");
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        return content.split("\n").map((domain) => domain.trim()).filter(Boolean);
    } else {
        console.error("DOMAINS.txt not found!");
        return [];
    }
}

function containsBannedDomain(content, domains) {
    return domains.some((domain) => content.toLowerCase().includes(domain.toLowerCase()));
}

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const domains = loadDomains();

    if (containsBannedDomain(message.content, domains)) {

        await message.delete();

        const channelEmbed = new EmbedBuilder()
            .setDescription(`<@${message.author.id}> your message has been deleted for containing \`${domains.filter((domain) => message.content.toLowerCase().includes(domain.toLowerCase())).join("\`**,** \`")}\`.`)
            .setColor("#ff5050");

        const warningMessage = await message.channel.send({ embeds: [channelEmbed] });
        setTimeout(() => warningMessage.delete(), 5000);

        const dmEmbed = new EmbedBuilder()
            .setTitle("Your message was deleted")
            .setDescription(
                `\`\`\`${message.content}\`\`\`\n**Your message contained** \`${domains.filter((domain) => message.content.toLowerCase().includes(domain.toLowerCase())).join("\`**,** \`")}\`**.**`)
            .setColor("#ff5050");

        const serverButton = new ButtonBuilder()
            .setLabel(message.guild.name)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
            .setCustomId("disabled_server_button");

        const actionRow = new ActionRowBuilder().addComponents(serverButton);

        try {
            await message.author.send({ embeds: [dmEmbed], components: [actionRow] });
        } catch (e) {
            console.error(`Could not send DM to ${message.author.tag}:`, e);
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
        console.error("Error registering slash commands:", error);
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "An error occurred while executing this command.", ephemeral: true });
        }
    }
});

client.login(process.env.BOT_TOKEN);