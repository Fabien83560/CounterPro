const { PermissionsBitField } = require('discord.js');
const getEmbed = require("../Functions/getEmbed");
const { selectDiscordServersLeaderboard } = require("../Functions/sql")

module.exports = {
    name: "sendinfo",
    description: "Send message in all #informations channel",
    permissions: [PermissionsBitField.Flags.Administrator],
    dm: false,
    category: "Support",
    options: [
        {
            type: "string",
            name: "message",
            description: "Message to send",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, interaction) {
        if (!interaction.isCommand()) return;

        const allowedUsers = [401838786666954753];
        let allowed = false;
        allowedUsers.forEach(userId => {
            if(interaction.member.id === userId)
                allowed = true;
        });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || allowed) {
            const embed = await getEmbed("ERROR", "Insufficient permissions", "You need to be an administrator and in the developper list to use this command.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const myMessage = interaction.options.getString("message");
        let Embed = await getEmbed("DEFINED", "Information Message", myMessage, "#1E90FF");

        const servers = await selectDiscordServersLeaderboard();
        
        servers.forEach(async server => {
            try {
                if(server.channel_information_id) {
                    const channel = bot.channels.cache.get(server.channel_information_id);
                    await channel.send({ embeds: [Embed] })
                }
            } catch (error) {}
        });

        Embed = await getEmbed("DEFINED", "Message Send", `The message **${myMessage}** was succesfully send.`, "#1E90FF")
        return interaction.reply({ embeds: [Embed], ephemeral: true })
    }
};
