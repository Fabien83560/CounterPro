const executeQuery = require('./executeQuery');
const randomHEX = require('./randomHEX');

// SELECT
async function selectLastVersion() {
    const query = "SELECT * FROM version ORDER BY inserted_at DESC LIMIT 1";
    const params = [];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select last version from version table:", error.message);
    }
}

async function selectDiscordServers(server_id) {
    const query = "SELECT * FROM discord_servers WHERE server_id = ?";
    const params = [server_id];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select in discord_servers table:", error.message);
    }
}

async function selectUsers(user_id) {
    const query = "SELECT * FROM users WHERE user_id = ?";
    const params = [user_id];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select in users table:", error.message);
    }
}

async function selectUserServerCounters(user_id, server_id) {
    const query = "SELECT * FROM user_server_counters WHERE user_id = ? AND server_id = ?";
    const params = [user_id, server_id];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select in user_server_counters table:", error.message);
    }
}

// INSERT
async function insertVersion(version) {
    const query = "INSERT INTO version (version_number) VALUES (?)";
    const params = [version];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to insert in version table:`, error.message);
    }
}

async function insertLog(type, message) {
    const query = "INSERT INTO logs (log_date, type, message) VALUES (NOW(), ?, ?)";
    const params = [type, message];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error("Failed to insert in logs table:", error.message);
    }
}

async function insertDiscordServers(server_id, server_name, channel_counter_id, channel_information_id, channel_leaderboards_id) {
    const query = "INSERT INTO discord_servers (server_id, server_name, channel_counter_id, channel_information_id, channel_leaderboards_id) VALUES (?,?,?,?,?)";
    const params = [server_id, server_name, channel_counter_id, channel_information_id, channel_leaderboards_id];

    try {
        const results = await executeQuery(query, params);
        insertLog("INFO", `Server ${server_name}(${server_id}) was added`)
    } catch (error) {
        console.error(`Failed to insert in discord_servers table: `, error.message);
    }
}

async function insertUsers(user_id, user_name) {
    const query = "INSERT INTO users (user_id, user_name, hex) VALUES (?,?,?)";
    const params = [user_id, user_name, `${await randomHEX()}`];

    try {
        const results = await executeQuery(query, params);
        insertLog("INFO", `User ${user_name}(${user_id}) was added`)
    } catch (error) {
        console.error(`Failed to insert in users table: `, error.message);
    }
}

async function insertUserServerCounters(user_id, server_id) {
    const query = "INSERT INTO user_server_counters (user_id, server_id) VALUES (?,?)";
    const params = [user_id, server_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to insert in user_server_counters table: `, error.message);
    }
}


// UPDATE
async function updateUserServerCounters(server_id, user_id, increment) {
    const query = "UPDATE user_server_counters SET counter_value = counter_value + ? WHERE user_id = ? AND server_id = ?";
    const params = [increment, user_id, server_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to update all counters for user ${user_id} and server ${server_id}: `, error.message);
    }
}

async function updateUsers(user_id, increment) {
    const query = "UPDATE users SET total_count = total_count + ? WHERE user_id = ?";
    const params = [increment, user_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to update total_count for user ${user_id}: `, error.message);
    }
}

async function updateDiscordServers(server_id, user_id, increment) {
    const query = "UPDATE discord_servers SET counter_value = counter_value + ?, last_user_id = ? WHERE server_id = ?";
    const params = [increment, user_id, server_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to update counter_value for server ${server_id}: `, error.message);
    }
}

async function updateAllCounter(server_id, user_id, increment) {
    updateUserServerCounters(server_id, user_id,increment)
    updateUsers(user_id, increment)
    updateDiscordServers(server_id, user_id, increment)
}

async function updateHexOfUser(user_id, newHex) {
    const query = "UPDATE users SET hex = ? WHERE user_id = ?";
    const params = [newHex, user_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to update hew for user ${user_id}: `, error.message);
    }
}

module.exports = {
    selectLastVersion,
    selectDiscordServers,
    selectUsers,
    selectUserServerCounters,

    insertVersion,
    insertLog,
    insertDiscordServers,
    insertUsers,
    insertUserServerCounters,

    updateAllCounter,
    updateHexOfUser
};
