const { selectDiscordServersLeaderboard } = require("./sql")

module.exports = async () => {
    const servers = await selectDiscordServersLeaderboard();

    if (servers.length === 0) {
        return {};
    }

    const serversHashmap = {};
    servers.forEach(server => {
        serversHashmap[server.server_name] = server.server_id;
    });
    return serversHashmap;
}