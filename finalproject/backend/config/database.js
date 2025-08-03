const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database Configuration and Connection Pool
 * PT. Topline Evergreen Manufacturing Production System
 */

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || '34.101.128.165',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'Bangor',
    password: process.env.DB_PASSWORD || 'Bangor0802',
    database: process.env.DB_NAME || 'topline_manufacturing',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    // Enhanced SSL configuration for Google Cloud SQL
    ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
        rejectUnauthorized: false, // Google Cloud SQL uses self-signed certificates
        requestCert: false,
        agent: false
    } : false,
    // Optimized connection timeout settings for Cloud SQL
    connectTimeout: 120000, // 2 minutes
    acquireTimeout: 120000, // 2 minutes  
    timeout: 120000, // 2 minutes
    multipleStatements: false,
    // Additional Cloud SQL optimizations
    typeCast: true,
    supportBigNumbers: true,
    bigNumberStrings: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Test database connection
 */
async function testConnection() {
    try {
        console.log('🔄 Attempting to connect with config:', {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            database: dbConfig.database || 'mysql'
        });
        
        // First try to connect without database to create it if needed
        const connectionConfig = {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            charset: 'utf8mb4'
        };
        
        console.log('🔄 Connecting to MySQL server...');
        const tempConnection = await mysql.createConnection(connectionConfig);
        console.log('✅ Connected to MySQL server');
        
        // Create database if it doesn't exist
        console.log('🔄 Creating database if not exists...');
        await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log('✅ Database created/verified');
        await tempConnection.end();
        
        // Now connect to the actual database
        console.log('🔄 Connecting to specific database...');
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        console.log(`📊 Connected to: ${dbConfig.database}`);
        console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Full error:', error);
        return false;
    }
}

/**
 * Execute query with error handling
 */
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return {
            success: true,
            data: results,
            error: null
        };
    } catch (error) {
        console.error('Query execution error:', error);
        return {
            success: false,
            data: null,
            error: error.message
        };
    }
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
    // This function can be adapted to the new table names if needed
    try {
        const queries = [
            "SELECT COUNT(*) as count FROM outputmc",
            "SELECT COUNT(*) as count FROM wip",
            "SELECT COUNT(*) as count FROM fg",
            "SELECT COUNT(*) as count FROM do"
        ];

        const [outputMC] = await pool.execute(queries[0]);
        const [wip] = await pool.execute(queries[1]);
        const [fg] = await pool.execute(queries[2]);
        const [delivery] = await pool.execute(queries[3]);

        return {
            output_mc: outputMC[0]?.count || 0,
            wip: wip[0]?.count || 0,
            fg: fg[0]?.count || 0,
            delivery: delivery[0]?.count || 0
        };
    } catch (error) {
        console.error('Error getting database stats:', error);
        return {
            output_mc: 0,
            wip: 0,
            fg: 0,
            delivery: 0
        };
    }
}

/**
 * Initialize database tables if they don't exist
 * REPLACED WITH THE NEW SCHEMA
 */
