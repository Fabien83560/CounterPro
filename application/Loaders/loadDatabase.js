const mysql = require('mysql2/promise');
const config = require("../../config");

module.exports = async () => {
    const connection = await mysql.createConnection({
        host: config.databaseHost,
        user: config.databaseUser,
        password: config.databasePassword,
        database: config.databaseName,
        port: config.databasePort || 3306,
    });

    try {
        await connection.ping();
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }

    return connection;
}
