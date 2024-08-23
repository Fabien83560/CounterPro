const { selectDiscordServers, updateDiscordServerInfos } = require("../Functions/sql");

module.exports = async (oldGuild, newGuild) => {
    if (oldGuild && oldGuild.name && newGuild.name && oldGuild.name !== newGuild.name) {
        try {
            const server = await selectDiscordServers(newGuild.id);
            if (server.length > 0) {
                await updateDiscordServerInfos(newGuild.id, newGuild.name);
                console.log(`Mise à jour du nom de la guilde (${oldGuild.name}) dans la base de données : ${newGuild.name}`);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération ou de la mise à jour des informations du serveur :', error.message);
        }
    }
};
