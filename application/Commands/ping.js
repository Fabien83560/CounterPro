const getEmbed = require("../Functions/getEmbed");
module.exports = {

    name: "ping",
    description: "Display discord API latency",
    permission: "Aucune",
    dm: true,
    category: "Informations",

    async run(bot,message) {
        await message.reply({ embeds: [await getEmbed("INFO", "Discord API Latency", `The Discord API Latency is \`${bot.ws.ping}ms\``)], ephemeral: true });
    }
}