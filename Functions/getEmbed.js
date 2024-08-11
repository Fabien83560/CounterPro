const { EmbedBuilder } = require('discord.js');
const randomHEX = require('./randomHEX')

module.exports = async (code, title, description, defined_color = "") => {
    description = description || "No description provided";

    const colorMap = {
        ERROR: '#ff0000',
        INFO: '#008000',
        WARNING: '#ff7f00',
        RANDOM: await randomHEX(),
        DEFINED: defined_color
    };

    let color = colorMap[code] || '#ff0000';

    let Embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: ` CounterPro`, iconURL: 'https://cdn.discordapp.com/emojis/1271877957413114019.png' });

    return Embed;
}
