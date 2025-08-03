-- ================================
-- MASTER DATA VIEWS WITH QR CODE & LOT NUMBER INTEGRATION
-- ================================
-- These views provide easy access to master data with QR and Lot tracking

-- ================================
-- VIEW: QR Code Master with Details
-- ================================
CREATE OR REPLACE VIEW view_qr_master AS
SELECT 
    q.qr_id,
    q.qr_code,
    q.qr_type,
    q.reference_code,
    q.reference_description,
    q.lot_number,
    l.lot_type,
    l.manufacturing_date,
    l.quality_status,
    q.current_location_code,
    loc.location_name,
    q.status as qr_status,
    q.manufacturing_date as qr_manufacturing_date,
    q.expiry_date,
    q.last_scan_location,
    q.last_scan_time,
    q.scan_count,
    q.created_at as qr_created_at
FROM master_qr_code q
LEFT JOIN master_lot_number l ON q.lot_number = l.lot_number
LEFT JOIN master_location loc ON q.current_location_code = loc.location_code
WHERE q.status = 'ACTIVE';

-- ================================
-- VIEW: Lot Number with QR Tracking
-- ================================
CREATE OR REPLACE VIEW view_lot_tracking AS
SELECT 
    l.lot_id,
    l.lot_number,
    l.lot_type,
    l.item_code,
    l.item_description,
    l.manufacturing_date,
    l.manufacturing_shift,
    l.machine_code,
    l.operator_code,
    l.quality_status,
    l.initial_qty,
    l.current_qty,
    l.reserved_qty,
    l.uom,
    l.status as lot_status,
    COUNT(q.qr_id) as qr_count,
    GROUP_CONCAT(q.qr_code ORDER BY q.qr_code) as associated_qr_codes,
    l.created_at as lot_created_at
FROM master_lot_number l
LEFT JOIN master_qr_code q ON l.lot_number = q.lot_number
WHERE l.status = 'ACTIVE'
GROUP BY l.lot_id, l.lot_number, l.lot_type, l.item_code, l.item_description,
         l.manufacturing_date, l.manufacturing_shift, l.machine_code, l.operator_code,
         l.quality_status, l.initial_qty, l.current_qty, l.reserved_qty, l.uom, l.status, l.created_at;

-- ================================
-- VIEW: Complete Product Information with QR/Lot Integration
-- ================================
CREATE OR REPLACE VIEW view_product_master AS
SELECT 
    p.product_id,
    p.part_number_sap,
    p.part_number_part,
    p.model,
    p.part_description,
    p.item_type,
    p.item_status,
    p.status_production,
    p.bom_level,
    p.qty_per_set,
    p.uom,
    p.mold_dimension,
    p.mold_cavity,
    p.mc_ton_application,
    p.cycle_time_application,
    p.parts_weight,
    p.runner_weight,
    p.mc_no,
    p.unit_per_hours,
    p.unit_per_day,
    p.capa_per_day,
    p.unit_price_q1,
    p.unit_price_q2,
    p.unit_price_q3,
    p.unit_price_q4,
    p.injection,
    p.trimming,
    p.buffing,
    p.manual_spray,
    p.auto_spray,
    p.printing,
    p.laser_marking,
    p.sorting,
    p.assembly,
    p.status as product_status,
    p.created_at,
    p.updated_at
FROM master_product p
WHERE p.status = 'ACTIVE';

-- ================================
-- VIEW: BOM Structure with Details
-- ================================
CREATE OR REPLACE VIEW view_bom_structure AS
SELECT 
    b.bom_id,
    b.bom_number,
    b.parent_part_number,
    pp.part_description as parent_description,
    b.child_part_number,
    CASE 
        WHEN b.component_type = 'RAW_MATERIAL' THEN m.material_name
        WHEN b.component_type = 'COMPONENT' THEN c.component_name
        ELSE cp.part_description
    END as child_description,
    b.bom_level,
    b.sequence_number,
    b.quantity_per_set,
    b.uom,
    b.component_type,
    b.usage_type,
    b.material_code,
    m.material_name,
    m.material_category,
    b.component_code,
    c.component_name,
    c.component_type as component_type_detail,
    b.effective_date,
    b.obsolete_date,
    b.status as bom_status
