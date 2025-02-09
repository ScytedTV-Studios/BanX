const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("domain")
        .setDescription("Manage blocked domains.")
        .addSubcommand(subcommand =>
            subcommand.setName("list")
                .setDescription("Lists all blocked domains.")
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "list") {
            const filePath = path.resolve(__dirname, "../DOMAINS.txt");

            if (!fs.existsSync(filePath)) {
                return interaction.reply({ content: "No blocked domains found.", ephemeral: true });
            }

            const content = fs.readFileSync(filePath, "utf8").trim();
            const domains = content.split("\n").map(domain => domain.trim()).filter(Boolean);

            if (domains.length === 0) {
                return interaction.reply({ content: "No blocked domains found.", ephemeral: true });
            }

            const formattedDomains = domains.map(domain => `\`${domain}\``).join(", ");

            const embed = new EmbedBuilder()
                .setTitle("Blocked Domains")
                .setDescription(formattedDomains)
                .setColor("#ff5050");

            await interaction.reply({ embeds: [embed] });
        }
    }
};