const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");
const config = require("./config");

bot.commands = new Discord.Collection();

const readmeFilePath = path.join(__dirname, 'README.md');
const packageJson = require('./package.json');
const currentVersion = packageJson.version;

// Lire la version précédente du README.md
let previousVersion = null;
if (fs.existsSync(readmeFilePath)) {
    const readmeContent = fs.readFileSync(readmeFilePath, 'utf8');
    const versionMatch = readmeContent.match(/Current Version:\s*`([\d.]+)`/);
    if (versionMatch) {
        previousVersion = versionMatch[1];
    }
}

// Si la version a changé, mettre à jour README.md et envoyer un message dans Discord
if (previousVersion !== currentVersion) {
    const readmeContent = fs.readFileSync(readmeFilePath, 'utf8');
    const updatedReadmeContent = readmeContent.replace(/Current Version:\s*`[\d.]+`/, `Current Version: \`${currentVersion}\``);
    fs.writeFileSync(readmeFilePath, updatedReadmeContent);

    bot.once('ready', async () => {
        const channelId = '1272227767957721190'; // ID du canal Discord
        const channel = await bot.channels.fetch(channelId);

        if (channel) {
            channel.send(`🚀 The bot has been updated to version **${currentVersion}**`);
        }
    });
}

bot.login(config.token);

loadCommands(bot);
loadEvents(bot);
