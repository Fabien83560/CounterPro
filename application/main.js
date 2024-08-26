const { Client, GatewayIntentBits, Events, ActivityType, Collection } = require('discord.js');
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");
const config = require("./config");
const { selectDiscordServersTotalCounterValues } = require("./Functions/sql");

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

bot.commands = new Collection();

bot.login(config.token);

loadCommands(bot);
loadEvents(bot);

bot.on(Events.GuildUpdate, require('./Events/guildUpdate'));
bot.on(Events.ChannelDelete, require('./Events/channelDelete'));

bot.once('ready', async () => {
    const updateActivityWithDelay = async () => {
        try {
            const globalCount = await selectDiscordServersTotalCounterValues();
            bot.user.setActivity({
                name: `Global count: ${globalCount[0].total_counter_value}`,
                type: ActivityType.Custom
            });
        } catch (error) {
            console.error('Failed to update activity:', error.message);
        }
    };

    await updateActivityWithDelay();
    setInterval(updateActivityWithDelay, 30000);
});
