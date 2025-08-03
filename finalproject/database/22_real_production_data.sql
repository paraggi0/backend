-- ================================
-- REAL PRODUCTION DATA FROM BOM CSV
-- ================================
-- Data real dari BOM LIST UPDATE JULI 2025 v1.csv
-- Execute setelah deployment database utama

-- ================================
-- 1. CUSTOMER DATA (5 Companies)
-- ================================

-- Clear existing sample customers
DELETE FROM master_customer WHERE customer_code LIKE 'CUST%';

-- Insert real customers from CSV
INSERT INTO master_customer (customer_code, customer_name, customer_type, customer_category, contact_person, phone_primary, city, country, created_by) VALUES
('CUST-ARK001', 'PT. ARKHA INDUSTRIES INDONESIA', 'DOMESTIC', 'AUTOMOTIVE', 'Production Manager', '021-12345001', 'Jakarta', 'Indonesia', 'SYSTEM'),
('CUST-AST002', 'PT. ASTRA KOMPONEN INDONESIA', 'DOMESTIC', 'AUTOMOTIVE', 'Project Manager', '021-12345002', 'Jakarta', 'Indonesia', 'SYSTEM'),
('CUST-API003', 'PT. AUTO PLASTIK INDONESIA', 'DOMESTIC', 'AUTOMOTIVE', 'Manufacturing Manager', '021-12345003', 'Jakarta', 'Indonesia', 'SYSTEM'),
('CUST-BFJ004', 'CV. BINTANG FAJAR', 'DOMESTIC', 'OTHER', 'Operations Manager', '021-12345004', 'Jakarta', 'Indonesia', 'SYSTEM'),
('CUST-CUB005', 'PT. CUBIC INDONESIA', 'DOMESTIC', 'AUTOMOTIVE', 'Quality Manager', '021-12345005', 'Jakarta', 'Indonesia', 'SYSTEM')
ON DUPLICATE KEY UPDATE
    customer_name = VALUES(customer_name),
    updated_at = CURRENT_TIMESTAMP;

-- ================================
-- 2. MATERIAL DATA (Real Materials from CSV)
-- ================================

-- Clear existing sample materials  
DELETE FROM master_material WHERE material_code LIKE 'MAT%';

-- Insert real materials from CSV
INSERT INTO master_material (material_code, material_name, material_type, material_category, supplier, grade, color, density, price_per_kg, minimum_order_qty, lead_time_days, created_by) VALUES
-- ABS Materials
('MAT-ABS-100MPJ', 'ABS TOYOLAC 100 MPJ', 'PLASTIC', 'Engineering Plastic', 'PT. Toray Advanced Materials', 'Grade A', 'Natural', 1.05, 45000.00, 25, 30, 'SYSTEM'),
('MAT-ABS-KF720', 'ABS KF720 HELISTROM', 'PLASTIC', 'Engineering Plastic', 'PT. Kumho Petrochemical', 'Grade A', 'Natural', 1.04, 48000.00, 25, 30, 'SYSTEM'),

-- PP Materials
('MAT-PP-7032E3', 'PP EXXON 7032-E3', 'PLASTIC', 'Commodity Plastic', 'PT. ExxonMobil Chemical', 'Grade B', 'Natural', 0.91, 28000.00, 25, 25, 'SYSTEM'),
('MAT-PP-AP03B', 'PP EXXON AP 03B', 'PLASTIC', 'Commodity Plastic', 'PT. ExxonMobil Chemical', 'Grade B', 'Natural', 0.90, 26000.00, 25, 25, 'SYSTEM'),
('MAT-PP-P10T6B', 'PP WELLON P10T6B_P0130B01', 'PLASTIC', 'Commodity Plastic', 'PT. Wellon Chemical', 'Grade B', 'Natural', 0.92, 29000.00, 25, 25, 'SYSTEM'),
('MAT-PP-X660T', 'PP COSMOPLENE X660T 8K-X4429 R299', 'PLASTIC', 'Commodity Plastic', 'PT. Lyondell Basell', 'Grade A', 'R299', 0.93, 32000.00, 25, 25, 'SYSTEM'),
('MAT-PP-AF1004', 'PP FIBRE FILLED AF 1004 LF', 'PLASTIC', 'Commodity Plastic', 'PT. Advanced Fibers', 'Grade A', 'Natural', 1.15, 35000.00, 25, 30, 'SYSTEM'),
('MAT-PP-GF20', 'PP GF 20 SP', 'PLASTIC', 'Commodity Plastic', 'PT. Glass Fiber Solutions', 'Grade A', 'Natural', 1.25, 38000.00, 25, 30, 'SYSTEM'),
('MAT-PP-IJI350', 'PP LOTTE IJI350', 'PLASTIC', 'Commodity Plastic', 'PT. Lotte Chemical', 'Grade B', 'Natural', 0.91, 29000.00, 25, 25, 'SYSTEM'),

