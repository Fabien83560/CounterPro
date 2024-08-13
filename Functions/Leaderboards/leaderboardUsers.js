const getEmbed = require('../getEmbed');
const { selectUsersLeaderboard } = require('../sql');

async function leaderboardUsers() {
    try {
        const users = await selectUsersLeaderboard();

        const topUsers = users
            .sort((a, b) => b.total_count - a.total_count)
            .slice(0, 10);

        let description = 'Here are the 10 users with the highest total counts:\n';
        topUsers.forEach((user, index) => {
            description += `${index + 1}. **${user.user_name}** - \`${user.total_count}\`\n`;
        });

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
