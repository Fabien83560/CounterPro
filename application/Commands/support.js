const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle } = require('discord.js');
    const getEmbed = require("../Functions/getEmbed");
const config = require("../config");

module.exports = {
    name: "support",
    description: "Provides information on how to get support",
    permission: "Aucune",
    dm: false,
    category: "Support",

    async run(bot, interaction) {
        if (!interaction.isCommand()) return;

        const embed = await getEmbed("DEFINED", "Need Support ?", "If you need to report a bug or ask a question, please join our support server for assistance.", "#1E90FF");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Join Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL(config.supportServerInvite)
        );

        try {
            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        } catch (error) {
            console.error("An error occurred while sending the support message:", error.message);
            await interaction.reply({ content: 'There was an error sending the support message. Please try again later.', ephemeral: true });
        }
    }
};
