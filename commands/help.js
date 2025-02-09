const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const commandsList = require("../config/commands.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of commands."),
    
    async execute(interaction) {
        await interaction.deferReply();
        const embed = new EmbedBuilder()
            .setThumbnail("https://github.com/ScytedTV-Studios/BanX/blob/master/Branding/Ban%20X_Twitter%20-%20Logo.jpg?raw=true")
            .setDescription("**Ban X** will automatically delete messages that contain URLs known to link to **X** (formerly **Twitter**). This may additionally support URLs that **share the same values** as the **X** platform.\n\nStay up-to-date with **Ban X** updates on [Bluesky](https://go.scyted.tv/bsky/banx)!\n\n[ [GitHub](https://github.com/ScytedTV-Studios/BanX) | [Invite Bot](https://discord.com/oauth2/authorize?client_id=1333586687724355759) ]")
            .setColor("#ff5050");

        for (const cmd of commandsList) {
            embed.addFields({ name: `${cmd.name}`, value: cmd.description, inline: false });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};