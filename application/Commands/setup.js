const {
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const getEmbed = require("../Functions/getEmbed");
const { insertDiscordServers, selectDiscordServers } = require("../Functions/sql");
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
            const embed = await getEmbed("WARNING", "CounterPro Channels Already Exist", "CounterPro channels are already defined in your Discord server.");
            return await interaction.reply({ embeds: [embed] });
        }

        let embed = await getEmbed("DEFINED", "Initialization of CounterPro", "Welcome to CounterPro initialization.\nHere you can choose the configuration possibilities.\nChoose the type of configuration best suited to your needs.", "#1E90FF");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('automatic_configuration')
                .setLabel('Automatic')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('custom_configuration')
                .setLabel('Custom')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cancel_configuration')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
        );

        const configurationResponse = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        const filter = i => i.isButton() && ['automatic_configuration', 'custom_configuration', 'cancel_configuration'].includes(i.customId);
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
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
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
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
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
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
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
            } else if (i.customId === 'custom_configuration') {
                const startingEmbed = await getEmbed("DEFINED", /*"Custom Initialization Started"*/"Custom Initialization", "Custom configuration is coming soon", "#1E90FF");
                await i.update({ embeds: [startingEmbed], components: [] });
            } else {
                console.error("An error occurred, the configuration button id is unknown:", i.customId);
                collector.stop();
                return;
            }
        });
    }
};
