const fs = require('fs');
const path = require('path');
const loadDatabase = require("../Loaders/loadDatabase");
const loadSlashCommands = require("../Loaders/loadSlashCommands");
const { selectLastVersion, insertVersion, selectDiscordServersLeaderboard } = require("../Functions/sql");
const getLastCommit = require("../Functions/getLastCommit");
const getEmbed = require('../Functions/getEmbed');
const { updateAllServersInfoChannel } = require("../Functions/updateServerInfoChannels")
const webhookUrl = 'https://discord.com/api/webhooks/1272309942522740766/N2e0Ovu5QELU5I_74R-k33wQt-ylY_mPw6BR7VyLyJJ_avIiLIoxndS8YOZ-F2V7Rquj'; // URL du webhook Discord
const config = require("../config")

module.exports = async bot => {
    const fetch = (await import('node-fetch')).default;
    try {
        // Charger la base de données
        bot.db = await loadDatabase();
        bot.db.connect(function (err) {
            if (err) {
                console.error("Failed to connect to the database:", err.message);
                process.exit(1);
            } else {
                console.log("Database was successfully loaded !");
            }
        });

        await loadSlashCommands(bot);

        function getVersionFromReadme() {
            let readmePath = path.join(__dirname, '..', '..', 'readme.md');
            if(bot.user.username === "CounterPro")
                return config.currentVersion;
            
            if (!fs.existsSync(readmePath)) {
                console.error(`File not found: ${readmePath}`);
                return null;
            }

            const readmeContent = fs.readFileSync(readmePath, 'utf-8');

            const versionMatch = readmeContent.match(/Current Version: `(\d+\.\d+\.\d+)`/);
            return versionMatch ? versionMatch[1] : null;
        }

        function getMajorMinorVersion(version) {
            const versionParts = version.split('.');
            return versionParts.length >= 2 ? `${versionParts[0]}.${versionParts[1]}` : null;
        }

        const version = getVersionFromReadme();

        if (!version) {
            console.error("Version not found in README.md");
            process.exit(1);
        }

        let lastVersionResult = await selectLastVersion();
        let lastVersion = lastVersionResult.length > 0 ? lastVersionResult[0].version_number : null;

        if (!lastVersion || version !== lastVersion) {
            await insertVersion(version);

            const majorMinorVersion = getMajorMinorVersion(version);
            const lastMajorMinorVersion = lastVersion ? getMajorMinorVersion(lastVersion) : null;
            if (!lastMajorMinorVersion || majorMinorVersion !== lastMajorMinorVersion) {
                const commit = await getLastCommit();
                let embed = await getEmbed(
                    'INFO',
                    `A new version of ${bot.user.username} has been released (${version}).`,
                    `**${commit.commit.committer.name}** published a new update\nThe new functionality will allow __${commit.commit.message}__\n\nFor more information about the development of ${bot.user.username} go to the github: https://github.com/Fabien83560/CounterPro`
                );

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        embeds: [embed]
                    })
                });

                if (response.ok) {
                    console.log('Message sent successfully via webhook!');
                } else {
                    console.error('Failed to send message via webhook:', response.statusText);
                }
                
                const servers = await selectDiscordServersLeaderboard();
                for (const server of servers) {
                    const { channel_information_id } = server;
                    try {
                        if (channel_information_id) {
                            const channel = bot.channels.cache.get(channel_information_id);
                            if (channel) {
                                await channel.send({ embeds: [embed] });
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to send embed to channel with ID ${channel_information_id}:`, error.message);
                    }
                }
            }
        }

        console.log("");
        console.log(`Bot Version: ${version ? version : 'Unknown'}`);
        console.log(`${bot.user.username} : Online on ${bot.guilds.cache.size} servers!`);       

        await updateAllServersInfoChannel(bot);
    } catch (error) {
        console.error("An error occurred during the bot's startup:", error.message);
        process.exit(1);
    }
};