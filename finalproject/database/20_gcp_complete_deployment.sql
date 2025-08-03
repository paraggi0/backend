-- ================================
-- COMPLETE GOOGLE CLOUD SQL DEPLOYMENT SCRIPT
-- ================================
-- This script contains all tables and fixes specifically designed for Google Cloud SQL compatibility
-- Execute this script in order after creating the basic master tables

-- ================================
-- 1. BASIC MASTER TABLES WITH GCP COMPATIBILITY
-- ================================

-- Master Product table - Core product information
CREATE TABLE IF NOT EXISTS master_product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    part_number_sap VARCHAR(100) UNIQUE NOT NULL,
    part_number_part VARCHAR(100),
    model VARCHAR(100),
    part_description TEXT NOT NULL,
    item_type ENUM('PRODUCT', 'MATERIAL', 'COMPONENT', 'ASSEMBLY') DEFAULT 'PRODUCT',
    item_status ENUM('ACTIVE', 'INACTIVE', 'OBSOLETE') DEFAULT 'ACTIVE',
    status_production ENUM('PRODUCTION', 'PROTOTYPE', 'DEVELOPMENT', 'DISCONTINUED') DEFAULT 'PRODUCTION',
    
    -- BOM and structure
    bom_level INT DEFAULT 0,
    qty_per_set DECIMAL(12,3) DEFAULT 1,
    uom VARCHAR(20) DEFAULT 'PCS',
    
    -- Manufacturing specifications
    mold_dimension VARCHAR(100),
    mold_cavity INT DEFAULT 1,
    mc_ton_application DECIMAL(8,2),
    cycle_time_application DECIMAL(8,2),
    parts_weight DECIMAL(10,3),
    runner_weight DECIMAL(10,3),
    mc_no VARCHAR(50),
    
    -- Production capacity
    unit_per_hours DECIMAL(10,2),
    unit_per_day DECIMAL(10,2),
    capa_per_day DECIMAL(10,2),
    
    -- Pricing (quarterly)
    unit_price_q1 DECIMAL(15,4),
    unit_price_q2 DECIMAL(15,4),
    unit_price_q3 DECIMAL(15,4),
    unit_price_q4 DECIMAL(15,4),
    
    -- Process flags
    injection BOOLEAN DEFAULT FALSE,
    trimming BOOLEAN DEFAULT FALSE,
    buffing BOOLEAN DEFAULT FALSE,
    manual_spray BOOLEAN DEFAULT FALSE,
    auto_spray BOOLEAN DEFAULT FALSE,
    printing BOOLEAN DEFAULT FALSE,
    laser_marking BOOLEAN DEFAULT FALSE,
    sorting BOOLEAN DEFAULT FALSE,
    assembly BOOLEAN DEFAULT FALSE,
    
    -- Status and audit
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_part_number_sap (part_number_sap),
    INDEX idx_model (model),
    INDEX idx_item_type (item_type),
    INDEX idx_status_production (status_production)
);

-- Master Material table - Raw materials
CREATE TABLE IF NOT EXISTS master_material (
    material_id INT PRIMARY KEY AUTO_INCREMENT,
    material_code VARCHAR(100) UNIQUE NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    material_type ENUM('PLASTIC', 'METAL', 'CHEMICAL', 'PACKAGING', 'OTHER') DEFAULT 'PLASTIC',
    material_category VARCHAR(100),
    
    -- Material properties
    supplier VARCHAR(255),
    grade VARCHAR(100),
    color VARCHAR(50),
    density DECIMAL(8,4),
    melt_flow_rate DECIMAL(8,4),
    
    -- Pricing and procurement
    price_per_kg DECIMAL(12,4),
    minimum_order_qty DECIMAL(12,3),
    lead_time_days INT DEFAULT 30,
    
    -- Storage and handling
    storage_condition VARCHAR(255),
    shelf_life_days INT,
    hazardous BOOLEAN DEFAULT FALSE,
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_material_code (material_code),
    INDEX idx_material_type (material_type),
    INDEX idx_supplier (supplier)
);

