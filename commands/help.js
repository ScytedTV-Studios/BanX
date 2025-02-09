const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const commandsList = require("../commands.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of commands."),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Ban X")
            .setThumbnail("https://github.com/ScytedTV-Studios/BanX/blob/master/Branding/Ban%20X_Twitter%20-%20Logo.jpg?raw=true")
            .setDescription("**Ban X** will automatically delete messages that contain URLs known to link to **X** (formerly **Twitter**). This may additionally support URLs that **share the same values** as the **X** platform.")
            .setColor("#ff5050");

        for (const cmd of commandsList) {
            embed.addFields({ name: `/${cmd.name}`, value: cmd.description, inline: false });
        }

        await interaction.reply({ embeds: [embed] });
    }
};