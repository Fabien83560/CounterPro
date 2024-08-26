const {
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require('discord.js');
const getEmbed = require("../Functions/getEmbed");
const { insertDiscordServers, selectDiscordServers, updateDiscordServerCounterChannel, updateDiscordServerLeaderboardsChannel, updateDiscordServerInformationChannel } = require("../Functions/sql");
const { updateServerInfoChannel } = require("../Functions/updateServerInfoChannels")

module.exports = {
    name: "setup",
    description: "Setup CounterPro Channels",
    permissions: [PermissionsBitField.Flags.Administrator],
    dm: false,
    category: "Initialization",

    async run(bot, interaction) {
        if (!interaction.isCommand()) return;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = await getEmbed("ERROR", "Insufficient permissions", "You need to be an administrator to use this command.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const serverRow = await selectDiscordServers(interaction.guild.id);
        if (serverRow.length > 0) {
            const embed = await getEmbed("DEFINED", "Re-Configure CounterPro Channels", "CounterPro channels have been deleted, select the option that interests you.", "#1E90FF");
            let row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('counter_channel_configuration')
                    .setLabel('Configure Counting')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('leaderboards_channel_configuration')
                    .setLabel('Configure Leaderboards')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('information_channel_configuration')
                    .setLabel('Configure Information')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('cancel_configuration')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
            );
            
            const configurationResponse = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
            const filter = i => i.isButton() && ['counter_channel_configuration', 'leaderboards_channel_configuration', 'information_channel_configuration', 'cancel_configuration'].includes(i.customId);
            const collector = configurationResponse.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: 'You are not allowed to interact with this message.', ephemeral: true });
                }

                if (i.customId === 'cancel_configuration') {
                    try {
                        const cancelEmbed = await getEmbed("DEFINED", "Re-Configure CounterPro Channel Canceled", `Configuration of channels was succesfully canceled`, "#1E90FF");
                        await i.update({ embeds: [cancelEmbed], components: [] });
                    } catch (error) {
                        console.error("An error occurred while unconfiguring:", error.message);
                    } finally {
                        collector.stop();
                    }
                } else if (i.customId === 'counter_channel_configuration') {
                    const server = i.guild;
                    const textChannels = server.channels.cache.filter(channel => channel.type === 0);
                
                    const options = textChannels.map(channel => {
                        return {
                            label: channel.name,
                            value: channel.id
                        };
                    });
                
                    if (options.length === 0) {
                        return i.reply({ content: "No text channel avalaible", ephemeral: true });
                    }
                
                    const selectMenu = new StringSelectMenuBuilder()
                        .setCustomId('select_counting_channel')
                        .setPlaceholder('Select text channel')
                        .addOptions(options);
                
                    const row = new ActionRowBuilder().addComponents(selectMenu);
                
                    const countingEmbed = await getEmbed(
                        "DEFINED",
                        "Configure Counting Channel",
                        `Counting channel for this server is actually ${serverRow[0].channel_counter_id ? `<#${serverRow[0].channel_counter_id}>` : `not defined `}. \n Select the counting channel from the drop-down list.`,
                        "#1E90FF"
                    );
                
                    i.update({ embeds: [countingEmbed], components: [row] });
                } else if (i.customId === 'leaderboards_channel_configuration') {
                    const server = i.guild;
                    const textChannels = server.channels.cache.filter(channel => channel.type === 0);
                
                    const options = textChannels.map(channel => {
                        return {
                            label: channel.name,
                            value: channel.id
                        };
                    });
                
                    if (options.length === 0) {
                        return i.reply({ content: "No text channel avalaible", ephemeral: true });
                    }
                
                    const selectMenu = new StringSelectMenuBuilder()
                        .setCustomId('select_leaderboards_channel')
                        .setPlaceholder('Select text channel')
                        .addOptions(options);
                
                    const row = new ActionRowBuilder().addComponents(selectMenu);
                
                    const countingEmbed = await getEmbed(
                        "DEFINED",
                        "Configure Leaderboards Channel",
                        `Leaderboards channel for this server is actually ${serverRow[0].channel_leaderboards_id ? `<#${serverRow[0].channel_leaderboards_id}>` : `not defined `}. \n Select the leaderboards channel from the drop-down list.`,
                        "#1E90FF"
                    );
                
                    i.update({ embeds: [countingEmbed], components: [row] });
                } else if (i.customId === 'information_channel_configuration') {
                    const server = i.guild;
                    const textChannels = server.channels.cache.filter(channel => channel.type === 0);
                
                    const options = textChannels.map(channel => {
                        return {
                            label: channel.name,
                            value: channel.id
                        };
                    });
                
                    if (options.length === 0) {
                        return i.reply({ content: "No text channel avalaible", ephemeral: true });
                    }
                
                    const selectMenu = new StringSelectMenuBuilder()
                        .setCustomId('select_information_channel')
                        .setPlaceholder('Select text channel')
                        .addOptions(options);
                
                    const row = new ActionRowBuilder().addComponents(selectMenu);
                
                    const countingEmbed = await getEmbed(
                        "DEFINED",
                        "Configure Information Channel",
                        `Information channel for this server is actually ${serverRow[0].channel_leaderboards_id ? `<#${serverRow[0].channel_leaderboards_id}>` : `not defined `}. \n Select the information channel from the drop-down list.`,
                        "#1E90FF"
                    );
                
                    i.update({ embeds: [countingEmbed], components: [row] });
                }
            });

            let selectedCountingChannelId;
            let selectedLeaderboardsChannelId;
            let selectedInformationChannelId;

            bot.on('interactionCreate', async interaction => {
                if (!interaction.isStringSelectMenu()) return;

                if (interaction.customId === 'select_counting_channel') {
                    selectedCountingChannelId = interaction.values[0];

                    const server = interaction.guild;
                    await updateDiscordServerCounterChannel(server.id, selectedCountingChannelId)
                    const finalEmbed = await getEmbed("DEFINED", "Counting Channel Setup", `Channel <#${selectedCountingChannelId}> was setup for new counting channel.`, "#1E90FF" )
                    
                    const channel = await bot.channels.fetch(selectedCountingChannelId);
                    if (!channel) {
                        console.error(`Channel with ID ${selectedCountingChannelId} not found`);
                        return;
                    }

                    const serverInfo = await selectDiscordServers(server.id);

                    const initialCountEmbed = await getEmbed(
                        "DEFINED",
                        "CounterPro",
                        `The count value is \`${serverInfo[0].counter_value}\`.`,
                        "#1E90FF"
                    );
                    channel.send({ embeds: [initialCountEmbed] })


                    await interaction.update({ embeds: [finalEmbed], components: [] });
                } else if (interaction.customId === 'select_leaderboards_channel') {
                    selectedLeaderboardsChannelId = interaction.values[0];

                    const server = interaction.guild;
                    await updateDiscordServerLeaderboardsChannel(server.id, selectedLeaderboardsChannelId)
                    const finalEmbed = await getEmbed("DEFINED", "Leaderboards Channel Setup", `Channel <#${selectedLeaderboardsChannelId}> was setup for new leaderboards channel.`, "#1E90FF" )

                    const serverData = await selectDiscordServers(server.id);
                    const data = serverData[0]
                    await updateServerInfoChannel(bot, data);


                    await interaction.update({ embeds: [finalEmbed], components: [] });
                }  else if (interaction.customId === 'select_information_channel') {
                    selectedInformationChannelId = interaction.values[0];

                    const server = interaction.guild;
                    await updateDiscordServerInformationChannel(server.id, selectedInformationChannelId)
                    const finalEmbed = await getEmbed("DEFINED", "Information Channel Setup", `Channel <#${selectedInformationChannelId}> was setup for new leaderboards channel.`, "#1E90FF" )

                    await interaction.update({ embeds: [finalEmbed], components: [] });
                }
            });


            return;
        }

        let embed = await getEmbed("DEFINED", "Initialization of CounterPro", "Welcome to CounterPro initialization.\nHere you can choose the configuration possibilities.\nChoose the type of configuration best suited to your needs.", "#1E90FF");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('automatic_configuration')
                .setLabel('Automatic')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('cancel_configuration')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
        );

        const configurationResponse = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        const filter = i => i.isButton() && ['automatic_configuration', 'cancel_configuration'].includes(i.customId);
        const collector = configurationResponse.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'You are not allowed to interact with this message.', ephemeral: true });
            }

            if (i.customId === 'cancel_configuration') {
                try {
                    const cancelEmbed = await getEmbed("DEFINED", "Initialization Canceled", `Initialization of CounterPro was canceled.`, "#1E90FF");
                    await i.update({ embeds: [cancelEmbed], components: [] });
                } catch (error) {
                    console.error("An error occurred while unconfiguring:", error.message);
                } finally {
                    collector.stop();
                }
            } else if (i.customId === 'automatic_configuration') {
                try {
                    const startingEmbed = await getEmbed("DEFINED", "Automatic Initialization Started", "Starting automatic configuration...", "#1E90FF");
                    await i.update({ embeds: [startingEmbed], components: [] });

                    const category = await i.guild.channels.create({
                        name: 'CounterPro',
                        type: 4,
                        position: 1,
                        reason: 'Automatic configuration of CounterPro'
                    });
                    const informationChannel = await i.guild.channels.create({
                        name: '📌-ɪɴꜰᴏʀᴍᴀᴛɪᴏɴꜱ',
                        type: 0,
                        parent: category.id,
                        permissionOverwrites: [
                            {
                                id: i.guild.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                                deny: [PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: i.client.user.id,
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageChannels],
                            },
                        ],
                        reason: 'Automatic configuration of CounterPro'
                    });

                    const leaderboardsChannel = await i.guild.channels.create({
                        name: '🏆 ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅꜱ',
                        type: 0,
                        parent: category.id,
                        permissionOverwrites: [
                            {
                                id: i.guild.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                                deny: [PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: i.client.user.id,
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageChannels],
                            },
                        ],
                        reason: 'Automatic configuration of CounterPro'
                    });

                    const countingChannel = await i.guild.channels.create({
                        name: '🔢-ᴄᴏᴜɴᴛɪɴɢ',
                        type: 0,
                        parent: category.id,
                        permissionOverwrites: [
                            {
                                id: i.guild.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                                deny: [PermissionsBitField.Flags.UseApplicationCommands]
                            },
                            {
                                id: i.client.user.id,
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageChannels],
                                deny: [PermissionsBitField.Flags.UseApplicationCommands]
                            },
                        ],
                        reason: 'Automatic configuration of CounterPro'
                    });

                    await insertDiscordServers(interaction.guild.id, interaction.guild.name, countingChannel.id, informationChannel.id, leaderboardsChannel.id);

                    const channel = await bot.channels.fetch(countingChannel.id);
                    if (!channel) {
                        console.error(`Channel with ID ${countingChannel.id} not found`);
                        return;
                    }
            
                    const initialCountEmbed = await getEmbed(
                        "DEFINED",
                        "CounterPro",
                        `The count has initialized at \`0\`.`,
                        "#1E90FF"
                    );

                    const serverData = await selectDiscordServers(interaction.guild.id);
                    const data = serverData[0]
                    updateServerInfoChannel(bot, data);

                    await channel.send({ embeds: [initialCountEmbed] });

                    const finalEmbed = await getEmbed("DEFINED", "CounterPro Automatic Configuration Completed", `You can now count in the channel <#${countingChannel.id}>.\nThe channel <#${informationChannel.id}> is at your disposal to have all the information in real-time from CounterPro.\nFinally, the channel <#${leaderboardsChannel.id}> will be updated at regular intervals to display the leaderboards.`, "#1E90FF");
                    await i.followUp({ embeds: [finalEmbed] });

                } catch (error) {
                    console.error("An error occurred during automatic configuration:", error.message);
                } finally {
                    collector.stop();
                }
            } else {
                console.error("An error occurred, the configuration button id is unknown:", i.customId);
                collector.stop();
                return;
            }
        });
    }
};
