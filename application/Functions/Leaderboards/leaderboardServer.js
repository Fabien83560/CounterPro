const getEmbed = require('../getEmbed');
const { selectUsersPerServer, selectUsernameByUserId, selectServernameByServerId } = require('../sql');
const getImgUrl = require('../../Functions/img_id')

async function leaderboardServer(bot, server_id) {
    try {
        const users = await selectUsersPerServer(server_id);

        const topUsers = users
            .sort((a, b) => b.counter_value - a.counter_value)
            .slice(0, 10);

        let description = 'Here are the top 10 users with the highest total counts for this server:\n';

        for (const [index, user] of topUsers.entries()) {
            try {
                const userInfo = await selectUsernameByUserId(user.user_id);
                const userName = userInfo[0]?.user_name || "Unknown User";
        
                const emoji = await getImgUrl(bot, `${index + 1}`) || `:${index + 1}:`;
        
                description += `${emoji} **${userName}** - \`${user.counter_value}\`\n`;
            } catch (error) {
                console.error(`Failed to fetch username for user ID ${user.user_id}:`, error.message);
                description += `${index + 1}. **Unknown User** - \`${user.counter_value}\`\n`;
            }
        }
        
        if(users.length === 0)
            description = "No user has count on this server."

        const serverInfo = await selectServernameByServerId(server_id);
        const serverName = serverInfo[0]?.server_name || "Unknown server";
        const embed = await getEmbed(
            "DEFINED",
            `Top 10 Users for ${serverName}`,
            description,
            "#1E90FF"
        );

        return embed;
    } catch (error) {
        console.error('Error retrieving user leaderboard data for server:', error.message);

        const errorEmbed = await getEmbed(
            "ERROR",
            'Error',
            'An error occurred while retrieving user data for this server.',
            "#FF0000"
        );

        return errorEmbed;
    }
}

module.exports = leaderboardServer;
