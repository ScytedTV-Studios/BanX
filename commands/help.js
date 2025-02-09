const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const commandsList = require("../commands.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of commands and their descriptions."),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Help Menu")
            .setDescription("Here are the available commands:")
            .setColor("#5865F2");

        for (const cmd of commandsList) {
            embed.addFields({ name: `/${cmd.name}`, value: cmd.description, inline: false });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};