const { selectDiscordServers, updateDiscordServerInfos } = require("../Functions/sql");

module.exports = async (oldGuild, newGuild) => {
    if (oldGuild.name !== newGuild.name) {
        try {
            const server = await selectDiscordServers(newGuild.id);
            if (server.length > 0) {
                await updateDiscordServerInfos(newGuild.id, newGuild.name);
            }
        } catch (error) {
            console.error('Error fetching or updating server info:', error.message);
        }
    }
};
