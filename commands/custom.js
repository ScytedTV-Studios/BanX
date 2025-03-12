const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType } = require("discord.js");

const SCYTEDTV_API_KEY = process.env.SCYTEDTV_API_KEY;
const CUSTOM_DOMAINS_API = "https://api.scyted.tv/v2/banx/customdomains/";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("custom")
        .setDescription("Manage custom blocked domains")
        .setContexts(InteractionContextType.Guild)
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
                const response = await fetch(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API_KEY}` }
                }).catch(error => (error?.status === 404 ? { data: [] } : Promise.reject(error)));

                const domains = await response.json();
                if (domains.includes(domain)) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`${domain}\` is already blocked.`);
                    return interaction.editReply({ embeds: [embed] });
                }

                domains.push(domain);
                await fetch(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    method: "POST",
                    body: JSON.stringify(domains),
                    headers: {
                        Authorization: `Bearer ${SCYTEDTV_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                });

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`<:checkmark:1330976666016550932> \`${domain}\` blocked.`);
                return interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "remove") {
                const response = await fetch(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API_KEY}` }
                }).catch(error => (error?.status === 404 ? { data: [] } : Promise.reject(error)));

                const domains = await response.json();
                if (!domains.includes(domain)) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`${domain}\` is not in the block list.`);
                    return interaction.editReply({ embeds: [embed] });
                }

                const updatedDomains = domains.filter(d => d !== domain);
                await fetch(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    method: "POST",
                    body: JSON.stringify(updatedDomains),
                    headers: {
                        Authorization: `Bearer ${SCYTEDTV_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                });

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`<:checkmark:1330976666016550932> \`${domain}\` unblocked.`);
                return interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "list") {
                const response = await fetch(`${CUSTOM_DOMAINS_API}${guildId}`, {
                    headers: { Authorization: `Bearer ${SCYTEDTV_API_KEY}` }
                }).catch(error => (error?.status === 404 ? { data: [] } : Promise.reject(error)));

                const domains = await response.json();
                if (domains.length === 0) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`No custom domains are currently blocked.\``);
                    return interaction.editReply({ embeds: [embed] });
                }

                const latestRelease = await getLatestRelease();

                const embed = new EmbedBuilder()
                        .setColor("#ff5050")
                        .setDescription(`**Custom Banned Domains**\n-# This does not include global or block list domains.\n\`${domains.join("\`, \`")}\``)
                        .setFooter({ text: `Ban X ◦ Version ${latestRelease}`, iconURL: 'https://github.com/ScytedTV-Studios/BanX/blob/master/branding/banx_icon.png?raw=true' });
                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(`Error handling /custom command:\n${error.stack}`);
            const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`<:crossmark:1330976664535961753> \`An error occurred. Try again later.\``);
            return interaction.editReply({ embeds: [embed] });
        }
    }
};

async function getLatestRelease() {
    try {
        const response = await fetch("https://api.github.com/repos/ScytedTV-Studios/BanX/releases/latest", {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);
        const data = await response.json();

        return data.tag_name || "Unknown Version";
    } catch (error) {
        console.error(`Failed to fetch the latest release from GitHub:\n${error.stack}`);
        return "v1.3";
    }
}