-- Master Component table - Purchased components
CREATE TABLE IF NOT EXISTS master_component (
    component_id INT PRIMARY KEY AUTO_INCREMENT,
    component_code VARCHAR(100) UNIQUE NOT NULL,
    component_name VARCHAR(255) NOT NULL,
    component_type ENUM('SCREW', 'BOLT', 'NUT', 'WASHER', 'SPRING', 'BEARING', 'SEAL', 'GASKET', 'ELECTRONIC', 'OTHER') DEFAULT 'OTHER',
    component_category VARCHAR(100),
    
    -- Component specifications
    material VARCHAR(100),
    size_specification VARCHAR(100),
    finish VARCHAR(100),
    
    -- Supplier information
    supplier_name VARCHAR(255),
    supplier_part_number VARCHAR(100),
    
    -- Pricing and procurement
    price_per_unit DECIMAL(12,4),
    minimum_order_qty DECIMAL(12,3),
    lead_time_days INT DEFAULT 15,
    
    -- Quality and compliance
    quality_standard VARCHAR(100),
    certification VARCHAR(255),
    lifecycle_status ENUM('ACTIVE', 'PHASE_OUT', 'OBSOLETE') DEFAULT 'ACTIVE',
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_component_code (component_code),
    INDEX idx_component_type (component_type),
    INDEX idx_supplier_name (supplier_name)
);

-- Master BOM table - Bill of Materials
CREATE TABLE IF NOT EXISTS master_bom (
    bom_id INT PRIMARY KEY AUTO_INCREMENT,
    bom_number VARCHAR(100) NOT NULL,
    parent_part_number VARCHAR(100) NOT NULL,
    child_part_number VARCHAR(100) NOT NULL,
    
    -- BOM structure
    bom_level INT DEFAULT 1,
    sequence_number INT DEFAULT 1,
    quantity_per_set DECIMAL(12,6) NOT NULL,
    uom VARCHAR(20) DEFAULT 'PCS',
    
    -- Component classification
    component_type ENUM('RAW_MATERIAL', 'COMPONENT', 'ASSEMBLY', 'PHANTOM') NOT NULL,
    usage_type ENUM('PRODUCTION', 'SETUP', 'SCRAP_ALLOWANCE', 'OPTIONAL') DEFAULT 'PRODUCTION',
    
    -- Material/Component references
    material_code VARCHAR(100),
    component_code VARCHAR(100),
    
    -- Validity dates
    effective_date DATE DEFAULT (CURRENT_DATE),
    obsolete_date DATE,
    
    -- Cost and planning
    scrap_factor DECIMAL(5,4) DEFAULT 0.05,
    yield_factor DECIMAL(5,4) DEFAULT 1.0,
    
    -- Manufacturing details
    operation_sequence INT,
    work_center VARCHAR(50),
    setup_time_minutes DECIMAL(8,2),
    run_time_minutes DECIMAL(8,2),
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_bom_number (bom_number),
    INDEX idx_parent_part (parent_part_number),
    INDEX idx_child_part (child_part_number),
    INDEX idx_material_code (material_code),
    INDEX idx_component_code (component_code),
    INDEX idx_bom_level (bom_level),
    UNIQUE KEY uk_bom_parent_child (parent_part_number, child_part_number, sequence_number)
);

-- Master Supplier table (referenced in material and component)
CREATE TABLE IF NOT EXISTS master_supplier (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_code VARCHAR(100) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_type ENUM('MATERIAL', 'COMPONENT', 'SERVICE', 'BOTH') DEFAULT 'BOTH',
    
    -- Contact information
    contact_person VARCHAR(100),
    contact_title VARCHAR(100),
    phone_primary VARCHAR(20),
    phone_secondary VARCHAR(20),
    email_primary VARCHAR(100),
    email_secondary VARCHAR(100),
    
    -- Address information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Indonesia',
    
    -- Business information
    tax_id VARCHAR(50),
    business_license VARCHAR(100),
    certification VARCHAR(255),
    
    -- Financial information
    payment_terms VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'IDR',
    credit_rating ENUM('A', 'B', 'C', 'D') DEFAULT 'B',
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_supplier_code (supplier_code),
    INDEX idx_supplier_type (supplier_type)
);

