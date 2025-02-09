const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const ALLOWED_USER_ID = "852572302590607361";
const filePath = path.resolve(__dirname, "../DOMAINS.txt");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("domain")
        .setDescription("Manage blocked domains.")
        .addSubcommand(subcommand =>
            subcommand.setName("list")
                .setDescription("Lists all blocked domains.")
        )
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Adds a domain to the global block list. | Bot Admin Only")
                .addStringOption(option =>
                    option.setName("domain")
                        .setDescription("The domain to block.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Removes a domain from the global block list. | Bot Admin Only")
                .addStringOption(option =>
                    option.setName("domain")
                        .setDescription("The domain to remove.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "list") {
            await interaction.deferReply();
            try {
                if (!fs.existsSync(filePath) || fs.readFileSync(filePath, "utf8").trim() === "") {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("<:crossmark:1330976664535961753> `No domains are currently blocked.`")
                        ]
                    });
                }

                const domains = fs.readFileSync(filePath, "utf8")
                    .split("\n")
                    .map(domain => domain.trim())
                    .filter(domain => domain.length > 0)
                    .join("\`, \`");

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`<:checkmark:1330976666016550932> **Banned Domains**\n\`${domains}\`\n-# These domains are banned `)
                    ]
                });
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

        if (subcommand === "add") {
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

                const domain = interaction.options.getString("domain").trim();

                if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("<:crossmark:1330976664535961753> `Invalid domain format.`")
                        ]
                    });
                }

                if (fs.existsSync(filePath)) {
                    const domains = fs.readFileSync(filePath, "utf8").trim().split("\n").map(d => d.trim());
                    if (domains.includes(domain)) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription("<:crossmark:1330976664535961753> `Domain is already blocked.`")
                            ]
                        });
                    }
                }

                fs.appendFileSync(filePath, `\n${domain}`);

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`<:checkmark:1330976666016550932> \`${domain}\` domain added.`)
                    ]
                });
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

        if (subcommand === "remove") {
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

                const domain = interaction.options.getString("domain").trim();

                if (!fs.existsSync(filePath) || fs.readFileSync(filePath, "utf8").trim() === "") {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("<:crossmark:1330976664535961753> `No domains are currently blocked.`")
                        ]
                    });
                }

                let domains = fs.readFileSync(filePath, "utf8")
                    .split("\n")
                    .map(d => d.trim())
                    .filter(d => d.length > 0);

                if (!domains.includes(domain)) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("<:crossmark:1330976664535961753> `Domain not found in the block list.`")
                        ]
                    });
                }

                domains = domains.filter(d => d !== domain);
                fs.writeFileSync(filePath, domains.join("\n"));

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`<:checkmark:1330976666016550932> \`${domain}\` domain removed.`)
                    ]
                });
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
    }
};