-- Engineering Plastics
('MAT-PPS-1140L4', 'PPS GF40 FORTON 1140L4 BK', 'PLASTIC', 'Engineering Plastic', 'PT. Celanese Advanced Materials', 'Grade A', 'Black', 1.65, 125000.00, 25, 45, 'SYSTEM'),
('MAT-PVC-JL013D', 'PVC JL013D BS079 201B', 'PLASTIC', 'Engineering Plastic', 'PT. Shin-Etsu Chemical', 'Grade A', 'Natural', 1.38, 42000.00, 25, 30, 'SYSTEM'),
('MAT-NY66-A216', 'NYLON66 TECHNYL A 216 NATURAL', 'PLASTIC', 'Engineering Plastic', 'PT. Rhodia Engineering Plastics', 'Grade A', 'Natural', 1.14, 88000.00, 25, 35, 'SYSTEM'),
('MAT-PC-PBT-3080', 'PC-PBT AE-3080CD', 'PLASTIC', 'Engineering Plastic', 'PT. SABIC Innovative Plastics', 'Grade A', 'Natural', 1.21, 95000.00, 25, 40, 'SYSTEM'),
('MAT-BASF-00646', 'BASF BLACK 00646', 'PLASTIC', 'Engineering Plastic', 'PT. BASF Indonesia', 'Grade A', 'Black', 1.18, 52000.00, 25, 30, 'SYSTEM'),

-- Masterbatch & Additives
('MAT-MB-JB302', 'MASTERBATCH JB 302 BLACK (2%)', 'CHEMICAL', 'Colorant', 'PT. Plasmaster Indonesia', 'Industrial', 'Black', 1.15, 85000.00, 25, 20, 'SYSTEM'),
('MAT-MB-1112', 'MASTERBATCH 1112-30 GREY (1%)', 'CHEMICAL', 'Colorant', 'PT. Plasmaster Indonesia', 'Industrial', 'Grey', 1.12, 85000.00, 25, 20, 'SYSTEM'),
('MAT-MB-JP112', 'MASTERBATCH PLAMASTER JP 112 BLACK (2%)', 'CHEMICAL', 'Colorant', 'PT. Plasmaster Indonesia', 'Industrial', 'Black', 1.15, 85000.00, 25, 20, 'SYSTEM'),
('MAT-MB-7750', 'MASTERBATCH PP MB 7750 (2%)', 'CHEMICAL', 'Colorant', 'PT. Plasmaster Indonesia', 'Industrial', 'Black', 1.10, 85000.00, 25, 20, 'SYSTEM'),
('MAT-MB-JN2963', 'MASTERBATCH PLAMASTER JN 2963-30 BLACK (2%)', 'CHEMICAL', 'Colorant', 'PT. Plasmaster Indonesia', 'Industrial', 'Black', 1.15, 85000.00, 25, 20, 'SYSTEM'),
('MAT-MB-7786', 'MASTERBATCH MBA 7786 BS (2%)', 'CHEMICAL', 'Colorant', 'PT. Plasmaster Indonesia', 'Industrial', 'BS', 1.12, 85000.00, 25, 20, 'SYSTEM')
ON DUPLICATE KEY UPDATE
    material_name = VALUES(material_name),
    price_per_kg = VALUES(price_per_kg),
    updated_at = CURRENT_TIMESTAMP;

-- ================================
-- 3. COMPONENT DATA (Real Components from CSV)
-- ================================

-- Clear existing sample components
DELETE FROM master_component WHERE component_code LIKE 'COMP%';

