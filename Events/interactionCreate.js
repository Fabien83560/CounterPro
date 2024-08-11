const Discord = require("discord.js");
const getEmbed = require("../Functions/getEmbed");


module.exports = async (bot, interaction) => {

    // Gestion des options de complétion automatique
    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        let entry = interaction.options.getFocused();
        if (interaction.commandName === "help") {
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry));
            await interaction.respond(
                entry === "" ? 
                bot.commands.map(cmd => ({ name: cmd.name, value: cmd.name })) : 
                choices.map(choice => ({ name: choice.name, value: choice.name }))
            );
        }
    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command;
        try {
            command = require(`../Commands/${interaction.commandName}`);
        } catch (error) {
            command = null;
        }

        if (!command) {
            const embed = await getEmbed(
                "ERROR",
                "Unknown Command",
                `The command \`${interaction.commandName}\` is not recognized. Please check the command and try again.`
            );

            await interaction.user.send({ embeds: [embed], ephemeral: true });
            return;
        }

        try {
            await command.run(bot, interaction, interaction.options, bot.db);
        } catch (error) {
            console.error('Command execution failed:', error);
            await interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true });
        }
    }
};
