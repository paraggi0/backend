/**
 * Database Setup for PT. Topline Evergreen Manufacturing
 * Complete Database Schema Creation and Seed Data
 */

const { pool } = require('./databaseManager');

async function createAllTables() {
    console.log('🔄 Creating complete database schema...');
    
    try {
        // Create Bill of Material table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS billofmaterial (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partnumber TEXT NOT NULL,
                customer TEXT NOT NULL,
                model TEXT,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(partnumber, customer)
            )
        `);
        console.log('✅ Bill of Material table created');

        // Create WIP table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS wip (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partnumber TEXT NOT NULL,
                customer TEXT NOT NULL,
                model TEXT,
                description TEXT,
                quantity INTEGER NOT NULL DEFAULT 0,
                location TEXT DEFAULT 'WIP_WAREHOUSE',
                lotnumber TEXT,
                operator TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ WIP table created');

        // Create FG table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS fg (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partnumber TEXT NOT NULL,
                customer TEXT NOT NULL,
                model TEXT,
                description TEXT,
                quantity INTEGER NOT NULL DEFAULT 0,
                location TEXT DEFAULT 'FG_WAREHOUSE',
                lotnumber TEXT,
                operator TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ FG table created');

        // Create Material table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS material (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                material_code TEXT NOT NULL,
                material_name TEXT NOT NULL,
                supplier TEXT,
                quantity REAL NOT NULL DEFAULT 0,
                unit TEXT DEFAULT 'PCS',
                location TEXT DEFAULT 'MATERIAL_WAREHOUSE',
                lotnumber TEXT,
                operator TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Material table created');

        // Create Component table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS component (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                component_code TEXT NOT NULL,
                component_name TEXT NOT NULL,
                supplier TEXT,
                quantity REAL NOT NULL DEFAULT 0,
                unit TEXT DEFAULT 'PCS',
                location TEXT DEFAULT 'COMPONENT_WAREHOUSE',
                lotnumber TEXT,
                operator TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Component table created');

        // Create Schedule table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS schedule (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partnumber TEXT NOT NULL,
                description TEXT,
                supplier TEXT,
                delivery_date DATE NOT NULL,
                delivery_quantity INTEGER DEFAULT 0,
                daily_schedule INTEGER DEFAULT 0,
                minimum_stock INTEGER DEFAULT 0,
                type TEXT DEFAULT 'MATERIAL' CHECK(type IN ('MATERIAL', 'COMPONENT', 'PART')),
                status TEXT DEFAULT 'SCHEDULED' CHECK(status IN ('SCHEDULED', 'DELIVERED', 'DELAYED', 'CANCELLED')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Schedule table created');

        // Create Stock Transactions table for audit trail
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS stock_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_type TEXT NOT NULL,
                stock_type TEXT NOT NULL,
                partnumber TEXT NOT NULL,
                customer TEXT,
                lotnumber TEXT,
                quantity INTEGER DEFAULT 0,
                quantity_ng INTEGER DEFAULT 0,
                location TEXT,
                machine TEXT,
                operator TEXT NOT NULL,
                qr_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Stock Transactions table created');

        // Create Inventory Adjustments table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS inventory_adjustments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stock_type TEXT NOT NULL,
                record_id INTEGER NOT NULL,
                partnumber TEXT NOT NULL,
                customer TEXT,
                lotnumber TEXT,
                old_quantity INTEGER NOT NULL,
                new_quantity INTEGER NOT NULL,
                adjustment_reason TEXT,
                operator TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Inventory Adjustments table created');

        console.log('✅ All tables created successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
}

async function seedData() {
    console.log('🌱 Seeding initial data...');
    
    try {
        // Seed Bill of Material
        const bomData = [
            ['TL001', 'HONDA', 'CIVIC', 'Honda Civic Dashboard Component'],
            ['TL002', 'HONDA', 'ACCORD', 'Honda Accord Center Console'],
            ['TL003', 'TOYOTA', 'CAMRY', 'Toyota Camry Interior Panel'],
            ['TL004', 'TOYOTA', 'COROLLA', 'Toyota Corolla Door Handle'],
            ['TL005', 'NISSAN', 'ALTIMA', 'Nissan Altima Dashboard'],
            ['MT001', 'HONDA', 'CIVIC', 'Mounting Bracket Type A'],
            ['MT002', 'TOYOTA', 'CAMRY', 'Mounting Bracket Type B'],
            ['CP001', 'GENERAL', 'UNIVERSAL', 'Standard Screw Component'],
            ['CP002', 'GENERAL', 'UNIVERSAL', 'Universal Washer'],
            ['WR001', 'HONDA', 'CIVIC', 'Wire Harness Assembly']
        ];

        for (const [partnumber, customer, model, description] of bomData) {
            await pool.execute(`
                INSERT OR IGNORE INTO billofmaterial (partnumber, customer, model, description)
                VALUES (?, ?, ?, ?)
            `, [partnumber, customer, model, description]);
        }
        console.log('✅ BOM data seeded');

        // Seed WIP Stock (adjust to existing table structure)
        const wipData = [
            ['wip001', 'HONDA', 'TL001', 'CIVIC', 'Honda Civic Dashboard Component', 'LOT20250801001', 150, 'OP001', 'QC001', 'PROD001', 'WIP_AREA_1'],
            ['wip002', 'HONDA', 'TL002', 'ACCORD', 'Honda Accord Center Console', 'LOT20250801002', 120, 'OP002', 'QC002', 'PROD002', 'WIP_AREA_1'],
            ['wip003', 'TOYOTA', 'TL003', 'CAMRY', 'Toyota Camry Interior Panel', 'LOT20250801003', 200, 'OP001', 'QC001', 'PROD001', 'WIP_AREA_2'],
            ['wip004', 'TOYOTA', 'TL004', 'COROLLA', 'Toyota Corolla Door Handle', 'LOT20250801004', 300, 'OP003', 'QC003', 'PROD003', 'WIP_AREA_2'],
            ['wip005', 'NISSAN', 'TL005', 'ALTIMA', 'Nissan Altima Dashboard', 'LOT20250801005', 80, 'OP002', 'QC002', 'PROD002', 'WIP_AREA_3']
        ];

        for (const [id, customer, partnumber, model, description, lotnumber, quantity, operator, pic_qc, pic_production, location] of wipData) {
            await pool.execute(`
                INSERT OR IGNORE INTO wip (id, customer, partnumber, model, description, lotnumber, quantity, operator, pic_qc, pic_production, location)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, customer, partnumber, model, description, lotnumber, quantity, operator, pic_qc, pic_production, location]);
        }
        console.log('✅ WIP stock data seeded');

        // Seed Material
        const materialData = [
            ['MAT001', 'ABS Plastic Resin', 'SUPPLIER_A', 1000, 'KG', 'MAT_WAREHOUSE', 'MAT20250801001', 'WH001'],
            ['MAT002', 'PC Plastic Resin', 'SUPPLIER_B', 800, 'KG', 'MAT_WAREHOUSE', 'MAT20250801002', 'WH001'],
            ['MAT003', 'Steel Sheet', 'SUPPLIER_C', 500, 'KG', 'MAT_WAREHOUSE', 'MAT20250801003', 'WH002'],
            ['MAT004', 'Aluminum Sheet', 'SUPPLIER_D', 300, 'KG', 'MAT_WAREHOUSE', 'MAT20250801004', 'WH002']
        ];

        for (const [material_code, material_name, supplier, quantity, unit, location, lotnumber, operator] of materialData) {
            await pool.execute(`
                INSERT INTO material (material_code, material_name, supplier, quantity, unit, location, lotnumber, operator)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [material_code, material_name, supplier, quantity, unit, location, lotnumber, operator]);
        }
        console.log('✅ Material data seeded');

        // Seed Component
        const componentData = [
            ['CMP001', 'Standard Screw M4x20', 'SUPPLIER_E', 5000, 'PCS', 'CMP_WAREHOUSE', 'CMP20250801001', 'WH003'],
            ['CMP002', 'Washer M4', 'SUPPLIER_E', 5000, 'PCS', 'CMP_WAREHOUSE', 'CMP20250801002', 'WH003'],
            ['CMP003', 'Wire Connector', 'SUPPLIER_F', 1000, 'PCS', 'CMP_WAREHOUSE', 'CMP20250801003', 'WH003'],
            ['CMP004', 'LED Indicator', 'SUPPLIER_G', 500, 'PCS', 'CMP_WAREHOUSE', 'CMP20250801004', 'WH004']
        ];

        for (const [component_code, component_name, supplier, quantity, unit, location, lotnumber, operator] of componentData) {
            await pool.execute(`
                INSERT INTO component (component_code, component_name, supplier, quantity, unit, location, lotnumber, operator)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [component_code, component_name, supplier, quantity, unit, location, lotnumber, operator]);
        }
        console.log('✅ Component data seeded');

        // Seed Schedule
        const scheduleData = [
            ['TL001', 'Honda Civic Dashboard Component', 'SUPPLIER_A', '2025-08-05', 200, 100, 50],
            ['TL002', 'Honda Accord Center Console', 'SUPPLIER_A', '2025-08-06', 150, 75, 30],
            ['MAT001', 'ABS Plastic Resin', 'SUPPLIER_A', '2025-08-04', 500, 0, 200],
            ['MAT002', 'PC Plastic Resin', 'SUPPLIER_B', '2025-08-07', 400, 0, 150],
            ['CMP001', 'Standard Screw M4x20', 'SUPPLIER_E', '2025-08-03', 2000, 0, 1000]
        ];

        for (const [partnumber, description, supplier, delivery_date, delivery_quantity, daily_schedule, minimum_stock] of scheduleData) {
            await pool.execute(`
                INSERT INTO schedule (partnumber, description, supplier, delivery_date, delivery_quantity, daily_schedule, minimum_stock)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [partnumber, description, supplier, delivery_date, delivery_quantity, daily_schedule, minimum_stock]);
        }
        console.log('✅ Schedule data seeded');

        // Seed some Production Output (adjust to existing structure)
        const outputData = [
            ['out001', 'HONDA', 'TL001', 'CIVIC', 'Honda Civic Dashboard Component', 45, 5, 'MC001', 'OP001', 'LOT20250801001', '1', '2025-08-02'],
            ['out002', 'HONDA', 'TL002', 'ACCORD', 'Honda Accord Center Console', 38, 2, 'MC002', 'OP002', 'LOT20250801002', '1', '2025-08-02'],
            ['out003', 'TOYOTA', 'TL003', 'CAMRY', 'Toyota Camry Interior Panel', 72, 3, 'MC001', 'OP001', 'LOT20250801003', '2', '2025-08-02'],
            ['out004', 'TOYOTA', 'TL004', 'COROLLA', 'Toyota Corolla Door Handle', 95, 5, 'MC003', 'OP003', 'LOT20250801004', '1', '2025-08-02']
        ];

        for (const [id, customer, partnumber, model, description, quantity, quantity_ng, machine, operator, lotnumber, shift, production_date] of outputData) {
            await pool.execute(`
                INSERT OR IGNORE INTO outputmc (id, customer, partnumber, model, description, quantity, quantity_ng, machine, operator, lotnumber, shift, production_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, customer, partnumber, model, description, quantity, quantity_ng, machine, operator, lotnumber, shift, production_date]);
        }
        console.log('✅ Production output data seeded');

        // Update machine status - skip update jika tidak ada data
        console.log('ℹ️ Skipping machine status update - will be handled by main system');

        console.log('🌱 All seed data inserted successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
}

async function setupCompleteDatabase() {
    try {
        await createAllTables();
        await seedData();
        console.log('🎉 Complete database setup finished successfully!');
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    }
}

// Export functions
module.exports = {
    createAllTables,
    seedData,
    setupCompleteDatabase
};

// Run setup if called directly
if (require.main === module) {
    setupCompleteDatabase()
        .then(() => {
            console.log('✅ Database setup complete');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Setup failed:', error);
            process.exit(1);
        });
}
