const mysql = require('mysql2/promise');
const config = require('../../config')

const pool = mysql.createPool({
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


async function executeQuery(query, params = []) {
    let connection;

    try {
        connection = await pool.getConnection();
        const [results] = await connection.execute(query, params);

        return results;
    } catch (error) {
         const formattedQuery = query.replace(/\?/g, () => params.shift());

         console.error('Error during SQL query execution:');
         console.error('SQL Query:', formattedQuery);
         console.error('SQL Error:', error.sqlMessage || error.message);
 
         throw new Error(`SQL query execution error: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = executeQuery;
