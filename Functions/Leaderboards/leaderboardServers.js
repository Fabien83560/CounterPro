const getEmbed = require('../getEmbed');
const { selectDiscordServersLeaderboard } = require("../sql")
const getImgUrl = require('../../img/img_id')

async function leaderboardServers(bot) {
    try {
        const servers = await selectDiscordServersLeaderboard();

        const topServers = servers
            .sort((a, b) => b.counter_value - a.counter_value)
            .slice(0, 10);

        let description = 'Here are the 10 servers with the largest counter values :\n';

        for (const [index, server] of topServers.entries()) {
            try {        
                const emoji = await getImgUrl(bot, `${index + 1}`) || `:${index + 1}:`;
        
                description += `${emoji} **${server.server_name}** - \`${server.counter_value}\`\n`;
            } catch (error) {
                description += `${index + 1}. **Unknown Server** - \`${server.counter_value}\`\n`;
            }
        }

        const embed = await getEmbed(
            "DEFINED",
            'Top 10 Servers',
            description,
            "#1E90FF"
        );

        return embed;
    } catch (error) {
        console.error('Erreur lors de la récupération des données du leaderboard des serveurs:', error.message);

        const errorEmbed = await getEmbed(
            "ERROR",
            'Erreur',
            'An error occurred while retrieving data.',
        );

        return errorEmbed;
    }
}

module.exports = leaderboardServers;