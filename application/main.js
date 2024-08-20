const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");
const config = require("./config");
const { selectDiscordServersTotalCounterValues } = require("./Functions/sql")
bot.commands = new Discord.Collection();

bot.login(config.token);

loadCommands(bot);
loadEvents(bot);

bot.once('ready', async () => {
    const updateActivityWithDelay = async () => {
        try {
            const globalCount = await selectDiscordServersTotalCounterValues();

            bot.user.setActivity({
                name: `Global count: ${globalCount[0].total_counter_value}`,
                type: Discord.ActivityType.Custom
            });

        } catch (error) {
            console.error('Failed to update activity:', error.message);
        }
    };
    updateActivityWithDelay();

    setTimeout(updateActivityWithDelay, 30000);
});