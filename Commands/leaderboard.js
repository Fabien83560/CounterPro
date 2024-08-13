const getEmbed = require("../Functions/getEmbed");

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
        switch (selectedOption) {
            case "all":
                leaderboardText = "Here is the leaderboard of all cross-server players.";
                break;
            case "servers":
                leaderboardText = "Here is the servers leaderboard.";
                break;
            case "here":
                leaderboardText = `Here is the leaderboard for the server: ${message.guild.name}`;
                break;
            default:
                leaderboardText = "Invalid option selected.";
        }

        await message.reply({ 
            embeds: [await getEmbed("INFO", "Leaderboard", leaderboardText)], 
            ephemeral: true 
        });
    }
}
