const { executeQuery, testConnection, initializeTables, dbPath } = require('./localDatabase');

/**
 * Database Adapter for Local SQLite
 * Compatible with existing MySQL2 API calls
 * PT. Topline Evergreen Manufacturing
 */

// Create pool-like interface for compatibility
const pool = {
    async execute(sql, params = []) {
        const result = await executeQuery(sql, params);
        // executeQuery returns [rows, info], we need just rows for compatibility
        return result;
    },
    
    async getConnection() {
        // Return pool itself for compatibility
        return pool;
    },
    
    release() {
        // No-op for SQLite (no connection pooling needed)
    }
};

// Export functions to match the MySQL database.js interface
module.exports = {
    pool,
    executeQuery,
    testConnection,
    initializeTables,
    dbPath
};
