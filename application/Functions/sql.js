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

async function selectDiscordServersLeaderboard() {
    const query = "SELECT * FROM discord_servers ORDER BY counter_value DESC";
    const params = [];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select in discord_servers table:", error.message);
    }
}

async function selectUsersLeaderboard() {
    const query = "SELECT * FROM users ORDER BY total_count DESC";
    const params = [];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select in users table:", error.message);
    }
}

async function selectUsersPerServer(server_id) {
    const query = "SELECT * FROM user_server_counters WHERE server_id = ? ORDER BY counter_value DESC";
    const params = [server_id];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select in user_server_counters table:", error.message);
    }
}

async function selectUsernameByUserId(user_id) {
    const query = "SELECT user_name FROM users WHERE user_id = ?";
    const params = [user_id];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error(`Failed to select user_name in users for ${user_id} table:`, error.message);
    }
}

async function selectServernameByServerId(server_id) {
    const query = "SELECT server_name FROM discord_servers WHERE server_id = ?";
    const params = [server_id];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error(`Failed to select server_name in discord_servers for ${server_id} table:`, error.message);
    }
}

async function selectDiscordServersTotalCounterValues() {
    const query = "SELECT SUM(counter_value) AS total_counter_value FROM discord_servers";
    const params = [];

    try {
        const results = await executeQuery(query, params);
        return results;
    } catch (error) {
        console.error("Failed to select from discord_servers table:", error.message);
        throw error;
    }
}

async function selectUserRank(user_id) {
    const checkUserExistsQuery = `
        SELECT 1
        FROM users
        WHERE user_id = ?;
    `;
    const checkParams = [user_id];

    try {
        const checkResults = await executeQuery(checkUserExistsQuery, checkParams);
        if (checkResults.length === 0) {
            return -1;
        }

        const rankQuery = `
            SELECT COUNT(*) AS count_above_threshold
            FROM users
            WHERE total_count > (
                SELECT total_count
                FROM users
                WHERE user_id = ?
            );
        `;
        const rankParams = [user_id];
        const rankResults = await executeQuery(rankQuery, rankParams);

        return rankResults[0].count_above_threshold + 1;
    } catch (error) {
        console.error("Failed to select from users table:", error.message);
        throw error;
    }
}

async function selectServerRank(server_id) {
    const checkServerExistsQuery = `
        SELECT 1
        FROM discord_servers
        WHERE server_id = ?;
    `;
    const checkParams = [server_id];

    try {
        const checkResults = await executeQuery(checkServerExistsQuery, checkParams);
        if (checkResults.length === 0) {
            return -1;
        }

        const rankQuery = `
            SELECT COUNT(*) AS count_above_threshold
            FROM discord_servers
            WHERE counter_value > (
                SELECT counter_value
                FROM discord_servers
                WHERE server_id = ?
            );
        `;
        const rankParams = [server_id];
        const rankResults = await executeQuery(rankQuery, rankParams);

        return rankResults[0].count_above_threshold + 1;
    } catch (error) {
        console.error("Failed to select from discord_servers table:", error.message);
        throw error;
    }
}

async function selectUserServerRank(user_id, server_id) {
    const checkUserServerExistsQuery = `
        SELECT 1
        FROM user_server_counters
        WHERE user_id = ? AND server_id = ?;
    `;
    const checkParams = [user_id, server_id];

    try {
        const checkResults = await executeQuery(checkUserServerExistsQuery, checkParams);
        if (checkResults.length === 0) {
            return -1;
        }

        const rankQuery = `
            SELECT COUNT(*) AS count_above_threshold
            FROM user_server_counters
            WHERE counter_value > (
                SELECT counter_value
                FROM user_server_counters
                WHERE user_id = ? AND server_id = ?
            );
        `;
        const rankParams = [user_id, server_id];
        const rankResults = await executeQuery(rankQuery, rankParams);

        return rankResults[0].count_above_threshold + 1;
    } catch (error) {
        console.error("Failed to select from user_server_counters table:", error.message);
        throw error;
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

async function insertDiscordServers(server_id, server_name, channel_counter_id, channel_information_id, channel_leaderboards_id) {
    const query = "INSERT INTO discord_servers (server_id, server_name, channel_counter_id, channel_information_id, channel_leaderboards_id) VALUES (?,?,?,?,?)";
    const params = [server_id, server_name, channel_counter_id, channel_information_id, channel_leaderboards_id];

    try {
        const results = await executeQuery(query, params);
    } catch (error) {
        console.error(`Failed to insert in discord_servers table: `, error.message);
    }
}

async function insertUsers(user_id, user_name) {
    const query = "INSERT INTO users (user_id, user_name, hex) VALUES (?,?,?)";
    const params = [user_id, user_name, `${await randomHEX()}`];

    try {
        const results = await executeQuery(query, params);
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
    selectDiscordServersLeaderboard,
    selectUsersLeaderboard,
    selectUsersPerServer,
    selectUsernameByUserId,
    selectServernameByServerId,
    selectDiscordServersTotalCounterValues,
    selectUserRank,
    selectServerRank,
    selectUserServerRank,

    insertVersion,
    insertDiscordServers,
    insertUsers,
    insertUserServerCounters,

    updateAllCounter,
    updateHexOfUser
};