-- Master Customer  
CREATE TABLE IF NOT EXISTS master_customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_code VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_type ENUM('DOMESTIC', 'EXPORT', 'BOTH') DEFAULT 'DOMESTIC',
    customer_category ENUM('AUTOMOTIVE', 'ELECTRONICS', 'APPLIANCE', 'OTHER') DEFAULT 'OTHER',
    
    -- Contact information
    contact_person VARCHAR(100),
    contact_title VARCHAR(100),
    phone_primary VARCHAR(20),
    phone_secondary VARCHAR(20),
    fax VARCHAR(20),
    email_primary VARCHAR(100),
    email_secondary VARCHAR(100),
    website VARCHAR(255),
    
    -- Address information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Indonesia',
    
    -- Business information
    tax_id VARCHAR(50),
    business_license VARCHAR(100),
    registration_number VARCHAR(100),
    industry_type VARCHAR(100),
    business_nature VARCHAR(255),
    
    -- Financial information
    currency VARCHAR(3) DEFAULT 'IDR',
    payment_terms VARCHAR(100),
    credit_limit DECIMAL(15,2) DEFAULT 0,
    credit_rating ENUM('A', 'B', 'C', 'D') DEFAULT 'B',
    bank_name VARCHAR(255),
    bank_account VARCHAR(100),
    
    -- Shipping information
    shipping_address VARCHAR(500),
    shipping_method ENUM('FOB', 'CIF', 'EXW', 'DDP', 'OTHER') DEFAULT 'FOB',
    delivery_terms VARCHAR(255),
    
    -- Performance metrics
    payment_performance DECIMAL(5,2) DEFAULT 95.00,
    order_frequency VARCHAR(50),
    average_order_value DECIMAL(15,2) DEFAULT 0,
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_code (customer_code),
    INDEX idx_customer_name (customer_name),
    INDEX idx_customer_type (customer_type)
);

-- ================================
-- 2. QR CODE AND LOT NUMBER SYSTEM - GCP COMPATIBLE
-- ================================

-- Master QR Code table - GCP compatible
CREATE TABLE IF NOT EXISTS master_qr_code (
    qr_id INT PRIMARY KEY AUTO_INCREMENT,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    qr_type ENUM('PRODUCT', 'MATERIAL', 'COMPONENT', 'WIP', 'FG', 'LOCATION', 'TRANSFER', 'LOT') NOT NULL,
    
    -- Reference information
    reference_id VARCHAR(100) NOT NULL,
    reference_code VARCHAR(100) NOT NULL,
    reference_description TEXT,
    
    -- QR properties - Using TEXT instead of JSON for GCP compatibility
    qr_properties TEXT,
    
    -- Location and quantity
    current_location_code VARCHAR(100),
    current_qty DECIMAL(12,3) DEFAULT 0,
    uom VARCHAR(20) DEFAULT 'PCS',
    
    -- Lot information
    lot_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    
    -- Status and tracking
    status ENUM('ACTIVE', 'USED', 'EXPIRED', 'DAMAGED') DEFAULT 'ACTIVE',
    last_scan_location VARCHAR(100),
    last_scan_time TIMESTAMP,
    scan_count INT DEFAULT 0,
    
    -- Audit fields
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_qr_code (qr_code),
    INDEX idx_qr_type (qr_type),
    INDEX idx_reference_code (reference_code),
    INDEX idx_lot_number (lot_number),
    INDEX idx_current_location (current_location_code)
);

