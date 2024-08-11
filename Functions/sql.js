const executeQuery = require('./executeQuery');
const randomHEX = require('./randomHEX');


async function addLog(type, message) {
    const query = "INSERT INTO logs (log_date, type, message) VALUES (NOW(), ?, ?)";
    const params = [type, message];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error("Failed to add log:", error.message);
    }
}

async function insertUser(user_id, user_name, total_count) {
    const query = "INSERT INTO users (user_id, user_name, total_count, hex) VALUES (?, ?, ?, ?)";
    const params = [user_id, user_name, total_count, `${await randomHEX()}`];

    try {
        const results = await executeQuery(query, params);
        addLog('INFO', `User ${user_id} added in users table.`);
    } catch (error) {
        console.error("Failed to insert user:", error.message);
    }
}

async function selectCounterTableByServerId(server_id) {
    const query = "SELECT * FROM counter WHERE server_id = ?";
    const params = [server_id];
    
    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select counter table by server ID:", error.message);
    }
}

async function selectUsersByUserId(user_id) {
    const query = "SELECT * FROM users WHERE user_id = ?";
    const params = [user_id];
    
    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select users table by user ID:", error.message);
    }
}

async function updateUser(user_id) {
    const query = "UPDATE users SET total_count = total_count + 1 WHERE user_id = ?";
    const params = [user_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error("Failed to update user:", error.message);
    }
}

async function updateCounter(counter_value, last_user_id, server_id) {
    const query = "UPDATE counter SET counter_value = ?, last_user_id = ? WHERE server_id = ?";
    const params = [counter_value, last_user_id, server_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to update counter for server ${server_id}:`, error.message);
    }
}

async function updateCounterChannel(channel_id, last_user_id, server_id) {
    const query = "UPDATE counter SET channel_id = ?, last_user_id = ? WHERE server_id = ?";
    const params = [channel_id, last_user_id, server_id];

    try {
        const results = await executeQuery(query, params);
        addLog('INFO', `Counter for server ${server_id} updated with new channel ${channel_id}.`);
    } catch (error) {
        console.error(`Failed to update channel counter for server ${server_id}:`, error.message);
    }
}

async function selectCounterByServerId(server_id) {
    const query = "SELECT * FROM counter WHERE server_id = ?";
    const params = [server_id];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select counter table by server ID:", error.message);
    }
}

async function selectDiscordServerByServerId(server_id) {
    const query = "SELECT * FROM discord_servers WHERE server_id = ?";
    const params = [server_id];
    
    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select discord server table by server ID:", error.message);
    }
}

async function insertDiscordServer(server_id, server_name) {
    const query = "INSERT INTO discord_servers (server_id, server_name) VALUES (?, ?)";
    const params = [server_id, server_name];

    try {
        const results = await executeQuery(query, params);
        addLog('INFO', `Server ${server_id} added in discord_servers table.`);
    } catch (error) {
        console.error("Failed to insert discord server:", error.message);
    }
}

async function insertCounter(server_id, channel_id, counter_value, last_user_id) {
    const query = "INSERT INTO counter (server_id, channel_id, counter_value, last_user_id) VALUES (?, ?, ?, ?)";
    const params = [server_id, channel_id, counter_value, last_user_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to insert counter for server ${server_id}:`, error.message);
    }
}

async function updateHexOfUser(user_id, new_hex) {
    const query = "UPDATE users SET hex = ? WHERE user_id = ?";
    const params = [new_hex, user_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to update hex of the user ${user_id}:`, error.message);
    }
}

module.exports = {
    addLog,
    insertUser,
    selectCounterTableByServerId,
    selectUsersByUserId,
    updateUser,
    updateCounter,
    updateCounterChannel,
    selectCounterByServerId,
    selectDiscordServerByServerId,
    insertDiscordServer,
    insertCounter,
    updateHexOfUser
};
