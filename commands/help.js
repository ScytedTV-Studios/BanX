const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const commandsList = require("../commands.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of commands and their descriptions."),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Help Menu")
            .setDescription("**Ban X** will automatically delete messages that contain URLs known to link to **X** (formerly **Twitter**). This may additionally support URLs that **share the same values** as the **X** platform.")
            .setColor("green");

        for (const cmd of commandsList) {
            embed.addFields({ name: `/${cmd.name}`, value: cmd.description, inline: false });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};