const Discord = require("discord.js");
const getEmbed = require("../Functions/getEmbed");

module.exports = async (bot, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        let entry = interaction.options.getFocused();

        if (interaction.commandName === "leaderboard") {
            const choices = ["all", "servers", "here"];
            const filtered = choices.filter(choice => choice.startsWith(entry));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice }))
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
