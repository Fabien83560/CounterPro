const getEmbed = require('../getEmbed');
const { selectUsersLeaderboard } = require('../sql');
const getImgUrl = require('../../Functions/img_id')

async function leaderboardUsers(bot) {
    try {
        const users = await selectUsersLeaderboard();

        const topUsers = users
            .sort((a, b) => b.total_count - a.total_count)
            .slice(0, 10);

        let description = 'Here are the 10 users with the highest total counts:\n';

        for (const [index, user] of topUsers.entries()) {
            try {        
                const emoji = await getImgUrl(bot, `${index + 1}`) || `:${index + 1}:`;
        
                description += `${emoji} **${user.user_name}** - \`${user.total_count}\`\n`;
            } catch (error) {
                description += `${index + 1}. **Unknown User** - \`${server.counter_value}\`\n`;
            }
        }

        const embed = await getEmbed(
            "DEFINED",
            'Top 10 Users',
            description,
            "#1E90FF"
        );

        return embed;
    } catch (error) {
        console.error('Error retrieving user leaderboard data:', error.message);

        const errorEmbed = await getEmbed(
            "ERROR",
            'Error',
            'An error occurred while retrieving user data.',
            "#FF0000"
        );

        return errorEmbed;
    }
}

module.exports = leaderboardUsers;
