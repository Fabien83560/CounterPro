const { Mutex } = require('async-mutex');
const getEmbed = require("../Functions/getEmbed");
const {
    selectDiscordServers,
    selectUserServerCounters,
    selectUsers,
    insertUsers,
    insertUserServerCounters,
    updateAllCounter
} = require("../Functions/sql");
const { pool } = require("../Functions/executeQuery");

const mutex = new Mutex();

module.exports = async (bot, message) => {
    if (message.author.bot) return;

    const release = await mutex.acquire();

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const serverRows = await selectDiscordServers(message.guild.id, connection);
        if (serverRows.length === 0) {
            await connection.rollback();
            return;
        }

        const server = serverRows[0];
        const currentChannelId = server.channel_counter_id;

        if (message.channel.id !== currentChannelId) {
            await connection.rollback();
            return;
        }
        const messageCount = parseInt(message.content.trim(), 10);
        if (isNaN(messageCount) || messageCount !== server.counter_value + 1 || message.author.id === server.last_user_id) {
            await message.delete();
            await connection.rollback();
            return;
        }

        let userRows = await selectUsers(message.author.id, connection);
        if (userRows.length === 0) {
            await insertUsers(message.author.id, message.author.username, connection);
            await insertUserServerCounters(message.author.id, message.guild.id, connection);
        } else {
            let userServerCounterRows = await selectUserServerCounters(message.author.id, message.guild.id, connection);
            if (userServerCounterRows.length === 0) {
                await insertUserServerCounters(message.author.id, message.guild.id, connection);
            }
        }

        userRows = await selectUsers(message.author.id, connection);

        const updateResult = await updateAllCounter(message.guild.id, message.author.id, 1, connection);

        if (!updateResult.success) {
            await connection.rollback();
            console.error('Update failed.');
            return;
        }

        await connection.commit();

        await message.delete();

        const successEmbed = await getEmbed(
            "DEFINED",
            `${message.author.globalName}`,
            `The count has been updated to \`${messageCount}\`.`,
            `${userRows[0].hex}`
        );

        return await message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
        await connection.rollback();
        console.error(`Error processing counting message:`, error.message);
    } finally {
        connection.release();
        release();
    }
};