async function initializeTables() {
    // Define tables in an order that respects foreign key constraints
    const tables = [
        {
            name: 'billofmaterial',
            sql: `
                CREATE TABLE IF NOT EXISTS billofmaterial (
                    partnumber VARCHAR(255) NOT NULL PRIMARY KEY,
                    customer VARCHAR(255) NOT NULL,
                    model VARCHAR(255) DEFAULT NULL,
                    description TEXT DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'wip',
            sql: `
                CREATE TABLE IF NOT EXISTS wip (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) NOT NULL,
                    quantity INT NOT NULL,
                    operator VARCHAR(100) DEFAULT NULL,
                    pic_qc VARCHAR(100) DEFAULT NULL,
                    pic_group_produksi VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_wip_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'fg',
            sql: `
                CREATE TABLE IF NOT EXISTS fg (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) NOT NULL,
                    quantity INT NOT NULL,
                    operator VARCHAR(100) DEFAULT NULL,
                    pic_qc VARCHAR(100) DEFAULT NULL,
                    pic_group_produksi VARCHAR(100) DEFAULT NULL,
                    pic_wh VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_fg_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'deliverychecklist',
            sql: `
                CREATE TABLE IF NOT EXISTS deliverychecklist (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) NOT NULL,
                    quantity INT NOT NULL,
                    pic_wh VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_delivery_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'secondproses',
            sql: `
                CREATE TABLE IF NOT EXISTS secondproses (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) NOT NULL,
                    quantity INT NOT NULL,
                    operator VARCHAR(100) DEFAULT NULL,
                    pic_group_produksi VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_secondproses_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'tfrwipqc',
            sql: `
                CREATE TABLE IF NOT EXISTS tfrwipqc (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) NOT NULL,
                    quantity INT NOT NULL,
                    pic_group_produksi VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_tfrwipqc_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'tffg',
            sql: `
                CREATE TABLE IF NOT EXISTS tffg (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) NOT NULL,
                    quantity INT NOT NULL,
                    pic_qc VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_tffg_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'po',
            sql: `
                CREATE TABLE IF NOT EXISTS po (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    nomor_po VARCHAR(100) NOT NULL,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) DEFAULT NULL,
                    quantity INT NOT NULL,
                    UNIQUE KEY unique_nomor_po (nomor_po),
                    CONSTRAINT fk_po_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'do',
            sql: `
                CREATE TABLE IF NOT EXISTS \`do\` (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    tanggal DATE NOT NULL,
                    nomor_do VARCHAR(100) NOT NULL,
                    nomor_po VARCHAR(100) NOT NULL,
                    partnumber VARCHAR(255) NOT NULL,
                    lotnumber VARCHAR(100) DEFAULT NULL,
                    quantity INT NOT NULL,
                    UNIQUE KEY unique_nomor_do (nomor_do),
                    CONSTRAINT fk_do_bom_final FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE,
                    CONSTRAINT fk_do_po_final FOREIGN KEY (nomor_po) REFERENCES po (nomor_po) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'outputmc',
            sql: `
                CREATE TABLE IF NOT EXISTS outputmc (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    customer VARCHAR(255) DEFAULT NULL,
                    partnumber VARCHAR(255) NOT NULL,
                    model VARCHAR(255) DEFAULT NULL,
                    description TEXT DEFAULT NULL,
                    quantity INT NOT NULL DEFAULT 0 COMMENT 'Jumlah produk yang bagus (OK)',
                    quantity_ng INT NOT NULL DEFAULT 0 COMMENT 'Jumlah produk yang tidak bagus (Not Good)',
                    machine VARCHAR(100) DEFAULT NULL,
                    operator VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_outputmc_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'ngqc',
            sql: `
                CREATE TABLE IF NOT EXISTS ngqc (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    customer VARCHAR(255) DEFAULT NULL,
                    partnumber VARCHAR(255) NOT NULL,
                    model VARCHAR(255) DEFAULT NULL,
                    description TEXT DEFAULT NULL,
                    lotnumber VARCHAR(100) DEFAULT NULL,
                    quantity INT NOT NULL,
                    operator VARCHAR(100) DEFAULT NULL,
                    pic_qc VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_ngqc_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'ngcustomer',
            sql: `
                CREATE TABLE IF NOT EXISTS ngcustomer (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    customer VARCHAR(255) DEFAULT NULL,
                    partnumber VARCHAR(255) NOT NULL,
                    model VARCHAR(255) DEFAULT NULL,
                    description TEXT DEFAULT NULL,
                    lotnumber VARCHAR(100) DEFAULT NULL,
                    quantity INT NOT NULL,
                    operator VARCHAR(100) DEFAULT NULL,
                    pic_wh VARCHAR(100) DEFAULT NULL,
                    CONSTRAINT fk_ngcustomer_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'stocktakefg',
            sql: `
                CREATE TABLE IF NOT EXISTS stocktakefg (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    stocktake_date DATE NOT NULL COMMENT 'Tanggal dilakukannya stock opname',
                    partnumber VARCHAR(255) NOT NULL,
                    model VARCHAR(255) DEFAULT NULL,
                    description TEXT DEFAULT NULL,
                    quantity_fg INT NOT NULL COMMENT 'Hasil hitung kuantitas di gudang FG',
                    pic VARCHAR(100) DEFAULT NULL COMMENT 'Penanggung jawab penghitungan',
                    auditor VARCHAR(100) DEFAULT NULL COMMENT 'Auditor verifikasi',
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu data dimasukkan',
                    CONSTRAINT fk_stocktakefg_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'stocktakewip',
            sql: `
                CREATE TABLE IF NOT EXISTS stocktakewip (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    stocktake_date DATE NOT NULL COMMENT 'Tanggal dilakukannya stock opname',
                    partnumber VARCHAR(255) NOT NULL,
                    model VARCHAR(255) DEFAULT NULL,
                    description TEXT DEFAULT NULL,
                    quantity_wip INT NOT NULL COMMENT 'Hasil hitung kuantitas di area WIP',
                    pic VARCHAR(100) DEFAULT NULL COMMENT 'Penanggung jawab penghitungan',
                    auditor VARCHAR(100) DEFAULT NULL COMMENT 'Auditor verifikasi',
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu data dimasukkan',
                    CONSTRAINT fk_stocktakewip_bom FOREIGN KEY (partnumber) REFERENCES billofmaterial (partnumber) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        },
        {
            name: 'users',
            sql: `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    departement VARCHAR(100) DEFAULT NULL,
                    password VARCHAR(255) NOT NULL COMMENT 'Simpan HASH password, bukan plain text!',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `
        }
    ];

    for (const table of tables) {
        try {
            await pool.execute(table.sql);
            console.log(`✅ Table '${table.name}' initialized successfully`);
        } catch (error) {
            console.error(`❌ Error initializing table '${table.name}':`, error.message);
        }
    }
}

module.exports = {
    pool,
    getConnection: () => pool.getConnection(),
    testConnection,
    executeQuery,
    getDatabaseStats,
    initializeTables
};