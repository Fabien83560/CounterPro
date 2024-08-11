const getEmbed = require("../Functions/getEmbed");
const { addLog, selectUsersByUserId, insertUser, updateUser, updateCounterChannel, selectCounterByServerId, selectDiscordServerByServerId, insertDiscordServer, insertCounter,selectCounterTableByServerId } = require("../Functions/sql")
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "init",
    description: "Initializes the current channel as the counting channel",
    permissions: [
        PermissionsBitField.Flags.Administrator
    ],
    dm: false,
    category: "Administration",

    async run(bot, interaction) {
        if (!interaction.isCommand()) return;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
        }

        try {
            // Vérifier si une entrée existe déjà pour ce serveur
            const counterRows = await selectCounterTableByServerId(interaction.guild.id);
            if (counterRows.length > 0) {
                // Le serveur a déjà un canal configuré
                const oldChannelId = counterRows[0].channel_id;

                if (oldChannelId === interaction.channel.id) {
                    // Le canal actuel est déjà le canal de comptage configuré
                    const alreadySetEmbed = await getEmbed(
                        "INFO",
                        "Channel Already Set",
                        `The current channel <#${interaction.channel.id}> is already set as the counting channel.`
                    );
                    
                    await interaction.reply({ embeds: [alreadySetEmbed], ephemeral: true });
                    return;
                }

                const updateEmbed = await getEmbed(
                    "INFO",
                    "Channel Update",
                    `This server already has a counting channel set to <#${oldChannelId}>. Do you want to replace it with <#${interaction.channel.id}>?`
                );

                // Créer les boutons de confirmation
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_replace')
                        .setLabel('Replace')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Danger)
                );

                const confirmationMessage = await interaction.reply({ embeds: [updateEmbed], components: [row], fetchReply: true });

                const filter = i => i.isButton() && ['confirm_replace', 'cancel'].includes(i.customId);
                const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 15000 });

                collector.on('collect', async i => {
                    if (i.customId === 'confirm_replace') {
                        try {
                            // Vérifier si l'utilisateur existe dans la table users
                            const userRows = await selectUsersByUserId(interaction.user.id);

                            if (userRows.length === 0) {
                                // Ajouter l'utilisateur s'il n'existe pas
                                await insertUser(interaction.user.id, interaction.user.username, 0);
                            } else {
                                // Incrémenter le total_count de l'utilisateur existant
                                await updateUser(interaction.user.id);
                            }

                            // Mise à jour du canal dans la table counter
                            await updateCounterChannel(interaction.channel.id, counterRows[0].last_user_id, interaction.guild.id);

                            // Édition du message de confirmation
                            const replaceEmbed = await getEmbed("INFO", "Channel Replaced", `The counting channel has been updated to <#${interaction.channel.id}>.`);
                            await confirmationMessage.edit({ embeds: [replaceEmbed], components: [] });

                            // Envoi du message avec la valeur initiale du compteur
                            const newCounterRow = await selectCounterByServerId(interaction.guild.id);
                            if (newCounterRow.length > 0) {
                                const counterValue = newCounterRow[0].counter_value;
                                const counterValueEmbed = await getEmbed(
                                    "INFO",
                                    "Counter Value",
                                    `The counting channel is now <#${interaction.channel.id}> and the initial counter value is **${counterValue}** by <@${newCounterRow[0].last_user_id}>.`
                                );
                                await interaction.channel.send({ embeds: [counterValueEmbed] });
                            } else {
                                // Si aucune ligne n'est trouvée pour le serveur, envoyer un message d'erreur
                                const noCounterEmbed = await getEmbed(
                                    "ERROR",
                                    "No Counter Found",
                                    `There was an issue retrieving the counter value for the channel <#${interaction.channel.id}>.`
                                );
                                await interaction.channel.send({ embeds: [noCounterEmbed] });
                            }

                            addLog('INFO', `Counting channel for server ${interaction.guild.name} (${interaction.guild.id}) replaced with channel ${interaction.channel.id}.`);

                        } catch (error) {
                            await confirmationMessage.edit({ content: "An error occurred while processing your request.", components: [] });
                        }
                        collector.stop();
                    } else if (i.customId === 'cancel') {
                        try {
                            const cancelEmbed = await getEmbed("INFO", "Canceled", `Initialization of counting channel has been canceled.`);
                            await confirmationMessage.edit({ embeds: [cancelEmbed], components: [] });
                        } catch (error) {
                            await addLog('ERROR', `Failed to send cancellation reply: ${error.message}`);
                        }
                        collector.stop();
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        confirmationMessage.edit({ content: "Initialization request timed out.", components: [] }).catch(async (error) => await addLog('ERROR', `Collector ended with timeout: ${error.message}`));
                    }
                });

            } else {
                // Le serveur n'a pas encore de canal configuré
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Confirm')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Danger)
                );

                const embed = await getEmbed("INFO", "Confirmation", "Are you sure you want to initialize this channel for counting?");
                const confirmationMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

                const filter = i => i.isButton() && ['confirm', 'cancel'].includes(i.customId);
                const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 15000 });

                collector.on('collect', async i => {
                    const servers = await selectDiscordServerByServerId(interaction.guild.id);
                    if(servers.length === 0)
                    {
                        await insertDiscordServer(interaction.guild.id,interaction.guild.name)
                    }


                    if (i.customId === 'confirm') {
                        try {
                            // Vérifier si l'utilisateur existe dans la table users
                            const userRows = await selectUsersByUserId(interaction.user.id);

                            if (userRows.length === 0) {
                                // Ajouter l'utilisateur s'il n'existe pas
                                await insertUser(interaction.user.id, interaction.user.username, 0);
                            } else {
                                // Incrémenter le total_count de l'utilisateur existant
                                await updateUser(interaction.user.id);
                            }

                            // Création d'une nouvelle entrée dans la table counter
                            await insertCounter(interaction.guild.id, interaction.channel.id, 0, interaction.user.id);

                            // Édition du message de confirmation
                            const createEmbed = await getEmbed("INFO", "Channel Initialized", `The channel <#${interaction.channel.id}> has been initialized for counting.`);
                            await confirmationMessage.edit({ embeds: [createEmbed], components: [] });

                            // Envoi du message avec la valeur initiale du compteur
                            const counterValueEmbed = await getEmbed(
                                "INFO",
                                "Count Updated",
                                `The counting channel is now <#${interaction.channel.id}> and the initial counter value is **0**.`
                            );
                            await interaction.channel.send({ embeds: [counterValueEmbed] });

                        } catch (error) {
                            await confirmationMessage.edit({ content: "An error occurred while processing your request.", components: [] });
                        }
                        collector.stop();
                    } else if (i.customId === 'cancel') {
                        try {
                            const cancelEmbed = await getEmbed("INFO", "Canceled", `Initialization of ${interaction.guild.name} has been canceled.`);
                            await confirmationMessage.edit({ embeds: [cancelEmbed], components: [] });
                        } catch (error) {
                            await addLog('ERROR', `Failed to send cancellation reply: ${error.message}`);
                        }
                        collector.stop();
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        confirmationMessage.edit({ content: "Initialization request timed out.", components: [] }).catch(async (error) => await addLog('ERROR', `Collector ended with timeout: ${error.message}`));
                    }
                });
            }

        } catch (error) {
            console.error('Error handling the init command:', error);
            await interaction.reply({ content: "An error occurred while processing your request.", ephemeral: true });
            await addLog('ERROR', `Initialization command failed: ${error.message}`);
        }
    }
};