-- Master Lot Number table - GCP compatible  
CREATE TABLE IF NOT EXISTS master_lot_number (
    lot_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_number VARCHAR(100) UNIQUE NOT NULL,
    lot_type ENUM('PRODUCT', 'MATERIAL', 'COMPONENT', 'WIP', 'FG') NOT NULL,
    
    -- Item reference
    item_code VARCHAR(100) NOT NULL,
    item_description TEXT,
    
    -- Lot details - Using TEXT instead of JSON for GCP compatibility
    lot_details TEXT,
    
    -- Manufacturing information
    manufacturing_date DATE NOT NULL,
    manufacturing_shift ENUM('1', '2', '3', 'N') DEFAULT '1',
    machine_code VARCHAR(50),
    operator_code VARCHAR(50),
    
    -- Quality information
    quality_status ENUM('PENDING', 'APPROVED', 'REJECTED', 'HOLD') DEFAULT 'PENDING',
    quality_remarks TEXT,
    quality_checked_by VARCHAR(100),
    quality_checked_at TIMESTAMP,
    
    -- Quantity tracking
    initial_qty DECIMAL(12,3) NOT NULL DEFAULT 0,
    current_qty DECIMAL(12,3) NOT NULL DEFAULT 0,
    reserved_qty DECIMAL(12,3) DEFAULT 0,
    consumed_qty DECIMAL(12,3) DEFAULT 0,
    rejected_qty DECIMAL(12,3) DEFAULT 0,
    uom VARCHAR(20) DEFAULT 'PCS',
    
    -- Traceability
    parent_lot_number VARCHAR(100),
    source_document_type VARCHAR(50),
    source_document_number VARCHAR(100),
    
    -- Expiry and storage
    expiry_date DATE,
    storage_location VARCHAR(100),
    storage_condition VARCHAR(255),
    
    -- Status
    status ENUM('ACTIVE', 'CONSUMED', 'EXPIRED', 'QUARANTINE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_lot_number (lot_number),
    INDEX idx_lot_type (lot_type),
    INDEX idx_item_code (item_code),
    INDEX idx_manufacturing_date (manufacturing_date),
    INDEX idx_quality_status (quality_status),
    INDEX idx_parent_lot (parent_lot_number)
);

-- QR Scan Log table - GCP compatible
CREATE TABLE IF NOT EXISTS qr_scan_log (
    scan_id INT PRIMARY KEY AUTO_INCREMENT,
    qr_code VARCHAR(255) NOT NULL,
    scan_type ENUM('GENERATE', 'TRANSFER_OUT', 'TRANSFER_IN', 'RECEIVE', 'CONSUME', 'RETURN', 'INVENTORY', 'QUALITY_CHECK') NOT NULL,
    
    -- Scan details
    scan_location VARCHAR(100),
    scan_device VARCHAR(100),
    scan_user VARCHAR(100),
    scan_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Transaction reference
    transaction_type VARCHAR(50),
    transaction_number VARCHAR(100),
    
    -- Quantity information
    scan_qty DECIMAL(12,3),
    uom VARCHAR(20),
    
    -- Before and after status - Using TEXT instead of JSON for GCP compatibility
    before_status TEXT,
    after_status TEXT,
    
    -- Additional information
    remarks TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    INDEX idx_qr_code (qr_code),
    INDEX idx_scan_timestamp (scan_timestamp),
    INDEX idx_scan_user (scan_user),
    INDEX idx_transaction_number (transaction_number)
);

-- Lot Transaction History table - GCP compatible
CREATE TABLE IF NOT EXISTS lot_transaction_history (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_number VARCHAR(100) NOT NULL,
    transaction_type ENUM('CREATE', 'RECEIVE', 'TRANSFER_OUT', 'TRANSFER_IN', 'CONSUME', 'RETURN', 'ADJUST', 'QUALITY_UPDATE') NOT NULL,
    
    -- Transaction details
    transaction_date DATE NOT NULL,
    transaction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_reference VARCHAR(100),
    
    -- Quantity changes
    quantity_before DECIMAL(12,3) DEFAULT 0,
    quantity_change DECIMAL(12,3) DEFAULT 0,
    quantity_after DECIMAL(12,3) DEFAULT 0,
    uom VARCHAR(20) DEFAULT 'PCS',
    
    -- Location changes
    location_from VARCHAR(100),
    location_to VARCHAR(100),
    
    -- Additional details - Using TEXT instead of JSON for GCP compatibility
    transaction_details TEXT,
    
    -- User and approval
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    approved_by VARCHAR(100),
    approval_timestamp TIMESTAMP,
    
    remarks TEXT,
    
    INDEX idx_lot_number (lot_number),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_created_by (created_by)
);

-- ================================
-- 3. LOCATION MANAGEMENT - GCP COMPATIBLE
-- ================================

CREATE TABLE IF NOT EXISTS master_location (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    location_code VARCHAR(100) UNIQUE NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_type ENUM('WAREHOUSE', 'PRODUCTION', 'QC', 'MAINTENANCE', 'SHIPPING', 'RECEIVING', 'QUARANTINE', 'SCRAP', 'OTHER') DEFAULT 'WAREHOUSE',
    
    -- Hierarchy
    parent_location_code VARCHAR(100),
    location_level INT DEFAULT 1,
    location_path VARCHAR(500),
    
    -- Physical properties
    area_sqm DECIMAL(10,2),
    height_cm DECIMAL(8,2),
    max_weight_kg DECIMAL(10,2),
    temperature_controlled BOOLEAN DEFAULT FALSE,
    humidity_controlled BOOLEAN DEFAULT FALSE,
    
    -- Access control
    access_level ENUM('PUBLIC', 'RESTRICTED', 'CONTROLLED', 'SECURED') DEFAULT 'PUBLIC',
    access_users TEXT,
    
    -- Address and contact
    building VARCHAR(100),
    floor_level VARCHAR(50),
    zone VARCHAR(50),
    aisle VARCHAR(50),
    rack VARCHAR(50),
    shelf VARCHAR(50),
    bin VARCHAR(50),
    
    -- Operational
    capacity_utilization DECIMAL(5,2) DEFAULT 0,
    allow_mixed_items BOOLEAN DEFAULT TRUE,
    require_qr_scan BOOLEAN DEFAULT FALSE,
    
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE',
    remarks TEXT,
    created_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location_code (location_code),
    INDEX idx_location_type (location_type),
    INDEX idx_parent_location (parent_location_code),
    INDEX idx_location_level (location_level)
);

-- ================================
-- 4. TRIGGERS FOR LOT NUMBER GENERATION - GCP COMPATIBLE
-- ================================

-- Note: For Google Cloud SQL Console, execute this trigger separately
-- Copy and paste this trigger creation in a separate execution

/*
CREATE TRIGGER tr_generate_lot_number
BEFORE INSERT ON master_lot_number
FOR EACH ROW
BEGIN
    DECLARE lot_sequence INT DEFAULT 1;
    DECLARE new_lot_number VARCHAR(100);
    DECLARE lot_prefix VARCHAR(10);
    DECLARE date_part VARCHAR(8);
    DECLARE shift_part VARCHAR(1);
    
    -- Only generate if lot_number is not provided
    IF NEW.lot_number IS NULL OR NEW.lot_number = '' THEN
        -- Set lot prefix based on type
        CASE NEW.lot_type
            WHEN 'PRODUCT' THEN SET lot_prefix = 'PRD';
            WHEN 'MATERIAL' THEN SET lot_prefix = 'MAT';
            WHEN 'COMPONENT' THEN SET lot_prefix = 'CMP';
            WHEN 'WIP' THEN SET lot_prefix = 'WIP';
            WHEN 'FG' THEN SET lot_prefix = 'FG';
            ELSE SET lot_prefix = 'LOT';
        END CASE;
        
        -- Format date as YYYYMMDD
        SET date_part = DATE_FORMAT(NEW.manufacturing_date, '%Y%m%d');
        
        -- Get shift part
        SET shift_part = COALESCE(NEW.manufacturing_shift, '1');
        
        -- Find next sequence number for this combination
        SELECT COALESCE(MAX(CAST(SUBSTRING(lot_number, -3) AS UNSIGNED)), 0) + 1
        INTO lot_sequence
        FROM master_lot_number
        WHERE lot_number LIKE CONCAT(lot_prefix, '-', NEW.item_code, '-', date_part, '-', shift_part, '-%');
        
        -- Generate lot number: PREFIX-ITEMCODE-YYYYMMDD-SHIFT-SEQUENCE
        SET new_lot_number = CONCAT(
            lot_prefix, '-',
            NEW.item_code, '-',
            date_part, '-',
            shift_part, '-',
            LPAD(lot_sequence, 3, '0')
        );
        
        SET NEW.lot_number = new_lot_number;
    END IF;
END;
*/

-- ================================
-- 5. SAMPLE DATA FOR PRODUCTION
-- ================================

-- Sample Suppliers
INSERT INTO master_supplier (supplier_code, supplier_name, supplier_type, contact_person, phone_primary, email_primary, city, country, created_by) VALUES
('SUP001', 'PT. Plastic Material Indonesia', 'MATERIAL', 'John Doe', '021-12345678', 'john@plastik.com', 'Jakarta', 'Indonesia', 'ADMIN'),
('SUP002', 'CV. Component Supplier', 'COMPONENT', 'Jane Smith', '031-87654321', 'jane@component.com', 'Surabaya', 'Indonesia', 'ADMIN'),
('SUP003', 'PT. Chemical Solutions', 'MATERIAL', 'Bob Wilson', '024-11223344', 'bob@chemical.com', 'Semarang', 'Indonesia', 'ADMIN')
ON DUPLICATE KEY UPDATE
    supplier_name = VALUES(supplier_name),
    updated_at = CURRENT_TIMESTAMP;

-- Sample Materials (based on manufacturing needs)
INSERT INTO master_material (material_code, material_name, material_type, material_category, supplier, grade, color, price_per_kg, created_by) VALUES
('MAT001', 'ABS Natural Grade', 'PLASTIC', 'Engineering Plastic', 'PT. Plastic Material Indonesia', 'Grade A', 'Natural', 45000.00, 'ADMIN'),
('MAT002', 'PC Transparent', 'PLASTIC', 'Engineering Plastic', 'PT. Plastic Material Indonesia', 'Grade A', 'Clear', 65000.00, 'ADMIN'),
('MAT003', 'PP Black', 'PLASTIC', 'Commodity Plastic', 'PT. Plastic Material Indonesia', 'Grade B', 'Black', 25000.00, 'ADMIN'),
('MAT004', 'PA66 Glass Fiber', 'PLASTIC', 'Engineering Plastic', 'PT. Plastic Material Indonesia', 'Grade A', 'Natural', 85000.00, 'ADMIN'),
('MAT005', 'Release Agent', 'CHEMICAL', 'Mold Release', 'PT. Chemical Solutions', 'Industrial', 'Clear', 125000.00, 'ADMIN')
ON DUPLICATE KEY UPDATE
    material_name = VALUES(material_name),
    updated_at = CURRENT_TIMESTAMP;

-- Sample Components (common hardware)
INSERT INTO master_component (component_code, component_name, component_type, component_category, material, supplier_name, price_per_unit, created_by) VALUES
('COMP001', 'M3x8 Pan Head Screw', 'SCREW', 'Fastener', 'Stainless Steel', 'CV. Component Supplier', 150.00, 'ADMIN'),
('COMP002', 'M4x10 Hex Bolt', 'BOLT', 'Fastener', 'Carbon Steel', 'CV. Component Supplier', 250.00, 'ADMIN'),
('COMP003', 'M3 Hex Nut', 'NUT', 'Fastener', 'Stainless Steel', 'CV. Component Supplier', 75.00, 'ADMIN'),
('COMP004', 'M4 Flat Washer', 'WASHER', 'Fastener', 'Stainless Steel', 'CV. Component Supplier', 50.00, 'ADMIN'),
('COMP005', 'O-Ring 10mm', 'SEAL', 'Sealing', 'NBR Rubber', 'CV. Component Supplier', 2500.00, 'ADMIN')
ON DUPLICATE KEY UPDATE
    component_name = VALUES(component_name),
    updated_at = CURRENT_TIMESTAMP;

-- Sample Products (typical manufacturing parts)
INSERT INTO master_product (part_number_sap, part_number_part, model, part_description, item_type, mold_cavity, parts_weight, unit_price_q3, injection, created_by) VALUES
('P001-HOUSING-MAIN', 'HSG-001', 'EVO-2024', 'Main Housing for Electronic Device', 'PRODUCT', 2, 125.50, 8500.00, TRUE, 'ADMIN'),
('P002-COVER-TOP', 'CVR-001', 'EVO-2024', 'Top Cover Assembly', 'PRODUCT', 4, 45.20, 3200.00, TRUE, 'ADMIN'),
('P003-BASE-FRAME', 'FRM-001', 'EVO-2024', 'Base Frame Structure', 'PRODUCT', 1, 280.75, 12500.00, TRUE, 'ADMIN'),
('P004-BRACKET-SIDE', 'BRK-001', 'EVO-2024', 'Side Mounting Bracket', 'PRODUCT', 8, 15.30, 850.00, TRUE, 'ADMIN'),
('P005-PANEL-FRONT', 'PNL-001', 'EVO-2024', 'Front Control Panel', 'PRODUCT', 2, 95.40, 6200.00, TRUE, 'ADMIN')
ON DUPLICATE KEY UPDATE
    part_description = VALUES(part_description),
    updated_at = CURRENT_TIMESTAMP;

-- Sample BOM structures
INSERT INTO master_bom (bom_number, parent_part_number, child_part_number, component_type, quantity_per_set, material_code, component_code, created_by) VALUES
('BOM001', 'P001-HOUSING-MAIN', 'MAT001', 'RAW_MATERIAL', 0.125, 'MAT001', NULL, 'ADMIN'),
('BOM002', 'P001-HOUSING-MAIN', 'COMP001', 'COMPONENT', 4.000, NULL, 'COMP001', 'ADMIN'),
('BOM003', 'P001-HOUSING-MAIN', 'COMP003', 'COMPONENT', 4.000, NULL, 'COMP003', 'ADMIN'),
('BOM004', 'P002-COVER-TOP', 'MAT002', 'RAW_MATERIAL', 0.045, 'MAT002', NULL, 'ADMIN'),
('BOM005', 'P002-COVER-TOP', 'COMP002', 'COMPONENT', 2.000, NULL, 'COMP002', 'ADMIN'),
('BOM006', 'P003-BASE-FRAME', 'MAT004', 'RAW_MATERIAL', 0.281, 'MAT004', NULL, 'ADMIN'),
('BOM007', 'P003-BASE-FRAME', 'COMP004', 'COMPONENT', 6.000, NULL, 'COMP004', 'ADMIN'),
('BOM008', 'P004-BRACKET-SIDE', 'MAT003', 'RAW_MATERIAL', 0.015, 'MAT003', NULL, 'ADMIN'),
('BOM009', 'P005-PANEL-FRONT', 'MAT001', 'RAW_MATERIAL', 0.095, 'MAT001', NULL, 'ADMIN'),
('BOM010', 'P005-PANEL-FRONT', 'COMP005', 'COMPONENT', 1.000, NULL, 'COMP005', 'ADMIN')
ON DUPLICATE KEY UPDATE
    quantity_per_set = VALUES(quantity_per_set),
    updated_at = CURRENT_TIMESTAMP;

-- Sample Locations (production layout)
INSERT INTO master_location (location_code, location_name, location_type, building, zone, created_by) VALUES
('WH-01', 'Main Warehouse', 'WAREHOUSE', 'Building A', 'Zone 1', 'ADMIN'),
('WH-01-A', 'Raw Material Storage', 'WAREHOUSE', 'Building A', 'Zone 1A', 'ADMIN'),
('WH-01-B', 'Component Storage', 'WAREHOUSE', 'Building A', 'Zone 1B', 'ADMIN'),
('WH-01-C', 'Finished Goods Storage', 'WAREHOUSE', 'Building A', 'Zone 1C', 'ADMIN'),
('PROD-01', 'Injection Molding Line 1', 'PRODUCTION', 'Building B', 'Production Floor', 'ADMIN'),
('PROD-02', 'Injection Molding Line 2', 'PRODUCTION', 'Building B', 'Production Floor', 'ADMIN'),
('PROD-03', 'Assembly Line 1', 'PRODUCTION', 'Building B', 'Assembly Floor', 'ADMIN'),
('QC-01', 'Incoming Quality Control', 'QC', 'Building C', 'QC Lab', 'ADMIN'),
('QC-02', 'Final Quality Control', 'QC', 'Building C', 'QC Lab', 'ADMIN'),
('SHIP-01', 'Shipping Dock A', 'SHIPPING', 'Building A', 'Dock Area', 'ADMIN'),
('RCV-01', 'Receiving Dock', 'RECEIVING', 'Building A', 'Dock Area', 'ADMIN'),
('MAINT-01', 'Mold Maintenance', 'MAINTENANCE', 'Building D', 'Workshop', 'ADMIN')
ON DUPLICATE KEY UPDATE
    location_name = VALUES(location_name),
    updated_at = CURRENT_TIMESTAMP;

-- Sample Customers (for production planning)
INSERT INTO master_customer (customer_code, customer_name, customer_type, customer_category, contact_person, phone_primary, city, created_by) VALUES
('CUST001', 'PT. Electronics Indonesia', 'DOMESTIC', 'ELECTRONICS', 'Ahmad Sutanto', '021-55667788', 'Jakarta', 'ADMIN'),
('CUST002', 'Honda Manufacturing', 'DOMESTIC', 'AUTOMOTIVE', 'Yuki Tanaka', '031-44556677', 'Surabaya', 'ADMIN'),
('CUST003', 'Samsung Electronics', 'EXPORT', 'ELECTRONICS', 'Kim Min-jun', '+82-2-1234-5678', 'Seoul', 'ADMIN'),
('CUST004', 'LG Appliances', 'DOMESTIC', 'APPLIANCE', 'Lee Sung-ho', '024-33445566', 'Semarang', 'ADMIN')
ON DUPLICATE KEY UPDATE
    customer_name = VALUES(customer_name),
    updated_at = CURRENT_TIMESTAMP;

-- ================================
-- 6. ESSENTIAL STORED PROCEDURES FOR QR & LOT SYSTEM
-- ================================

-- Simple QR Generation Procedure (GCP Compatible)
DROP PROCEDURE IF EXISTS sp_generate_qr_code;

CREATE PROCEDURE sp_generate_qr_code(
    IN p_qr_type VARCHAR(50),
    IN p_reference_code VARCHAR(100),
    IN p_reference_description TEXT
)
BEGIN
    DECLARE v_sequence INT DEFAULT 1;
    DECLARE v_new_qr_code VARCHAR(255);
    DECLARE v_timestamp VARCHAR(14);
    
    -- Generate timestamp
    SET v_timestamp = DATE_FORMAT(NOW(), '%Y%m%d%H%i%s');
    
    -- Find next sequence number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(qr_code, '-', -1) AS UNSIGNED)), 0) + 1
    INTO v_sequence
    FROM master_qr_code
    WHERE qr_code LIKE CONCAT('QR-', p_qr_type, '-', LEFT(v_timestamp, 8), '%');
    
    -- Generate QR code: QR-TYPE-YYYYMMDDHHMMSS-SEQUENCE
    SET v_new_qr_code = CONCAT('QR-', p_qr_type, '-', v_timestamp, '-', LPAD(v_sequence, 3, '0'));
    
    -- Insert new QR code
    INSERT INTO master_qr_code (
        qr_code, qr_type, reference_id, reference_code, reference_description, created_by
    ) VALUES (
        v_new_qr_code, p_qr_type, '1', p_reference_code, p_reference_description, 'SYSTEM'
    );
    
    SELECT v_new_qr_code as generated_qr_code;