FROM master_bom b
LEFT JOIN master_product pp ON b.parent_part_number = pp.part_number_sap
LEFT JOIN master_product cp ON b.child_part_number = cp.part_number_sap
LEFT JOIN master_material m ON b.material_code = m.material_code
LEFT JOIN master_component c ON b.component_code = c.component_code
WHERE b.status = 'ACTIVE'
    AND (b.obsolete_date IS NULL OR b.obsolete_date > CURRENT_DATE);

-- ================================
-- VIEW: Material Usage Summary
-- ================================
CREATE OR REPLACE VIEW view_material_usage AS
SELECT 
    m.material_id,
    m.material_code,
    m.material_name,
    m.material_type,
    m.material_category,
    m.supplier,
    m.grade,
    m.color,
    COUNT(b.bom_id) as usage_count,
    GROUP_CONCAT(DISTINCT b.parent_part_number ORDER BY b.parent_part_number) as used_in_products,
    SUM(b.quantity_per_set) as total_quantity_required,
    m.price_per_kg,
    m.status as material_status
FROM master_material m
LEFT JOIN master_bom b ON m.material_code = b.material_code
WHERE m.status = 'ACTIVE'
GROUP BY m.material_id, m.material_code, m.material_name, m.material_type, 
         m.material_category, m.supplier, m.grade, m.color, m.price_per_kg, m.status;

-- ================================
-- VIEW: Component Usage Summary
-- ================================
CREATE OR REPLACE VIEW view_component_usage AS
SELECT 
    c.component_id,
    c.component_code,
    c.component_name,
    c.component_type,
    c.component_category,
    c.material,
    c.supplier_name,
    COUNT(b.bom_id) as usage_count,
    GROUP_CONCAT(DISTINCT b.parent_part_number ORDER BY b.parent_part_number) as used_in_products,
    SUM(b.quantity_per_set) as total_quantity_required,
    c.price_per_unit,
    c.minimum_order_qty,
    c.lead_time_days,
    c.lifecycle_status,
    c.status as component_status
FROM master_component c
LEFT JOIN master_bom b ON c.component_code = b.component_code
WHERE c.status = 'ACTIVE'
GROUP BY c.component_id, c.component_code, c.component_name, c.component_type, 
         c.component_category, c.material, c.supplier_name, c.price_per_unit, 
         c.minimum_order_qty, c.lead_time_days, c.lifecycle_status, c.status;

-- ================================
-- VIEW: Product Cost Analysis
-- ================================
CREATE OR REPLACE VIEW view_product_cost_analysis AS
SELECT 
    p.product_id,
    p.part_number_sap,
    p.part_description,
    p.model,
    
    -- Material costs
    SUM(CASE WHEN b.component_type = 'RAW_MATERIAL' THEN 
        COALESCE(b.quantity_per_set * m.price_per_kg * p.parts_weight / 1000, 0) 
        ELSE 0 END) as total_material_cost,
    
    -- Component costs
    SUM(CASE WHEN b.component_type = 'COMPONENT' THEN 
        COALESCE(b.quantity_per_set * c.price_per_unit, 0) 
        ELSE 0 END) as total_component_cost,
    
    -- Total BOM cost
    SUM(CASE WHEN b.component_type = 'RAW_MATERIAL' THEN 
        COALESCE(b.quantity_per_set * m.price_per_kg * p.parts_weight / 1000, 0) 
        ELSE 0 END) +
    SUM(CASE WHEN b.component_type = 'COMPONENT' THEN 
        COALESCE(b.quantity_per_set * c.price_per_unit, 0) 
        ELSE 0 END) as total_bom_cost,
    
    -- Selling prices
    p.unit_price_q1,
    p.unit_price_q2,
    p.unit_price_q3,
    p.unit_price_q4,
    
    -- Margin analysis (using Q3 price as reference)
    p.unit_price_q3 - (
        SUM(CASE WHEN b.component_type = 'RAW_MATERIAL' THEN 
            COALESCE(b.quantity_per_set * m.price_per_kg * p.parts_weight / 1000, 0) 
            ELSE 0 END) +
        SUM(CASE WHEN b.component_type = 'COMPONENT' THEN 
            COALESCE(b.quantity_per_set * c.price_per_unit, 0) 
            ELSE 0 END)
    ) as gross_margin,
    
    CASE 
        WHEN p.unit_price_q3 > 0 THEN 
            ROUND(((p.unit_price_q3 - (
                SUM(CASE WHEN b.component_type = 'RAW_MATERIAL' THEN 
                    COALESCE(b.quantity_per_set * m.price_per_kg * p.parts_weight / 1000, 0) 
                    ELSE 0 END) +
                SUM(CASE WHEN b.component_type = 'COMPONENT' THEN 
                    COALESCE(b.quantity_per_set * c.price_per_unit, 0) 
                    ELSE 0 END)
            )) / p.unit_price_q3) * 100, 2)
        ELSE 0 
    END as margin_percentage,
    
    COUNT(b.bom_id) as component_count,
    p.capa_per_day,
    p.cycle_time_application
    
