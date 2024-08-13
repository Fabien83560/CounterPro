const { selectDiscordServersLeaderboard } = require('./sql')
const leaderboardServers = require('./Leaderboards/leaderboardServers');
const leaderboardUsers = require('./Leaderboards/leaderboardUsers');
const leaderboardServer = require('./Leaderboards/leaderboardServer');

async function updateServerInfoChannel(bot, server) {
    try {
        const { server_id, channel_leaderboards_id } = server;

        if (channel_leaderboards_id) {
            const channel = bot.channels.cache.get(channel_leaderboards_id);

            if (channel) {
                const updateChannel = async () => {
                    try {
                        const fetchedMessages = await channel.messages.fetch({ limit: 100 });
                        await channel.bulkDelete(fetchedMessages);

                        const serversEmbed = await leaderboardServers();
                        await channel.send({ embeds: [serversEmbed] });

                        const usersEmbed = await leaderboardUsers();
                        await channel.send({ embeds: [usersEmbed] });

                        const serverEmbed = await leaderboardServer(server_id);
                        await channel.send({ embeds: [serverEmbed] });

                    } catch (error) {
                        console.error(`Failed to update info channel for server ${server_id}:`, error.message);
                    }
                };

                // Exécuter immédiatement
                await updateChannel();

                setInterval(updateChannel, 600000);
            }
        }
    } catch (error) {
        console.error('Failed to update information Channel:', error.message);
    }
}

async function updateAllServersInfoChannel(bot) {
    const servers = await selectDiscordServersLeaderboard();
    for (const server of servers) {
        updateServerInfoChannel(bot, server);
    }
}

module.exports = {
    updateServerInfoChannel,
    updateAllServersInfoChannel
};