END;

-- Simple Mobile Scan Procedure (GCP Compatible)
DROP PROCEDURE IF EXISTS sp_mobile_scan_qr;

CREATE PROCEDURE sp_mobile_scan_qr(
    IN p_qr_code VARCHAR(255),
    IN p_scan_location VARCHAR(100),
    IN p_scan_user VARCHAR(100)
)
BEGIN
    DECLARE v_qr_exists INT DEFAULT 0;
    
    -- Check if QR code exists
    SELECT COUNT(*) INTO v_qr_exists
    FROM master_qr_code 
    WHERE qr_code = p_qr_code AND status = 'ACTIVE';
    
    IF v_qr_exists = 0 THEN
        SELECT 0 as success, 'QR Code not found' as message;
    ELSE
        -- Update scan information
        UPDATE master_qr_code 
        SET current_location_code = p_scan_location,
            last_scan_location = p_scan_location,
            last_scan_time = NOW(),
            scan_count = scan_count + 1
        WHERE qr_code = p_qr_code;
        
        -- Log the scan
        INSERT INTO qr_scan_log (qr_code, scan_timestamp, scan_location, scan_user, scan_type, success)
        VALUES (p_qr_code, NOW(), p_scan_location, p_scan_user, 'TRANSFER_IN', TRUE);
        
        SELECT 1 as success, 'QR Code scanned successfully' as message;
    END IF;
END;
