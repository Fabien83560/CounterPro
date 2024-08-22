const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ChannelType 
} = require('discord.js');
const getEmbed = require("../Functions/getEmbed");
const { selectDiscordServers } = require("../Functions/sql");

module.exports = {
    name: "invite",
    description: "Select a server by name to get an invite link",
    permission: "Aucune",
    dm: false,
    category: "Informations",
    options: [
        {
            type: "string",
            name: "name",
            description: "Name of the server to get an invite link for",
            required: true,
            autocomplete: true
        }
    ],

    async run(bot, interaction) {
        const serverId = interaction.options.getString("name");
        if (!serverId) {
            await interaction.reply({
                embeds: [await getEmbed(
                    "ERROR",
                    "No Server ID Provided",
                    "You must provide a server ID to get an invite link."
                )],
                ephemeral: true
            });
            return;
        }

        try {
            const guild = await bot.guilds.fetch(serverId);
            if (!guild) {
                await interaction.reply({
                    embeds: [await getEmbed(
                        "ERROR",
                        "Server Not Found",
                        `No server found with the ID \`${serverId}\`.`
                    )],
                    ephemeral: true
                });
                return;
            }

            const inviteLink = await this.createInviteLink(bot, serverId);

            const embed = await getEmbed("DEFINED", `${guild.name} Invite`, `Here is your invite link to join the server **${guild.name}**: [Click here](${inviteLink})`, "#1E90FF");
            
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Join Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL(inviteLink)
            );

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        } catch (error) {
            console.error("An error occurred while processing the invite request:", error.message);
            await interaction.reply({
                content: 'There was an error processing your request. Please try again later.',
                ephemeral: true
            });
        }
    },

    async createInviteLink(bot, serverId) {
        try {
            const guild = await bot.guilds.fetch(serverId);
            if (!guild) {
                throw new Error("Server not found");
            }
    
            const serverInfos = await selectDiscordServers(serverId);
            if (!serverInfos || serverInfos.length === 0) {
                throw new Error("No server information found");
            }

            const channelCounterId = serverInfos[0].channel_counter_id;
            const channel = await guild.channels.fetch(channelCounterId);
            if (!channel || channel.type !== ChannelType.GuildText) {
                throw new Error("No text channel found with the provided ID in the server");
            }
    
            const invite = await channel.createInvite({
                maxAge: 3600,
                maxUses: 1,
                unique: true
            });
    
            return invite.url;
        } catch (error) {
            console.error("An error occurred while creating the invite:", error.message);
            throw error;
        }
    },
};