FROM master_product p
LEFT JOIN master_bom b ON p.part_number_sap = b.parent_part_number
LEFT JOIN master_material m ON b.material_code = m.material_code
LEFT JOIN master_component c ON b.component_code = c.component_code
WHERE p.status = 'ACTIVE' 
    AND (b.status = 'ACTIVE' OR b.status IS NULL)
GROUP BY p.product_id, p.part_number_sap, p.part_description, p.model,
         p.unit_price_q1, p.unit_price_q2, p.unit_price_q3, p.unit_price_q4,
         p.capa_per_day, p.cycle_time_application, p.parts_weight;

-- ================================
-- VIEW: QR Scan Activity Dashboard
-- ================================
CREATE OR REPLACE VIEW view_qr_scan_activity AS
SELECT 
    qs.scan_id,
    qs.qr_code,
    q.qr_type,
    q.reference_code,
    q.reference_description,
    qs.scan_timestamp,
    qs.scan_location,
    qs.scan_user,
    qs.scan_type,
    qs.transaction_number,
    qs.remarks,
    qs.success,
    DATE(qs.scan_timestamp) as scan_date,
    TIME(qs.scan_timestamp) as scan_time,
    CASE 
        WHEN qs.scan_timestamp >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 'TODAY'
        WHEN qs.scan_timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'THIS_WEEK'
        WHEN qs.scan_timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'THIS_MONTH'
        ELSE 'OLDER'
    END as scan_period
FROM qr_scan_log qs
JOIN master_qr_code q ON qs.qr_code = q.qr_code
ORDER BY qs.scan_timestamp DESC;

-- ================================
-- VIEW: Lot Transaction Summary
-- ================================
CREATE OR REPLACE VIEW view_lot_transaction_summary AS
SELECT 
    lth.transaction_id,
    lth.lot_number,
    l.lot_type,
    l.item_code,
    l.item_description,
    lth.transaction_type,
    lth.transaction_date,
    lth.transaction_timestamp,
    lth.quantity_before,
    lth.quantity_change,
    lth.quantity_after,
    lth.location_from,
    lth.location_to,
    lth.created_by,
    lth.approved_by,
    lth.remarks,
    DATE(lth.transaction_timestamp) as transaction_date_only,
    TIME(lth.transaction_timestamp) as transaction_time,
    CASE 
        WHEN lth.quantity_change > 0 THEN 'INCREASE'
        WHEN lth.quantity_change < 0 THEN 'DECREASE'
        ELSE 'NO_CHANGE'
    END as quantity_movement_type
FROM lot_transaction_history lth
JOIN master_lot_number l ON lth.lot_number = l.lot_number
ORDER BY lth.transaction_timestamp DESC;

-- ================================
-- VIEW: Mobile Scan Dashboard  
-- ================================
CREATE OR REPLACE VIEW view_mobile_scan_dashboard AS
SELECT 
    q.qr_code,
    q.qr_type,
    q.reference_code,
    q.reference_description,
    q.lot_number,
    l.lot_type,
    l.quality_status,
    q.current_location_code,
    loc.location_name,
    q.last_scan_time,
    q.scan_count,
    CASE 
        WHEN q.last_scan_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 'RECENTLY_SCANNED'
        WHEN q.last_scan_time >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 'TODAY'
        WHEN q.last_scan_time >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'THIS_WEEK'
        ELSE 'OLDER'
    END as last_scan_period,
    q.status as qr_status
FROM master_qr_code q
LEFT JOIN master_lot_number l ON q.lot_number = l.lot_number
LEFT JOIN master_location loc ON q.current_location_code = loc.location_code
WHERE q.status = 'ACTIVE'
ORDER BY q.last_scan_time DESC;
