const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
// const commandsList = require("../config/commands.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Basic help information."),
    
    async execute(interaction) {
        await interaction.deferReply();

        const latestRelease = await getLatestRelease();

        const embed = new EmbedBuilder()
            .setTitle("Ban X: Protecting Servers Every Day")
            .setColor("#ff5050")
            .setThumbnail("https://github.com/ScytedTV-Studios/BanX/blob/master/Branding/Ban%20X%20-%20Logo.jpg?raw=true")
            .setDescription("**Ban X** was originally created to delete messages that contain URLs known to link to **X** (formerly **Twitter**), but you can also block the following categories: `Fake News`, `Gambling`, `NSFW`, `Scams`, and `Social`.\n\nTo disable the default **X**/**Twitter** link banning, use the </block disable:1343725446268719275> command to disable `Default`.\n\nStay up-to-date with **Ban X** updates on [Bluesky](https://go.scyted.tv/bsky/banx)!")
            .setImage("https://raw.githubusercontent.com/ScytedTV-Studios/BanX/refs/heads/master/Branding/Ban%20X%20-%20GitHub%20Preview.jpg")
            .setFooter({ text: `Ban X ◦ Version ${latestRelease}`, iconURL: 'https://github.com/ScytedTV-Studios/BanX/blob/master/Branding/Ban%20X%20-%20Icon.png?raw=true' });

        // for (const cmd of commandsList) {
        //     embed.addFields({ name: `${cmd.name}`, value: cmd.description, inline: false });
        // }

        const inviteButton = new ButtonBuilder()
            .setLabel("Invite")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/oauth2/authorize?client_id=1333586687724355759")

        const githubButton = new ButtonBuilder()
            .setLabel("GitHub")
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/ScytedTV-Studios/BanX")

        const actionRow = new ActionRowBuilder().addComponents(inviteButton, githubButton);

        await interaction.editReply({ embeds: [embed], components: [actionRow] });
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
        console.error(`Failed to fetch the latest release from GitHub:\n${error.stack}`);
        return "v1.3";
    }
}