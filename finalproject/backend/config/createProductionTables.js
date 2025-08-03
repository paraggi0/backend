const { pool } = require('./database');

/**
 * Create Production Tables for PT. Topline Evergreen Manufacturing
 * Tables created based on frontend production pages requirements
 */

async function createProductionTables() {
    const connection = await pool.getConnection();
    
    try {
        console.log('🔄 Creating production tables based on frontend requirements...');

        // 1. Machine Output Table (mcoutput.html)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS machine_output (
                id VARCHAR(50) PRIMARY KEY,
                customer VARCHAR(100) NOT NULL,
                partnumber VARCHAR(100) NOT NULL,
                model VARCHAR(150) NOT NULL,
                description TEXT,
                quantity INT NOT NULL DEFAULT 0,
                quantity_ng INT NOT NULL DEFAULT 0,
                machine VARCHAR(50) NOT NULL,
                operator VARCHAR(100) NOT NULL,
                shift ENUM('1', '2', '3') DEFAULT '1',
                production_date DATE NOT NULL,
                production_time TIME NOT NULL,
                lot_number VARCHAR(100),
                quality_status ENUM('OK', 'NG', 'REWORK') DEFAULT 'OK',
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_partnumber (partnumber),
                INDEX idx_machine (machine),
                INDEX idx_production_date (production_date),
                INDEX idx_customer (customer)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table machine_output created successfully');

        // 2. WIP Second Process Table (wipsecond.html)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS wip_second_process (
                id VARCHAR(50) PRIMARY KEY,
                wo_number VARCHAR(100) NOT NULL,
                partnumber VARCHAR(100) NOT NULL,
                process_type VARCHAR(100) NOT NULL,
                from_station VARCHAR(100) NOT NULL,
                to_station VARCHAR(100),
                current_qty INT NOT NULL DEFAULT 0,
                completed_qty INT NOT NULL DEFAULT 0,
                progress_percentage DECIMAL(5,2) DEFAULT 0.00,
                estimated_completion DATETIME,
                actual_completion DATETIME,
                status ENUM('pending', 'in_progress', 'completed', 'on_hold', 'cancelled') DEFAULT 'pending',
                priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
                operator VARCHAR(100),
                supervisor VARCHAR(100),
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_wo_number (wo_number),
                INDEX idx_partnumber (partnumber),
                INDEX idx_status (status),
                INDEX idx_from_station (from_station)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table wip_second_process created successfully');

        // 3. WIP Inventory Table (invwip.html)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS wip_inventory (
                id VARCHAR(50) PRIMARY KEY,
                customer VARCHAR(100) NOT NULL,
                partnumber VARCHAR(100) NOT NULL,
                model VARCHAR(150) NOT NULL,
                description TEXT,
                lot_number VARCHAR(100) NOT NULL,
                quantity INT NOT NULL DEFAULT 0,
                reserved_qty INT NOT NULL DEFAULT 0,
                available_qty INT GENERATED ALWAYS AS (quantity - reserved_qty) STORED,
                operator VARCHAR(100),
                pic_qc VARCHAR(100),
                pic_production VARCHAR(100),
                location VARCHAR(100),
                storage_bin VARCHAR(50),
                last_movement_date DATETIME,
                status ENUM('available', 'reserved', 'on_hold', 'transferred') DEFAULT 'available',
                quality_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_partnumber (partnumber),
                INDEX idx_lot_number (lot_number),
                INDEX idx_customer (customer),
                INDEX idx_status (status),
                INDEX idx_quality_status (quality_status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table wip_inventory created successfully');

        // 4. Transfer to QC Table (tfqc.html)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS transfer_qc (
                id VARCHAR(50) PRIMARY KEY,
                qc_batch_id VARCHAR(100) NOT NULL UNIQUE,
                partnumber VARCHAR(100) NOT NULL,
                model VARCHAR(150) NOT NULL,
                quantity_sent INT NOT NULL DEFAULT 0,
                quantity_received INT NOT NULL DEFAULT 0,
                from_process VARCHAR(100) NOT NULL,
                to_qc_department VARCHAR(100) DEFAULT 'QC',
                qc_priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
                transfer_time DATETIME NOT NULL,
                received_time DATETIME,
                qc_status ENUM('pending', 'in_progress', 'passed', 'failed', 'on_hold') DEFAULT 'pending',
                qc_inspector VARCHAR(100),
                lot_number VARCHAR(100),
                production_operator VARCHAR(100),
                transfer_operator VARCHAR(100),
                remarks TEXT,
                qc_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_qc_batch_id (qc_batch_id),
                INDEX idx_partnumber (partnumber),
                INDEX idx_qc_status (qc_status),
                INDEX idx_transfer_time (transfer_time),
                INDEX idx_qc_priority (qc_priority)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table transfer_qc created successfully');

        // 5. Machine Status Table (mcstatus.html)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS machine_status (
                id VARCHAR(50) PRIMARY KEY,
                machine_id VARCHAR(50) NOT NULL UNIQUE,
                machine_name VARCHAR(150) NOT NULL,
                machine_type VARCHAR(100),
                current_status ENUM('running', 'idle', 'maintenance', 'breakdown', 'setup') DEFAULT 'idle',
                target_percentage DECIMAL(5,2) DEFAULT 0.00,
                actual_percentage DECIMAL(5,2) DEFAULT 0.00,
                efficiency_percentage DECIMAL(5,2) GENERATED ALWAYS AS 
                    (CASE WHEN target_percentage > 0 THEN (actual_percentage / target_percentage) * 100 ELSE 0 END) STORED,
                output_today INT NOT NULL DEFAULT 0,
                target_output_today INT NOT NULL DEFAULT 0,
                current_operator VARCHAR(100),
                shift ENUM('1', '2', '3') DEFAULT '1',
                last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                downtime_minutes INT DEFAULT 0,
                maintenance_due_date DATE,
                location VARCHAR(100),
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                INDEX idx_machine_id (machine_id),
                INDEX idx_current_status (current_status),
                INDEX idx_shift (shift),
                INDEX idx_last_update (last_update)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table machine_status created successfully');

        // 6. Production Master Data - Customers
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS customers (
                id VARCHAR(50) PRIMARY KEY,
                customer_code VARCHAR(50) NOT NULL UNIQUE,
                customer_name VARCHAR(200) NOT NULL,
                customer_type ENUM('internal', 'external') DEFAULT 'external',
                contact_person VARCHAR(150),
                email VARCHAR(150),
                phone VARCHAR(50),
                address TEXT,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_customer_code (customer_code),
                INDEX idx_customer_name (customer_name),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table customers created successfully');

        // 7. Production Master Data - Parts
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS parts_master (
                id VARCHAR(50) PRIMARY KEY,
                partnumber VARCHAR(100) NOT NULL UNIQUE,
                part_name VARCHAR(200) NOT NULL,
                model VARCHAR(150),
                description TEXT,
                customer_id VARCHAR(50),
                material_type VARCHAR(100),
                unit_of_measure VARCHAR(20) DEFAULT 'pcs',
                standard_cycle_time DECIMAL(10,2),
                cavity_count INT DEFAULT 1,
                weight_per_piece DECIMAL(10,3),
                status ENUM('active', 'inactive', 'obsolete') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
                INDEX idx_partnumber (partnumber),
                INDEX idx_customer_id (customer_id),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table parts_master created successfully');

        // 8. Production Master Data - Machines
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS machines_master (
                id VARCHAR(50) PRIMARY KEY,
                machine_id VARCHAR(50) NOT NULL UNIQUE,
                machine_name VARCHAR(150) NOT NULL,
                machine_type VARCHAR(100),
                manufacturer VARCHAR(100),
                model VARCHAR(100),
                capacity_per_hour INT DEFAULT 0,
                location VARCHAR(100),
                installation_date DATE,
                last_maintenance_date DATE,
                next_maintenance_date DATE,
                status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_machine_id (machine_id),
                INDEX idx_machine_type (machine_type),
                INDEX idx_status (status),
                INDEX idx_location (location)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table machines_master created successfully');

        console.log('🎉 All production tables created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating production tables:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Function to seed initial data for the production tables
async function seedProductionData() {
    const connection = await pool.getConnection();
    
    try {
        console.log('🌱 Seeding production master data...');

        // Seed Customers
        const customers = [
            {
                id: 'CUST-001',
                customer_code: 'HONDA',
                customer_name: 'PT. Honda Prospect Motor',
                customer_type: 'external',
                contact_person: 'Supply Chain Manager',
                email: 'procurement@honda.co.id',
                phone: '021-12345678'
            },
            {
                id: 'CUST-002',
                customer_code: 'TOYOTA',
                customer_name: 'PT. Toyota Motor Manufacturing Indonesia',
                customer_type: 'external',
                contact_person: 'Parts Manager',
                email: 'parts@toyota.co.id',
                phone: '021-87654321'
            },
            {
                id: 'CUST-003',
                customer_code: 'INTERNAL',
                customer_name: 'PT. Topline Evergreen Internal',
                customer_type: 'internal',
                contact_person: 'Production Manager',
                email: 'internal@tle.co.id',
                phone: '021-11111111'
            }
        ];

        for (const customer of customers) {
            await connection.execute(`
                INSERT IGNORE INTO customers (id, customer_code, customer_name, customer_type, contact_person, email, phone)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [customer.id, customer.customer_code, customer.customer_name, customer.customer_type, customer.contact_person, customer.email, customer.phone]);
        }

        // Seed Parts Master
        const parts = [
            {
                id: 'PART-001',
                partnumber: 'HD-001-A',
                part_name: 'Honda Engine Cover',
                model: 'Civic 2025',
                description: 'Engine cover plastic component',
                customer_id: 'CUST-001',
                material_type: 'ABS Plastic',
                standard_cycle_time: 45.0,
                cavity_count: 2
            },
            {
                id: 'PART-002',
                partnumber: 'HD-002-B',
                part_name: 'Honda Dashboard Panel',
                model: 'Civic 2025',
                description: 'Interior dashboard component',
                customer_id: 'CUST-001',
                material_type: 'PP Plastic',
                standard_cycle_time: 60.0,
                cavity_count: 1
            },
            {
                id: 'PART-003',
                partnumber: 'TY-001-C',
                part_name: 'Toyota Door Handle',
                model: 'Avanza 2025',
                description: 'Exterior door handle assembly',
                customer_id: 'CUST-002',
                material_type: 'ABS Plastic',
                standard_cycle_time: 35.0,
                cavity_count: 4
            }
        ];

        for (const part of parts) {
            await connection.execute(`
                INSERT IGNORE INTO parts_master (id, partnumber, part_name, model, description, customer_id, material_type, standard_cycle_time, cavity_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [part.id, part.partnumber, part.part_name, part.model, part.description, part.customer_id, part.material_type, part.standard_cycle_time, part.cavity_count]);
        }

        // Seed Machines Master
        const machines = [
            {
                id: 'MACH-001',
                machine_id: 'INJ-001',
                machine_name: 'Injection Machine 1',
                machine_type: 'Injection Molding',
                manufacturer: 'Nissei',
                model: 'FN3000',
                capacity_per_hour: 120,
                location: 'Production Floor A'
            },
            {
                id: 'MACH-002',
                machine_id: 'INJ-002',
                machine_name: 'Injection Machine 2',
                machine_type: 'Injection Molding',
                manufacturer: 'Nissei',
                model: 'FN2500',
                capacity_per_hour: 100,
                location: 'Production Floor A'
            },
            {
                id: 'MACH-003',
                machine_id: 'ASS-001',
                machine_name: 'Assembly Station 1',
                machine_type: 'Assembly',
                manufacturer: 'Topline',
                model: 'Custom',
                capacity_per_hour: 80,
                location: 'Production Floor B'
            }
        ];

        for (const machine of machines) {
            await connection.execute(`
                INSERT IGNORE INTO machines_master (id, machine_id, machine_name, machine_type, manufacturer, model, capacity_per_hour, location)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [machine.id, machine.machine_id, machine.machine_name, machine.machine_type, machine.manufacturer, machine.model, machine.capacity_per_hour, machine.location]);
        }

        // Initialize Machine Status
        for (const machine of machines) {
            await connection.execute(`
                INSERT IGNORE INTO machine_status (id, machine_id, machine_name, machine_type, current_status, target_percentage, actual_percentage, target_output_today, location)
                VALUES (?, ?, ?, ?, 'idle', 85.0, 0.0, ?, ?)
            `, [`MS-${machine.machine_id}`, machine.machine_id, machine.machine_name, machine.machine_type, machine.capacity_per_hour * 8, machine.location]);
        }

        console.log('✅ Production master data seeded successfully');
        
    } catch (error) {
        console.error('❌ Error seeding production data:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Main execution function
async function initializeProductionDatabase() {
    try {
        await createProductionTables();
        await seedProductionData();
        console.log('🎉 Production database initialization completed!');
    } catch (error) {
        console.error('❌ Failed to initialize production database:', error);
    }
}

module.exports = {
    createProductionTables,
    seedProductionData,
    initializeProductionDatabase
};
