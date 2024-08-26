const { selectDiscordServers, updateDiscordServerCounterChannel, updateDiscordServerInformationChannel, updateDiscordServerLeaderboardsChannel } = require("../Functions/sql")

module.exports = async (channel) => {
    try {
        if (channel && channel.name && channel.guild && channel.guild.name) {
            const serverInfo = await selectDiscordServers(channel.guild.id);
            if(serverInfo.length > 0) {
                if(serverInfo[0].channel_counter_id === channel.id)
                    updateDiscordServerCounterChannel(channel.guild.id, null)
                else if(serverInfo[0].channel_information_id === channel.id)
                    updateDiscordServerInformationChannel(channel.guild.id, null)
                else if(serverInfo[0].channel_leaderboards_id === channel.id)
                    updateDiscordServerLeaderboardsChannel(channel.guild.id, null)
            }
        }
    } catch (error) {
        console.error('Erreur lors de la gestion de l\'événement channelDelete :', error.message);
    }
};