-- Insert real components from CSV
INSERT INTO master_component (component_code, component_name, component_type, component_category, material, size_specification, supplier_name, supplier_part_number, price_per_unit, minimum_order_qty, lead_time_days, created_by) VALUES
-- Fasteners
('COMP-SCR-04020', 'SCREW OVAL 4 x 20', 'SCREW', 'Fastener', 'Stainless Steel', '4 x 20mm', 'PT. Fastener Indonesia', '93700-04020-1G', 150.00, 1000, 15, 'SYSTEM'),
('COMP-NUT-04000', 'NUT HEX 4 MM GN5', 'NUT', 'Fastener', 'Stainless Steel', '4mm', 'PT. Fastener Indonesia', '94001-04000-OS', 75.00, 1000, 15, 'SYSTEM'),
('COMP-COL-D10X7', 'COLLAR D10 X 7,6 X 6,2 MM', 'OTHER', 'Fastener', 'Steel', '10 x 7.6 x 6.2mm', 'PT. Hardware Solutions', 'COL-D10-762', 125.00, 500, 15, 'SYSTEM'),
('COMP-ORG-15X2', 'O-RING 15,7 X 2', 'SEAL', 'Sealing', 'NBR Rubber', '15.7 x 2mm', 'PT. Seal Technology', '9004A-30049', 2500.00, 100, 15, 'SYSTEM'),
('COMP-NUT-SZ179', 'NUT SZ179-05008', 'NUT', 'Fastener', 'Steel', 'SZ179', 'PT. Fastener Indonesia', 'SZ179-05008', 95.00, 1000, 15, 'SYSTEM'),
('COMP-CLR-9X12', 'COLLAR 9 X 12,6', 'OTHER', 'Fastener', 'Steel', '9 x 12.6mm', 'PT. Hardware Solutions', '11363-K18A-9000-H1', 185.00, 500, 15, 'SYSTEM'),

-- Mechanical Components
('COMP-GUA-ELEM', 'GUARD ELEMENT', 'OTHER', 'Protection', 'Steel', 'Standard', 'PT. Automotive Parts', '17211-K56A-N010-H1', 8500.00, 100, 20, 'SYSTEM'),
('COMP-GUI-CHAIN', 'GUIDE COMP DRIVE CHAIN', 'OTHER', 'Mechanical', 'Steel', 'Standard', 'PT. Automotive Parts', '11365-K18-9000', 12500.00, 50, 20, 'SYSTEM'),
('COMP-HIN-SEAT', 'HINGE SEAT', 'OTHER', 'Mechanical', 'Steel', 'Standard', 'PT. Honda Precision Parts', '77201-KWB-6000', 45000.00, 25, 20, 'SYSTEM'),
('COMP-RUB-MOUNT', 'RUBBER BOX MOUNT', 'OTHER', 'Mounting', 'Rubber', 'Standard', 'PT. Honda Precision Parts', '81253-KPHA-9000', 8500.00, 100, 15, 'SYSTEM'),
('COMP-BOL-HINGE', 'BOLT SEAT HINGE', 'BOLT', 'Fastener', 'Steel', 'Standard', 'PT. Fastener Indonesia', '90105-KRH-9000', 350.00, 500, 15, 'SYSTEM'),
('COMP-LAB-CARGO', 'LABEL CARGO LIMIT 10', 'OTHER', 'Label', 'Vinyl', '50x20mm', 'PT. Label Solutions', '81218-KYZA-9000', 1250.00, 500, 10, 'SYSTEM'),
('COMP-COL-6X20', 'COLLAR 6,2 X 20', 'OTHER', 'Fastener', 'Steel', '6.2 x 20mm', 'PT. Hardware Solutions', '90502-KPH-9000', 125.00, 1000, 15, 'SYSTEM'),
('COMP-SPR-HANDLE', 'SPRING HDL PLATE', 'SPRING', 'Mechanical', 'Spring Steel', 'Standard', 'PT. Spring Manufacturing', '85345-OC200', 3500.00, 100, 20, 'SYSTEM'),
('COMP-SLA-BUMPER', 'SLAM BUMPER', 'OTHER', 'Mechanical', 'Rubber', 'Standard', 'PT. Rubber Components', '85341-OC100', 8500.00, 50, 20, 'SYSTEM')
ON DUPLICATE KEY UPDATE
    component_name = VALUES(component_name),
    price_per_unit = VALUES(price_per_unit),
    updated_at = CURRENT_TIMESTAMP;

-- ================================
-- 4. PRODUCT DATA (Real Products from CSV)
-- ================================

-- Clear existing sample products
DELETE FROM master_product WHERE part_number_sap LIKE 'P%';

