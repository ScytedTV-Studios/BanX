const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const ALLOWED_USER_ID = "852572302590607361";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Restarts the bot. | Bot Admin Only"),

    async execute(interaction) {
        await interaction.deferReply();
        try {
            if (interaction.user.id !== ALLOWED_USER_ID) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("<:crossmark:1330976664535961753> `You do not have permission to use this command.`")
                    ]
                });
            }

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription("<:checkmark:1330976666016550932> `Bot restarting...`")
                ]
            });

            process.exit(1);

        } catch (error) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`${error.message}\``)
                ]
            });
        }
    }
};