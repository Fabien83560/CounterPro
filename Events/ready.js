const loadDatabase = require("../Loaders/loadDatabase");
const loadSlashCommands = require("../Loaders/loadSlashCommands");

module.exports = async bot => {
    try {
        bot.db = await loadDatabase();
        bot.db.connect(function (err) {
            if (err) {
                console.error("Failed to connect to the database:", err.message);
                process.exit(1);
            } else {
                console.log("Database was successfully loaded !");
            }
        });

        await loadSlashCommands(bot);

        console.log();
        console.log(`${bot.user.username} : Online on ${bot.guilds.cache.size} servers!`);

    } catch (error) {
        console.error("An error occurred during the bot's startup:", error.message);
        process.exit(1);
    }
};