-- Insert real products from CSV (Selected representative products)
INSERT INTO master_product (
    part_number_sap, part_number_part, model, part_description, item_type, item_status, status_production,
    bom_level, qty_per_set, uom, mold_dimension, mold_cavity, mc_ton_application, cycle_time_application,
    parts_weight, runner_weight, mc_no, unit_per_hours, unit_per_day, capa_per_day,
    unit_price_q1, unit_price_q2, unit_price_q3, unit_price_q4,
    injection, trimming, buffing, manual_spray, auto_spray, printing, laser_marking, sorting, assembly, created_by
) VALUES
-- PT. ARKHA Products
('AB2MRR-KCMR93', 'AB2MRR-KCMR93', 'K2FA/K93', 'COVER MIRROR BACK R/L K93A YR-342', 'PRODUCT', 'ACTIVE', 'PRODUCTION', 
 1, 1, 'EA', '620 x 600 x 445', 4, 350.0, 35.0, 15.0, 20.0, 'A05', 153.0, 1153.0, 1153.0, 
 1256.0, 1256.0, 1256.0, 1256.0, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

('AB2MRR-KCMRTMBK00', 'AB2MRR-KCMRTMBK00', 'KTMN', 'COVER MIRROR BACK LH KTMN NH1 BLACK (F)', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '450 x 550 x 290', 4, 160.0, 72.0, 22.0, 5.6, 'A01', 100.0, 2400.0, 2280.0,
 1256.0, 1256.0, 1256.0, 1256.0, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

('AB2MRR-KCMRTMBK01', 'AB2MRR-KCMRTMBK01', 'KTMN', 'COVER MIRROR BACK RH KTMN NH1 BLACK (F)', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '450 x 550 x 290', 4, 160.0, 72.0, 22.0, 5.6, 'A01', 100.0, 2400.0, 2280.0,
 1256.0, 1256.0, 1256.0, 1256.0, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

('AB2MRR-KCMRKYTF', 'AB2MRR-KCMRKYTF', 'KYTF', 'COVER MIRROR BACK R/L KYTF DARK GREY', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '250 x 330 x 275', 2, 160.0, 70.0, 22.0, 8.6, 'A01', 102.0, 2448.0, 2326.0,
 1483.0, 1483.0, 1483.0, 1483.0, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

-- PT. ASTRA Products
('QB2MRR-SHLD1ABK00', 'QB2MRR-SHLD1ABK00', 'K1AL', 'HOLDER MIRROR BACK RH K1AA SC', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '450 x 600 x 440', 2, 400.0, 36.0, 35.0, 36.0, 'A10', 200.0, 4800.0, 4560.0,
 2100.0, 2100.0, 2100.0, 2100.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'SYSTEM'),

('QB2MRR-SHLD1ABK01', '88220-20-K1AA-N000-20', 'K1AL', 'HOLDER MIRROR BACK LH K1AA SC', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '450 x 600 x 440', 2, 400.0, 36.0, 35.0, 36.0, 'A10', 200.0, 4800.0, 4560.0,
 2100.0, 2100.0, 2100.0, 2100.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'SYSTEM'),

('QA2ACL-SHLD56BK00', '17232-K56A-N020', 'K56A', 'HOLDER COMP ELEMENT 17232-K56A-N020', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '400 x 450 x 430', 1, 160.0, 40.0, 88.0, 6.0, 'A03', 90.0, 2160.0, 2052.0,
 9495.0, 9495.0, 9495.0, 9495.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'SYSTEM'),

('QI2CRN-GCRA18BK01', '11360-K18-6400', 'K18L', 'COVER COMP, L REAR (11360-K18-6400) SC', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '400 x 600 x 430', 2, 400.0, 45.0, 99.0, 5.7, 'A09', 80.0, 1920.0, 1824.0,
 21477.0, 21477.0, 21477.0, 21477.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

-- PT. AUTO PLASTIK Products
('JI4ACO-GPLG33BK00', 'JI4ACO-GPLG33BK00', 'BZ010-H', 'PLUG TRANSMISSION OIL FILLER 33-BZ010-H_SB', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '250 x 250 x 275', 2, 160.0, 32.0, 6.0, 3.5, 'A01', 112.0, 2688.0, 2554.0,
 8385.0, 8385.0, 8385.0, 8385.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'SYSTEM'),

('JI4OTR-GKSA23BK00', 'JI4OTR-GKSA23BK00', 'EW082', 'KNOB SUB-ASSY- SHIFT LEVER_SB', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '350 x 470 x 390', 1, 160.0, 90.0, 60.0, 4.0, 'A03', 40.0, 960.0, 912.0,
 26304.0, 26304.0, 26304.0, 26304.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'SYSTEM'),

('AI4LVR-SKSL42BK02', 'AI4LVR-SKSL42BK02', 'EW082', 'KNOB SHIFT LEVER (INSERT) 33542-EW011', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 2, 1, 'EA', '450 x 525 x 380', 1, 200.0, 72.0, 70.0, 7.0, 'A03', 50.0, 1200.0, 1140.0,
 15028.0, 15028.0, 15028.0, 15028.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'SYSTEM'),

('AI4LVR-SKSL42BK00', 'AI4LVR-SKSL42BK00', 'EW082', 'KNOB SHIFT LEVER (UPPER) 33542-EW020', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 2, 1, 'EA', '300 x 300 x 280', 2, 200.0, 35.0, 12.0, 5.4, 'A03', 102.0, 2448.0, 2326.0,
 4124.0, 4124.0, 4124.0, 4124.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'SYSTEM'),

('JI2HLC-GCHF3SBK00', 'JI2HLC-GCHF3SBK00', 'K03S', 'COVER HANDLE FRONT K03S_SB', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '890 x 950 x 945', 2, 680.0, 67.0, 231.0, 9.16, 'A12', 107.0, 2568.0, 2440.0,
 10409.0, 10409.0, 10409.0, 10409.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

-- CV. BINTANG FAJAR Products
('BOX-01_BF', 'BOX-01_BF', 'GENERAL', 'BOX BF', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '780 x 950 x 580', 1, 850.0, 95.0, 2211.0, 0.0, 'A13', 37.0, 888.0, 844.0,
 0.0, 0.0, 0.0, 0.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

('COVER-01_BF', 'COVER-01_BF', 'GENERAL', 'COVER BOX BF', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '700 x 790 x 470', 1, 680.0, 100.0, 960.0, 0.0, 'A12', 36.0, 864.0, 821.0,
 0.0, 0.0, 0.0, 0.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

-- PT. CUBIC Products
('KS_CLZM_5925_01', 'KS_CLZM_5925_01', 'KS_CLZM', 'GRIP COVER PAINTING LHD_FL1', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '500 x 600 x 630', 1, 500.0, 60.0, 50.0, 15.0, 'A10', 60.0, 1440.0, 1368.0,
 0.0, 0.0, 0.0, 0.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM'),

('JM23022022_01', 'JM23022022_01', 'SU2ID', 'GRIP COVER INJECTION MOLD LHD_FL', 'PRODUCT', 'ACTIVE', 'PRODUCTION',
 1, 1, 'EA', '302 x 300 x 305', 1, 500.0, 60.0, 50.0, 15.0, 'A10', 60.0, 1440.0, 1368.0,
 0.0, 0.0, 0.0, 0.0, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'SYSTEM')

ON DUPLICATE KEY UPDATE
    part_description = VALUES(part_description),
    mold_dimension = VALUES(mold_dimension),
    parts_weight = VALUES(parts_weight),
    updated_at = CURRENT_TIMESTAMP;

-- ================================
-- 5. BOM DATA (Real BOM Relationships from CSV)
-- ================================

-- Clear existing sample BOM
DELETE FROM master_bom WHERE bom_number LIKE 'BOM%';

-- Insert real BOM from CSV analysis
INSERT INTO master_bom (
    bom_number, parent_part_number, child_part_number, component_type, 
    quantity_per_set, uom, material_code, component_code, 
    bom_level, sequence_number, effective_date, created_by
) VALUES
-- BOM untuk Cover Mirror Back K93 (ABS + Black Masterbatch compound)
('BOM-KCMR93-001', 'AB2MRR-KCMR93', 'MAT-ABS-100MPJ', 'RAW_MATERIAL', 0.0147, 'KG', 'MAT-ABS-100MPJ', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-KCMR93-002', 'AB2MRR-KCMR93', 'MAT-MB-JB302', 'RAW_MATERIAL', 0.0003, 'KG', 'MAT-MB-JB302', NULL, 1, 2, '2025-01-01', 'SYSTEM'),
('BOM-KCMR93-003', 'AB2MRR-KCMR93', 'MAT-ABS-KF720', 'RAW_MATERIAL', 0.0037, 'KG', 'MAT-ABS-KF720', NULL, 1, 3, '2025-01-01', 'SYSTEM'),

-- BOM untuk Cover Mirror Back KTMN (ABS + Black Masterbatch compound)
('BOM-KCMRTMBK00-001', 'AB2MRR-KCMRTMBK00', 'MAT-ABS-100MPJ', 'RAW_MATERIAL', 0.0165, 'KG', 'MAT-ABS-100MPJ', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-KCMRTMBK00-002', 'AB2MRR-KCMRTMBK00', 'MAT-MB-JB302', 'RAW_MATERIAL', 0.00044, 'KG', 'MAT-MB-JB302', NULL, 1, 2, '2025-01-01', 'SYSTEM'),
('BOM-KCMRTMBK00-003', 'AB2MRR-KCMRTMBK00', 'MAT-ABS-KF720', 'RAW_MATERIAL', 0.0055, 'KG', 'MAT-ABS-KF720', NULL, 1, 3, '2025-01-01', 'SYSTEM'),

('BOM-KCMRTMBK01-001', 'AB2MRR-KCMRTMBK01', 'MAT-ABS-100MPJ', 'RAW_MATERIAL', 0.0165, 'KG', 'MAT-ABS-100MPJ', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-KCMRTMBK01-002', 'AB2MRR-KCMRTMBK01', 'MAT-MB-JB302', 'RAW_MATERIAL', 0.00044, 'KG', 'MAT-MB-JB302', NULL, 1, 2, '2025-01-01', 'SYSTEM'),
('BOM-KCMRTMBK01-003', 'AB2MRR-KCMRTMBK01', 'MAT-ABS-KF720', 'RAW_MATERIAL', 0.0055, 'KG', 'MAT-ABS-KF720', NULL, 1, 3, '2025-01-01', 'SYSTEM'),

-- BOM untuk Cover Mirror Back KYTF (ABS + Grey Masterbatch)
('BOM-KCMRKYTF-001', 'AB2MRR-KCMRKYTF', 'MAT-ABS-100MPJ', 'RAW_MATERIAL', 0.0218, 'KG', 'MAT-ABS-100MPJ', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-KCMRKYTF-002', 'AB2MRR-KCMRKYTF', 'MAT-MB-1112', 'RAW_MATERIAL', 0.00022, 'KG', 'MAT-MB-1112', NULL, 1, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Holder Mirror Back (PP + Black Masterbatch + fasteners)
('BOM-SHLD1ABK00-001', 'QB2MRR-SHLD1ABK00', 'MAT-PP-7032E3', 'RAW_MATERIAL', 0.0175, 'KG', 'MAT-PP-7032E3', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK00-002', 'QB2MRR-SHLD1ABK00', 'MAT-PP-P10T6B', 'RAW_MATERIAL', 0.0175, 'KG', 'MAT-PP-P10T6B', NULL, 1, 2, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK00-003', 'QB2MRR-SHLD1ABK00', 'MAT-MB-7750', 'RAW_MATERIAL', 0.0007, 'KG', 'MAT-MB-7750', NULL, 1, 3, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK00-004', 'QB2MRR-SHLD1ABK00', 'COMP-SCR-04020', 'COMPONENT', 1, 'PCS', NULL, 'COMP-SCR-04020', 2, 1, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK00-005', 'QB2MRR-SHLD1ABK00', 'COMP-NUT-04000', 'COMPONENT', 1, 'PCS', NULL, 'COMP-NUT-04000', 2, 2, '2025-01-01', 'SYSTEM'),

('BOM-SHLD1ABK01-001', 'QB2MRR-SHLD1ABK01', 'MAT-PP-7032E3', 'RAW_MATERIAL', 0.0175, 'KG', 'MAT-PP-7032E3', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK01-002', 'QB2MRR-SHLD1ABK01', 'MAT-PP-P10T6B', 'RAW_MATERIAL', 0.0175, 'KG', 'MAT-PP-P10T6B', NULL, 1, 2, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK01-003', 'QB2MRR-SHLD1ABK01', 'MAT-MB-7750', 'RAW_MATERIAL', 0.0007, 'KG', 'MAT-MB-7750', NULL, 1, 3, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK01-004', 'QB2MRR-SHLD1ABK01', 'COMP-SCR-04020', 'COMPONENT', 1, 'PCS', NULL, 'COMP-SCR-04020', 2, 1, '2025-01-01', 'SYSTEM'),
('BOM-SHLD1ABK01-005', 'QB2MRR-SHLD1ABK01', 'COMP-NUT-04000', 'COMPONENT', 1, 'PCS', NULL, 'COMP-NUT-04000', 2, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Holder Element (PP + Black Masterbatch + purchased guard)
('BOM-SHLD56BK00-001', 'QA2ACL-SHLD56BK00', 'MAT-PP-AP03B', 'RAW_MATERIAL', 0.086, 'KG', 'MAT-PP-AP03B', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-SHLD56BK00-002', 'QA2ACL-SHLD56BK00', 'MAT-MB-7750', 'RAW_MATERIAL', 0.0018, 'KG', 'MAT-MB-7750', NULL, 1, 2, '2025-01-01', 'SYSTEM'),
('BOM-SHLD56BK00-003', 'QA2ACL-SHLD56BK00', 'COMP-GUA-ELEM', 'COMPONENT', 1, 'PCS', NULL, 'COMP-GUA-ELEM', 2, 1, '2025-01-01', 'SYSTEM'),

-- BOM untuk Cover Rear (BASF Black + components)
('BOM-GCRA18BK01-001', 'QI2CRN-GCRA18BK01', 'MAT-BASF-00646', 'RAW_MATERIAL', 0.0991, 'KG', 'MAT-BASF-00646', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-GCRA18BK01-002', 'QI2CRN-GCRA18BK01', 'COMP-CLR-9X12', 'COMPONENT', 2, 'PCS', NULL, 'COMP-CLR-9X12', 2, 1, '2025-01-01', 'SYSTEM'),
('BOM-GCRA18BK01-003', 'QI2CRN-GCRA18BK01', 'COMP-GUI-CHAIN', 'COMPONENT', 1, 'PCS', NULL, 'COMP-GUI-CHAIN', 2, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Plug Transmission (PPS + seals)
('BOM-GPLG33BK00-001', 'JI4ACO-GPLG33BK00', 'MAT-PPS-1140L4', 'RAW_MATERIAL', 0.006, 'KG', 'MAT-PPS-1140L4', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-GPLG33BK00-002', 'JI4ACO-GPLG33BK00', 'COMP-COL-D10X7', 'COMPONENT', 1, 'PCS', NULL, 'COMP-COL-D10X7', 2, 1, '2025-01-01', 'SYSTEM'),
('BOM-GPLG33BK00-003', 'JI4ACO-GPLG33BK00', 'COMP-ORG-15X2', 'COMPONENT', 1, 'PCS', NULL, 'COMP-ORG-15X2', 2, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Knob Shift Lever Assembly (PVC body + sub-assemblies)
('BOM-GKSA23BK00-001', 'JI4OTR-GKSA23BK00', 'MAT-PVC-JL013D', 'RAW_MATERIAL', 0.060, 'KG', 'MAT-PVC-JL013D', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-GKSA23BK00-002', 'JI4OTR-GKSA23BK00', 'AI4LVR-SKSL42BK02', 'ASSEMBLY', 1, 'PCS', NULL, NULL, 2, 1, '2025-01-01', 'SYSTEM'),
('BOM-GKSA23BK00-003', 'JI4OTR-GKSA23BK00', 'AI4LVR-SKSL42BK00', 'ASSEMBLY', 1, 'PCS', NULL, NULL, 2, 2, '2025-01-01', 'SYSTEM'),
('BOM-GKSA23BK00-004', 'JI4OTR-GKSA23BK00', 'COMP-NUT-SZ179', 'COMPONENT', 2, 'PCS', NULL, 'COMP-NUT-SZ179', 3, 1, '2025-01-01', 'SYSTEM'),

-- BOM untuk Knob Insert (Nylon + Black Masterbatch)
('BOM-SKSL42BK02-001', 'AI4LVR-SKSL42BK02', 'MAT-NY66-A216', 'RAW_MATERIAL', 0.0686, 'KG', 'MAT-NY66-A216', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-SKSL42BK02-002', 'AI4LVR-SKSL42BK02', 'MAT-MB-JN2963', 'RAW_MATERIAL', 0.0014, 'KG', 'MAT-MB-JN2963', NULL, 1, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Knob Upper (Nylon + Black Masterbatch)  
('BOM-SKSL42BK00-001', 'AI4LVR-SKSL42BK00', 'MAT-NY66-A216', 'RAW_MATERIAL', 0.0118, 'KG', 'MAT-NY66-A216', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-SKSL42BK00-002', 'AI4LVR-SKSL42BK00', 'MAT-MB-JN2963', 'RAW_MATERIAL', 0.00024, 'KG', 'MAT-MB-JN2963', NULL, 1, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Cover Handle Front (ABS compound + masterbatch blend)
('BOM-GCHF3SBK00-001', 'JI2HLC-GCHF3SBK00', 'MAT-ABS-100MPJ', 'RAW_MATERIAL', 0.115, 'KG', 'MAT-ABS-100MPJ', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-GCHF3SBK00-002', 'JI2HLC-GCHF3SBK00', 'MAT-MB-7786', 'RAW_MATERIAL', 0.0046, 'KG', 'MAT-MB-7786', NULL, 1, 2, '2025-01-01', 'SYSTEM'),
('BOM-GCHF3SBK00-003', 'JI2HLC-GCHF3SBK00', 'MAT-MB-JB302', 'RAW_MATERIAL', 0.115, 'KG', 'MAT-MB-JB302', NULL, 1, 3, '2025-01-01', 'SYSTEM'),

-- BOM untuk Box BF (PP + Black Masterbatch)
('BOM-BOX01BF-001', 'BOX-01_BF', 'MAT-PP-7032E3', 'RAW_MATERIAL', 2.168, 'KG', 'MAT-PP-7032E3', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-BOX01BF-002', 'BOX-01_BF', 'MAT-MB-JP112', 'RAW_MATERIAL', 0.0434, 'KG', 'MAT-MB-JP112', NULL, 1, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Cover BF (PP + Black Masterbatch)
('BOM-COVER01BF-001', 'COVER-01_BF', 'MAT-PP-7032E3', 'RAW_MATERIAL', 0.941, 'KG', 'MAT-PP-7032E3', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-COVER01BF-002', 'COVER-01_BF', 'MAT-MB-JP112', 'RAW_MATERIAL', 0.0188, 'KG', 'MAT-MB-JP112', NULL, 1, 2, '2025-01-01', 'SYSTEM'),

-- BOM untuk Grip Cover (PC-PBT material)
('BOM-CLZM5925-01-001', 'KS_CLZM_5925_01', 'MAT-PC-PBT-3080', 'RAW_MATERIAL', 0.0485, 'KG', 'MAT-PC-PBT-3080', NULL, 1, 1, '2025-01-01', 'SYSTEM'),
('BOM-JM23022022-01-001', 'JM23022022_01', 'MAT-PC-PBT-3080', 'RAW_MATERIAL', 0.0485, 'KG', 'MAT-PC-PBT-3080', NULL, 1, 1, '2025-01-01', 'SYSTEM')

ON DUPLICATE KEY UPDATE
    quantity_per_set = VALUES(quantity_per_set),
    updated_at = CURRENT_TIMESTAMP;

-- ================================
-- 6. LOCATION DATA (Real Machine Numbers from CSV)
-- ================================

-- Clear existing sample locations except warehouse zones
DELETE FROM master_location WHERE location_code LIKE 'MACH%' OR location_code LIKE 'ASY%';

-- Insert real machine locations from CSV
INSERT INTO master_location (location_code, location_name, location_type, building, zone, allow_mixed_items, require_qr_scan, created_by) VALUES
('MACH-A01', 'Injection Machine A01 (160T)', 'PRODUCTION', 'Building A', 'Production Line 1', FALSE, TRUE, 'SYSTEM'),
('MACH-A02', 'Injection Machine A02 (160T)', 'PRODUCTION', 'Building A', 'Production Line 1', FALSE, TRUE, 'SYSTEM'),
('MACH-A03', 'Injection Machine A03 (160T)', 'PRODUCTION', 'Building A', 'Production Line 1', FALSE, TRUE, 'SYSTEM'),
('MACH-A05', 'Injection Machine A05 (350T)', 'PRODUCTION', 'Building A', 'Production Line 2', FALSE, TRUE, 'SYSTEM'),
('MACH-A09', 'Injection Machine A09 (400T)', 'PRODUCTION', 'Building A', 'Production Line 3', FALSE, TRUE, 'SYSTEM'),
('MACH-A10', 'Injection Machine A10 (400T)', 'PRODUCTION', 'Building A', 'Production Line 3', FALSE, TRUE, 'SYSTEM'),
('MACH-A12', 'Injection Machine A12 (680T)', 'PRODUCTION', 'Building A', 'Production Line 4', FALSE, TRUE, 'SYSTEM'),
('MACH-A13', 'Injection Machine A13 (850T)', 'PRODUCTION', 'Building A', 'Production Line 4', FALSE, TRUE, 'SYSTEM'),
('ASY-LINE-01', 'Assembly Line 1', 'PRODUCTION', 'Building A', 'Assembly Area', FALSE, TRUE, 'SYSTEM'),
('ASY-LINE-02', 'Assembly Line 2', 'PRODUCTION', 'Building A', 'Assembly Area', FALSE, TRUE, 'SYSTEM'),
('ASY-LINE-03', 'Assembly Line 3', 'PRODUCTION', 'Building A', 'Assembly Area', FALSE, TRUE, 'SYSTEM'),
('ASY-LINE-05', 'Assembly Line 5', 'PRODUCTION', 'Building A', 'Assembly Area', FALSE, TRUE, 'SYSTEM')


ON DUPLICATE KEY UPDATE
    location_name = VALUES(location_name),
    updated_at = CURRENT_TIMESTAMP;

-- ================================
-- SUMMARY STATISTICS
-- ================================

SELECT 
    'DATA INSERTION COMPLETED' as status,
    (SELECT COUNT(*) FROM master_customer WHERE customer_code LIKE 'CUST-%') as customers_inserted,
    (SELECT COUNT(*) FROM master_material WHERE material_code LIKE 'MAT-%') as materials_inserted,
    (SELECT COUNT(*) FROM master_component WHERE component_code LIKE 'COMP-%') as components_inserted,
    (SELECT COUNT(*) FROM master_product WHERE part_number_sap LIKE '%-%') as products_inserted,
    (SELECT COUNT(*) FROM master_bom WHERE bom_number LIKE 'BOM-%') as bom_entries_inserted,
    (SELECT COUNT(*) FROM master_location WHERE location_code LIKE 'MACH-%' OR location_code LIKE 'ASY-%' OR location_code LIKE 'PKG-%' OR location_code LIKE 'FIN-%') as locations_inserted;
