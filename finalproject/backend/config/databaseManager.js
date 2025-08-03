require('dotenv').config();

/**
 * Database Configuration Manager
 * Supports both MySQL (Google Cloud SQL) and SQLite (Local)
 * PT. Topline Evergreen Manufacturing
 */

const dbType = process.env.DB_TYPE || 'mysql';

let database;

if (dbType === 'sqlite') {
    // Use local SQLite database
    console.log('📊 Using Local SQLite Database');
    database = require('./databaseAdapter');
} else {
    // Use MySQL/Google Cloud SQL
    console.log('📊 Using MySQL/Google Cloud SQL Database');
    database = require('./database');
}

module.exports = database;
