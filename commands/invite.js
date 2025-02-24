const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite the bot to your server."),
    
    async execute(interaction) {
        await interaction.deferReply();
        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`<:checkmark:1330976666016550932> Invite **Ban X**`);

        const serverButton = new ButtonBuilder()
            .setLabel("Invite")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/oauth2/authorize?client_id=1333586687724355759")

        const actionRow = new ActionRowBuilder().addComponents(serverButton);

        try {
            await interaction.editReply({ embeds: [embed], components: [actionRow] });
        } catch (e) {
            console.error(`Could not send invite:`, e);

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`<:crossmark:1330976664535961753> \`Error sending invite: ${e}\``)

            await interaction.editReply({ embeds: [embed] });
        }
    }
};