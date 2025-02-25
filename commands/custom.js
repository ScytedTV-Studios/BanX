const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require("axios");

const SCYTEDTV_API = process.env.SCYTEDTV_API;
const CUSTOM_DOMAINS_API = "https://api.scyted.tv/v2/banx/customdomains/";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("custom")
        .setDescription("Manage custom blocked domains")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a domain to the custom blocklist")
                .addStringOption(option =>
                    option.setName("domain")
                        .setDescription("The domain to block")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a domain from the custom blocklist")
                .addStringOption(option =>
                    option.setName("domain")
                        .setDescription("The domain to unblock")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all custom blocked domains")),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();
        const domain = interaction.options.getString("domain");

        await interaction.deferReply();

        try {
            if (subcommand === "add") {
                const response = await axios.get(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API}` }
                }).catch(error => (error.response?.status === 404 ? { data: [] } : Promise.reject(error)));

                const domains = response.data;
                if (domains.includes(domain)) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`${domain}\` is already blocked.`);
                    return interaction.editReply({ embeds: [embed] });
                }

                domains.push(domain);
                await axios.post(`${CUSTOM_DOMAINS_API}${guildId}`, domains, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API}` }
                });

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`<:checkmark:1330976666016550932> \`${domain}\` blocked.`);
                return interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "remove") {
                const response = await axios.get(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API}` }
                }).catch(error => (error.response?.status === 404 ? { data: [] } : Promise.reject(error)));

                const domains = response.data;
                if (!domains.includes(domain)) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`${domain}\` is not in the block list.`);
                    return interaction.editReply({ embeds: [embed] });
                }

                const updatedDomains = domains.filter(d => d !== domain);
                await axios.post(`${CUSTOM_DOMAINS_API}${guildId}`, updatedDomains, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API}` }
                });

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`<:checkmark:1330976666016550932> \`${domain}\` unblocked.`);
                return interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "list") {
                const response = await axios.get(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API}` }
                }).catch(error => (error.response?.status === 404 ? { data: [] } : Promise.reject(error)));

                const domains = response.data;
                if (domains.length === 0) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`No custom domains are currently blocked.\``);
                    return interaction.editReply({ embeds: [embed] });
                }

                const embed = new EmbedBuilder()
                        .setColor("#ff5050")
                        .setDescription(`**Custom Banned Domains**\n\`${domains.join("\`, \`")}\`\n-# This does not include global or block list domains.`);
                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(`Error handling /custom command:`, error);
            const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`An error occurred. Try again later.\``);
            return interaction.editReply({ embeds: [embed] });
        }
    }
};