const getEmbed = require("../Functions/getEmbed")
const { selectUserRank, selectServerRank, selectUserServerRank } = require("../Functions/sql")
const leaderboardServers = require("../Functions/Leaderboards/leaderboardServers")
const leaderboardUsers = require("../Functions/Leaderboards/leaderboardUsers")
const leaderboardServer = require("../Functions/Leaderboards/leaderboardServer")

module.exports = {

    name: "leaderboard",
    description: "Shows leaderboards",
    permission: "Aucune",
    dm: true,
    category: "Informations",
    options: [
        {
            type: "string",
            name: "option",
            description: "Choose the leaderboard to display.",
            required: true,
            autocomplete: true,
            choices: [
                {
                    name: "All",
                    value: "all"
                },
                {
                    name: "Servers",
                    value: "servers"
                },
                {
                    name: "Here",
                    value: "here"
                }
            ]
        }
    ],

    async run(bot, message) {
        const selectedOption = message.options.getString("option");

        let leaderboardText;
        let embed;
        let rank = -1;
        switch (selectedOption) {
            case "all":
                embed = await leaderboardUsers(bot);
                rank = await selectUserRank(message.user.id);
                if(rank != -1)
                    embed.addFields({name: "\u200b", value: `Your Ranking: **#${rank}**`});
                break;
            case "servers":
                embed = await leaderboardServers(bot);
                rank = await selectServerRank(message.guild.id);
                if(rank != -1)
                    embed.addFields({name: "\u200b", value: `Server Ranking: **#${rank}**`});
                break;
            case "here":
                embed = await leaderboardServer(bot, message.guild.id);
                rank = await selectServerRank(message.user.id, message.guild.id);
                if(rank != -1)
                    embed.addFields({name: "\u200b", value: `Your Ranking Here: **#${rank}**`});
                break;
            default:
                embed = await getEmbed(
                    "ERROR",
                    'ERROR',
                    'An error occurred while retrieving data.',
                );
        }

        await message.reply({ embeds: [embed ? embed : await getEmbed("INFO", "Leaderboard", leaderboardText)], ephemeral: true 
        });
    }
}
