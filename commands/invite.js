const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite the bot to your server."),
    
    async execute(interaction) {
        await interaction.deferReply();
        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`<:checkmark:1330976666016550932> [Invite **Ban X**](https://discord.com/oauth2/authorize?client_id=1333586687724355759)`)

        await interaction.editReply({ embeds: [embed] });
    }
};