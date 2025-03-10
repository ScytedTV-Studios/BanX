const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const API_URL = "https://api.scyted.tv/v2/banx/settings/";

const categoryOptions = {
    "Default": "default",
    "Fake News": "fakenews",
    "Gambling": "gambling",
    "IP Grabbers": "ipgrabber",
    "NSFW": "nsfw",
    "Scams": "scams",
    "Social": "social"
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("block")
        .setDescription("Manage domain blocking settings for your server.")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand.setName("enable")
                .setDescription("Enable a specific category of domain blocking.")
                .addStringOption(option =>
                    option.setName("type")
                        .setDescription("Select the type of URLs to block.")
                        .setRequired(true)
                        .addChoices(...Object.entries(categoryOptions).map(([name, value]) => ({ name, value })))
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("disable")
                .setDescription("Disable a specific category of domain blocking.")
                .addStringOption(option =>
                    option.setName("type")
                        .setDescription("Select the type of URLs to unblock.")
                        .setRequired(true)
                        .addChoices(...Object.entries(categoryOptions).map(([name, value]) => ({ name, value })))
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("list")
                .setDescription("View which categories of domain blocking are enabled.")
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const guildId = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();

        try {
            const response = await axios.get(`${API_URL}${guildId}`, {
                headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` }
            });

            const settings = response.data;

            if (subcommand === "list") {
                const categoryList = Object.entries(categoryOptions).map(([name, key]) => `**${name}:** ${settings[key] ? "<:checkmark:1330976666016550932> \`Enabled\`" : "<:crossmark:1330976664535961753> \`Disabled\`"}`).join("\n")
                const latestRelease = await getLatestRelease();
                const embed = new EmbedBuilder()
                    .setTitle("Block Lists")
                    .setColor("#ff5050")
                    .setDescription(`${categoryList}`)
                    .setFooter({ text: `Ban X ◦ Version ${latestRelease}`, iconURL: 'https://github.com/ScytedTV-Studios/BanX/blob/master/Branding/Ban%20X%20-%20Icon.png?raw=true' });
                return interaction.editReply({ embeds: [embed] });
            }

            const type = interaction.options.getString("type");
            const isEnableCommand = subcommand === "enable";

            settings[type] = isEnableCommand;

            await axios.post(`${API_URL}${guildId}`, settings, {
                headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` }
            });

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`<:checkmark:1330976666016550932> ${isEnableCommand ? "Enabled" : "Disabled"} \`${type}\` block list.`)
                ]
            });

        } catch (error) {
            console.error(error);
            
            const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("<:crossmark:1330976664535961753> `Failed to contact ScytedTV API. Try again later.`");

            return interaction.editReply({ embeds: [embed] });
        }
    }
};

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
        console.error("Failed to fetch the latest release from GitHub:", error);
        return "v1.3";
    }
}