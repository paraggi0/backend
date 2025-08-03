const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

/**
 * Local SQLite Database Configuration
 * PT. Topline Evergreen Manufacturing Production System
 */

// Ensure database directory exists
const dbDir = path.join('C:', 'Users', 'SOLIT', 'finalproject', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`📁 Created database directory: ${dbDir}`);
}

// Database file path
const dbPath = path.join(dbDir, 'topline_manufacturing.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log(`✅ Connected to SQLite database: ${dbPath}`);
    }
});

/**
 * Initialize database tables for production system
 */
async function initializeTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log('🔄 Initializing database tables...');

            // 1. Users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    department TEXT,
                    role TEXT NOT NULL,
                    status TEXT DEFAULT 'active',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('❌ Error creating users table:', err);
                else console.log('✅ Table users created successfully');
            });

            // 2. Output MC table (Machine Output)
            db.run(`
                CREATE TABLE IF NOT EXISTS outputmc (
                    id TEXT PRIMARY KEY,
                    customer TEXT NOT NULL,
                    partnumber TEXT NOT NULL,
                    model TEXT NOT NULL,
                    description TEXT,
                    quantity INTEGER DEFAULT 0,
                    quantity_ng INTEGER DEFAULT 0,
                    machine TEXT NOT NULL,
                    operator TEXT NOT NULL,
                    lotnumber TEXT,
                    shift TEXT DEFAULT '1',
                    production_date DATE,
                    production_time TIME,
                    status TEXT DEFAULT 'active',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('❌ Error creating outputmc table:', err);
                else console.log('✅ Table outputmc created successfully');
            });

            // 3. WIP table
            db.run(`
                CREATE TABLE IF NOT EXISTS wip (
                    id TEXT PRIMARY KEY,
                    customer TEXT NOT NULL,
                    partnumber TEXT NOT NULL,
                    model TEXT NOT NULL,
                    description TEXT,
                    lotnumber TEXT NOT NULL,
                    quantity INTEGER DEFAULT 0,
                    operator TEXT,
                    pic_qc TEXT,
                    pic_production TEXT,
                    location TEXT,
                    status TEXT DEFAULT 'available',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('❌ Error creating wip table:', err);
                else console.log('✅ Table wip created successfully');
            });

            // 4. Second Process table
            db.run(`
                CREATE TABLE IF NOT EXISTS secondproses (
                    id TEXT PRIMARY KEY,
                    wo_number TEXT NOT NULL,
                    partnumber TEXT NOT NULL,
                    process_type TEXT NOT NULL,
                    from_station TEXT NOT NULL,
                    to_station TEXT,
                    current_qty INTEGER DEFAULT 0,
                    progress_percentage REAL DEFAULT 0.00,
                    estimated_completion DATETIME,
                    status TEXT DEFAULT 'pending',
                    operator TEXT,
                    supervisor TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('❌ Error creating secondproses table:', err);
                else console.log('✅ Table secondproses created successfully');
            });

            // 5. Transfer WIP QC table
            db.run(`
                CREATE TABLE IF NOT EXISTS tfrwipqc (
                    id TEXT PRIMARY KEY,
                    qc_batch_id TEXT UNIQUE NOT NULL,
                    partnumber TEXT NOT NULL,
                    model TEXT NOT NULL,
                    quantity_sent INTEGER DEFAULT 0,
                    from_process TEXT NOT NULL,
                    qc_priority TEXT DEFAULT 'normal',
                    transfer_time DATETIME NOT NULL,
                    qc_status TEXT DEFAULT 'pending',
                    qc_inspector TEXT,
                    transfer_operator TEXT,
                    remarks TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('❌ Error creating tfrwipqc table:', err);
                else console.log('✅ Table tfrwipqc created successfully');
            });

            // 6. Machine Status table
            db.run(`
                CREATE TABLE IF NOT EXISTS machine_status (
                    id TEXT PRIMARY KEY,
                    machine_id TEXT UNIQUE NOT NULL,
                    machine_name TEXT NOT NULL,
                    current_status TEXT DEFAULT 'idle',
                    target_percentage REAL DEFAULT 0.00,
                    actual_percentage REAL DEFAULT 0.00,
                    efficiency_percentage REAL DEFAULT 0.00,
                    output_today INTEGER DEFAULT 0,
                    target_output_today INTEGER DEFAULT 0,
                    current_operator TEXT,
                    shift TEXT DEFAULT '1',
                    last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
                    location TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('❌ Error creating machine_status table:', err);
                else console.log('✅ Table machine_status created successfully');
                resolve();
            });
        });
    });
}

/**
 * Execute query with parameters
 */
function executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve([rows]);
            });
        } else {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ insertId: this.lastID, changes: this.changes });
            });
        }
    });
}

/**
 * Test database connection
 */
async function testConnection() {
    try {
        const result = await executeQuery('SELECT 1 as test, datetime("now") as current_time');
        console.log('✅ Database connection test successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error);
        return false;
    }
}

/**
 * Close database connection
 */
function closeConnection() {
    return new Promise((resolve) => {
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err);
            } else {
                console.log('✅ Database connection closed');
            }
            resolve();
        });
    });
}

module.exports = {
    db,
    executeQuery,
    testConnection,
    initializeTables,
    closeConnection,
    dbPath
};
