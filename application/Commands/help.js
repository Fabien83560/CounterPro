const getEmbed = require("../Functions/getEmbed");

module.exports = {
    name: "help",
    description: "Allows you to know all the commands",
    permission: "Aucune",
    dm: true,
    category: "Informations",

    async run(bot, message) {
        let categories = [];
        bot.commands.forEach(command => {
            if (!categories.includes(command.category)) categories.push(command.category);
        });

        let Embed = await getEmbed("INFO", "Bot Commands", `Commands available : \`${bot.commands.size}\``);

        categories.sort().forEach(category => {
            let commands = bot.commands.filter(cmd => cmd.category === category);
            Embed.addFields({
                name: category,
                value: commands.map(cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n")
            });
        });
        Embed.setDescription("**website:** https://counterpro.ortegaf.fr");

        await message.reply({ embeds: [Embed], ephemeral: true});
    }
};
