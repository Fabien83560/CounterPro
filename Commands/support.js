const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle 
} = require('discord.js');
const getEmbed = require("../Functions/getEmbed");
const { insertSupport, getUserIdFromSupport } = require("../Functions/sql");
const config = require("../config");

module.exports = {
    name: "support",
    description: "Allows you to write a message to the staff",
    permission: "Aucune",
    dm: false,
    category: "Support",

    async run(bot, interaction) {
        if (!interaction.isCommand()) return;

        // Embed d'introduction
        let embed = await getEmbed("DEFINED", "Support", "Here is the support command, here you can provide information about a bug present on CounterPro or even obtain information.\n Please select the option associated with your request.", "#1E90FF");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('bug_support')
                .setLabel('Report bug')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('question_support')
                .setLabel('Ask a question')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cancel_support')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
        );

        const supportResponse = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true, ephemeral: true });
        const filter = i => i.isButton() && ['bug_support', 'question_support', 'cancel_support'].includes(i.customId);
        const collector = supportResponse.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if(i.user.id !== interaction.user.id) {
                return i.reply({ content: 'You are not allowed to interact with this message.', ephemeral: true });
            }

            try {
                if (i.customId === 'cancel_support') {
                    const cancelEmbed = await getEmbed("DEFINED", "Support request Canceled", `Support request on CounterPro was canceled.`, "#1E90FF");
                    await i.update({ embeds: [cancelEmbed], components: [] });
                    collector.stop();
                }
                else if(i.customId === 'bug_support') {
                    const modal = new ModalBuilder()
                        .setCustomId('bug_report_modal')
                        .setTitle('Report a Bug');

                    const bugDescriptionInput = new TextInputBuilder()
                        .setCustomId('bug_description')
                        .setLabel("Please describe the bug in detail")
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Enter the details of the bug...')
                        .setRequired(true);

                    const firstActionRow = new ActionRowBuilder().addComponents(bugDescriptionInput);
                    modal.addComponents(firstActionRow);

                    await i.showModal(modal);
                }
                else if(i.customId === 'question_support') {
                    // Traitement pour le support question (si nécessaire)
                }
            } catch (error) {
                console.error("An error occurred while processing button interaction:", error.message);
                if (!i.replied) {
                    await i.reply({ content: 'There was an error processing your request. Please try again later.', ephemeral: true });
                }
            }
        });

        bot.on('interactionCreate', async interaction => {
            if (interaction.isModalSubmit()) {
                if (interaction.customId === 'bug_report_modal') {
                    const bugDescription = interaction.fields.getTextInputValue('bug_description');

                    try {
                        const supportId = await insertSupport(interaction.user.id, 'bug', bugDescription);
                        const bugReportEmbed = await getEmbed("DEFINED", `Support #${supportId}`, `A bug was reported:\n\n${bugDescription}`, "#1E90FF");

                        const supportChannel = await bot.channels.fetch(config.supportChannelId);

                        await supportChannel.send({
                            embeds: [bugReportEmbed],
                            components: []
                        });

                        const finalEmbed = await getEmbed("DEFINED", `Support ${supportId}`, `Your bug report has been correctly sent under number #${supportId}.\nThank you very much.`, "#1E90FF");
                        if (!interaction.replied) {
                            await interaction.update({ embeds: [finalEmbed], components: [], ephemeral: true });
                        }
                    } catch (error) {
                        console.error('An error occurred while processing the bug report:', error.message);
                        if (!interaction.replied) {
                            await interaction.update({ content: 'There was an error processing your report. Please try again later.', ephemeral: true });
                        }
                    }
                }
            }
        });
    }
};
