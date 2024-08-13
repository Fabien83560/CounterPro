const getEmbed = require("../Functions/getEmbed");

const { selectCounterTableByServerId, selectUsersByUserId, insertUser, insertUserServerCounter, updateUserServerCounter } = require("../Functions/sql")

module.exports = async (bot, message) => {
    if (message.author.bot) return;
    /*
    const counterRows = await selectCounterTableByServerId(message.guild.id);
    
    if (counterRows.length > 0) {
        const counter = counterRows[0];
        const currentChannelId = counter.channel_id;

        if (message.channel.id === currentChannelId) {
            const messageCount = parseInt(message.content.trim(), 10);
            if (isNaN(messageCount) || messageCount !== counter.counter_value + 1 || message.author.id === counter.last_user_id) {
                await message.delete();
                return;
            }

            let userRows = await selectUsersByUserId(message.author.id);

            if (userRows.length === 0) {
                await insertUser(message.author.id, message.author.username, 0);
                await insertUserServerCounter(message.author.id, message.guild.id)
                userRows = await selectUsersByUserId(message.author.id);
            }
            
            await updateUserServerCounter(message.author.id, message.guild.id, 1);

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
        */
};
