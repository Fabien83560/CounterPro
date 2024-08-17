const getEmbed = require("../Functions/getEmbed");

const { selectDiscordServers, selectUserServerCounters, selectUsers, insertUsers, insertUserServerCounters, updateAllCounter } = require("../Functions/sql")

module.exports = async (bot, message) => {
    if (message.author.bot) return;
    const serverRows = await selectDiscordServers(message.guild.id);
    
    if (serverRows.length > 0) {
        const server = serverRows[0];
        const currentChannelId = server.channel_counter_id;

        if (message.channel.id === currentChannelId) {
            const messageCount = parseInt(message.content.trim(), 10);
            if (isNaN(messageCount) || messageCount !== server.counter_value + 1 || message.author.id === server.last_user_id) {
                await message.delete();
                return;
            }

            let userRows = await selectUsers(message.author.id)
            if (userRows.length === 0) {
                await insertUsers(message.author.id, message.author.username);
                await insertUserServerCounters(message.author.id, message.guild.id)
            }
            else {
                let userServerCounterRows = await selectUserServerCounters(message.author.id, message.guild.id);
                if(userServerCounterRows.length === 0)
                    await insertUserServerCounters(message.author.id, message.guild.id)
            }
            userRows = await selectUsers(message.author.id)

            await updateAllCounter(message.guild.id, message.author.id, 1);

            await message.delete();

            const successEmbed = await getEmbed(
                "DEFINED",
                `${message.author.globalName}`,
                `The count has been updated to \`${messageCount}\`.`,
                `${userRows[0].hex}`
            );

            return await message.channel.send({ embeds: [successEmbed] });
        }
    }
};
