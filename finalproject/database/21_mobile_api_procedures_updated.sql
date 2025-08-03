-- ================================
-- MOBILE API STORED PROCEDURES - UPDATED
-- ================================
-- Updated procedures for QR Code and Lot Number system

-- ================================
-- PROCEDURE: Enhanced Mobile QR Scan
-- ================================
DROP PROCEDURE IF EXISTS sp_mobile_scan_qr;

CREATE PROCEDURE sp_mobile_scan_qr(
    IN p_qr_code VARCHAR(255),
    IN p_scan_location VARCHAR(100),
    IN p_scan_user VARCHAR(100),
    IN p_scan_type ENUM('CHECK_IN', 'CHECK_OUT', 'TRANSFER', 'VERIFY', 'UPDATE'),
    IN p_transaction_number VARCHAR(100),
    IN p_remarks TEXT
)
BEGIN
    DECLARE v_qr_exists INT DEFAULT 0;
    DECLARE v_qr_type VARCHAR(50);
    DECLARE v_reference_code VARCHAR(100);
    DECLARE v_current_location VARCHAR(100);
    DECLARE v_lot_number VARCHAR(100);
    DECLARE v_scan_id INT;
    DECLARE v_error_msg TEXT DEFAULT '';
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1
            v_error_msg = MESSAGE_TEXT;
        INSERT INTO qr_scan_log (qr_code, scan_timestamp, scan_location, scan_user, scan_type, 
                                transaction_number, remarks, success, error_message)
        VALUES (p_qr_code, NOW(), p_scan_location, p_scan_user, p_scan_type, 
                p_transaction_number, p_remarks, FALSE, v_error_msg);
        
        SELECT 0 as success, v_error_msg as message, NULL as qr_info;
    END;

    START TRANSACTION;
    
    -- Check if QR code exists
    SELECT COUNT(*), qr_type, reference_code, current_location_code, lot_number
    INTO v_qr_exists, v_qr_type, v_reference_code, v_current_location, v_lot_number
    FROM master_qr_code 
    WHERE qr_code = p_qr_code AND status = 'ACTIVE';
    
    IF v_qr_exists = 0 THEN
        INSERT INTO qr_scan_log (qr_code, scan_timestamp, scan_location, scan_user, scan_type, 
                                transaction_number, remarks, success, error_message)
        VALUES (p_qr_code, NOW(), p_scan_location, p_scan_user, p_scan_type, 
                p_transaction_number, p_remarks, FALSE, 'QR Code not found or inactive');
        
        COMMIT;
        SELECT 0 as success, 'QR Code not found or inactive' as message, NULL as qr_info;
    ELSE
        -- Update QR code location and scan info
        UPDATE master_qr_code 
        SET current_location_code = p_scan_location,
            last_scan_location = p_scan_location,
            last_scan_time = NOW(),
            scan_count = scan_count + 1,
            updated_at = NOW()
        WHERE qr_code = p_qr_code;
        
        -- Log the scan
        INSERT INTO qr_scan_log (qr_code, scan_timestamp, scan_location, scan_user, scan_type, 
                                transaction_number, before_status, after_status, remarks, success)
        VALUES (p_qr_code, NOW(), p_scan_location, p_scan_user, p_scan_type, 
                p_transaction_number, 
                JSON_OBJECT('location', v_current_location),
                JSON_OBJECT('location', p_scan_location),
                p_remarks, TRUE);
        
        SET v_scan_id = LAST_INSERT_ID();
        
        COMMIT;
        
        -- Return success with QR info
        SELECT 1 as success, 'QR Code scanned successfully' as message,
               JSON_OBJECT(
                   'scan_id', v_scan_id,
                   'qr_code', p_qr_code,
                   'qr_type', v_qr_type,
                   'reference_code', v_reference_code,
                   'lot_number', v_lot_number,
                   'previous_location', v_current_location,
                   'current_location', p_scan_location,
                   'scan_timestamp', NOW()
               ) as qr_info;
    END IF;
END;

-- ================================
-- PROCEDURE: Enhanced Mobile Lot Info
-- ================================
DROP PROCEDURE IF EXISTS sp_mobile_get_lot_info;

CREATE PROCEDURE sp_mobile_get_lot_info(
    IN p_lot_number VARCHAR(100)
)
BEGIN
    DECLARE v_lot_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_lot_exists
    FROM master_lot_number 
    WHERE lot_number = p_lot_number AND status = 'ACTIVE';
    
    IF v_lot_exists = 0 THEN
        SELECT 0 as success, 'Lot number not found or inactive' as message, NULL as lot_info;
    ELSE
        SELECT 1 as success, 'Lot information retrieved' as message,
               JSON_OBJECT(
                   'lot_number', l.lot_number,
                   'lot_type', l.lot_type,
                   'item_code', l.item_code,
                   'item_description', l.item_description,
                   'manufacturing_date', l.manufacturing_date,
                   'manufacturing_shift', l.manufacturing_shift,
                   'machine_code', l.machine_code,
                   'operator_code', l.operator_code,
                   'quality_status', l.quality_status,
                   'initial_qty', l.initial_qty,
                   'current_qty', l.current_qty,
                   'reserved_qty', l.reserved_qty,
                   'uom', l.uom,
                   'qr_codes', (
                       SELECT GROUP_CONCAT(qr_code ORDER BY qr_code)
                       FROM master_qr_code 
                       WHERE lot_number = p_lot_number AND status = 'ACTIVE'
                   ),
                   'recent_transactions', (
                       SELECT JSON_ARRAYAGG(
                           JSON_OBJECT(
                               'transaction_type', transaction_type,
                               'transaction_date', transaction_date,
                               'quantity_change', quantity_change,
                               'location_from', location_from,
                               'location_to', location_to,
                               'created_by', created_by
                           )
                       )
                       FROM (
                           SELECT transaction_type, transaction_date, quantity_change, 
                                  location_from, location_to, created_by
                           FROM lot_transaction_history 
                           WHERE lot_number = p_lot_number 
                           ORDER BY transaction_timestamp DESC 
                           LIMIT 5
                       ) recent
                   )
               ) as lot_info
        FROM master_lot_number l
        WHERE l.lot_number = p_lot_number;
    END IF;
END;

-- ================================
-- PROCEDURE: Enhanced Mobile Location Update
-- ================================
DROP PROCEDURE IF EXISTS sp_mobile_update_location;

CREATE PROCEDURE sp_mobile_update_location(
    IN p_qr_code VARCHAR(255),
    IN p_new_location VARCHAR(100),
    IN p_user VARCHAR(100),
    IN p_remarks TEXT
)
BEGIN
    DECLARE v_qr_exists INT DEFAULT 0;
    DECLARE v_old_location VARCHAR(100);
    DECLARE v_lot_number VARCHAR(100);
    DECLARE v_error_msg TEXT DEFAULT '';
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1
            v_error_msg = MESSAGE_TEXT;
        SELECT 0 as success, v_error_msg as message;
    END;

    START TRANSACTION;
    
    -- Check if QR code exists and get current location
    SELECT COUNT(*), current_location_code, lot_number
    INTO v_qr_exists, v_old_location, v_lot_number
    FROM master_qr_code 
    WHERE qr_code = p_qr_code AND status = 'ACTIVE';
    
    IF v_qr_exists = 0 THEN
        ROLLBACK;
        SELECT 0 as success, 'QR Code not found or inactive' as message;
    ELSE
        -- Update QR code location
        UPDATE master_qr_code 
        SET current_location_code = p_new_location,
            last_scan_location = p_new_location,
            last_scan_time = NOW(),
            scan_count = scan_count + 1,
            updated_by = p_user,
            updated_at = NOW()
        WHERE qr_code = p_qr_code;
        
        -- Log the location change
        INSERT INTO qr_scan_log (qr_code, scan_timestamp, scan_location, scan_user, scan_type, 
                                before_status, after_status, remarks, success)
        VALUES (p_qr_code, NOW(), p_new_location, p_user, 'TRANSFER',
                JSON_OBJECT('location', v_old_location),
                JSON_OBJECT('location', p_new_location),
                p_remarks, TRUE);
        
        -- If there's a lot number, create lot transaction
        IF v_lot_number IS NOT NULL AND v_lot_number != '' THEN
            INSERT INTO lot_transaction_history (lot_number, transaction_type, transaction_date, 
                                                transaction_timestamp, location_from, location_to, 
                                                created_by, remarks)
            VALUES (v_lot_number, 'TRANSFER_IN', CURDATE(), NOW(), 
                    v_old_location, p_new_location, p_user, p_remarks);
        END IF;
        
        COMMIT;
        SELECT 1 as success, 'Location updated successfully' as message,
               JSON_OBJECT(
                   'qr_code', p_qr_code,
                   'old_location', v_old_location,
                   'new_location', p_new_location,
                   'lot_number', v_lot_number,
                   'updated_at', NOW()
               ) as update_info;
    END IF;
END;

-- ================================
-- PROCEDURE: Lot Quantity Adjustment
-- ================================
DROP PROCEDURE IF EXISTS sp_mobile_adjust_lot_quantity;

CREATE PROCEDURE sp_mobile_adjust_lot_quantity(
    IN p_lot_number VARCHAR(100),
    IN p_adjustment_qty DECIMAL(12,3),
    IN p_adjustment_type ENUM('CONSUME', 'RETURN', 'ADJUST'),
    IN p_user VARCHAR(100),
    IN p_remarks TEXT
)
BEGIN
    DECLARE v_lot_exists INT DEFAULT 0;
    DECLARE v_current_qty DECIMAL(12,3);
    DECLARE v_new_qty DECIMAL(12,3);
    DECLARE v_error_msg TEXT DEFAULT '';
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1
            v_error_msg = MESSAGE_TEXT;
        SELECT 0 as success, v_error_msg as message;
    END;

    START TRANSACTION;
    
    -- Check if lot exists and get current quantity
    SELECT COUNT(*), current_qty
    INTO v_lot_exists, v_current_qty
    FROM master_lot_number 
    WHERE lot_number = p_lot_number AND status = 'ACTIVE';
    
    IF v_lot_exists = 0 THEN
        ROLLBACK;
        SELECT 0 as success, 'Lot number not found or inactive' as message;
    ELSE
        SET v_new_qty = v_current_qty + p_adjustment_qty;
        
        IF v_new_qty < 0 THEN
            ROLLBACK;
            SELECT 0 as success, 'Insufficient quantity for adjustment' as message;
        ELSE
            -- Update lot quantity
            UPDATE master_lot_number 
            SET current_qty = v_new_qty,
                updated_by = p_user,
                updated_at = NOW()
            WHERE lot_number = p_lot_number;
            
            -- Log the transaction
            INSERT INTO lot_transaction_history (lot_number, transaction_type, transaction_date, 
                                                transaction_timestamp, quantity_before, quantity_change, 
                                                quantity_after, created_by, remarks)
            VALUES (p_lot_number, p_adjustment_type, CURDATE(), NOW(), 
                    v_current_qty, p_adjustment_qty, v_new_qty, p_user, p_remarks);
            
            COMMIT;
            SELECT 1 as success, 'Lot quantity adjusted successfully' as message,
                   JSON_OBJECT(
                       'lot_number', p_lot_number,
                       'previous_qty', v_current_qty,
                       'adjustment_qty', p_adjustment_qty,
                       'new_qty', v_new_qty,
                       'adjustment_type', p_adjustment_type,
                       'adjusted_at', NOW()
                   ) as adjustment_info;
        END IF;
    END IF;
END;

-- ================================
-- PROCEDURE: Generate New QR Code
-- ================================
DROP PROCEDURE IF EXISTS sp_generate_qr_code;

CREATE PROCEDURE sp_generate_qr_code(
    IN p_qr_type ENUM('PRODUCT', 'MATERIAL', 'COMPONENT', 'WIP', 'FG', 'LOCATION', 'TRANSFER'),
    IN p_reference_code VARCHAR(100),
    IN p_reference_description TEXT,
    IN p_lot_number VARCHAR(100),
    IN p_location_code VARCHAR(100),
    IN p_user VARCHAR(100)
)
BEGIN
    DECLARE v_sequence INT DEFAULT 1;
    DECLARE v_new_qr_code VARCHAR(255);
    DECLARE v_timestamp VARCHAR(14);
    DECLARE v_error_msg TEXT DEFAULT '';
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1
            v_error_msg = MESSAGE_TEXT;
        SELECT 0 as success, v_error_msg as message, NULL as qr_code;
    END;

    START TRANSACTION;
    
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
        qr_code, qr_type, reference_code, reference_description,
        lot_number, current_location_code, created_by
    ) VALUES (
        v_new_qr_code, p_qr_type, p_reference_code, p_reference_description,
        p_lot_number, p_location_code, p_user
    );
    
    COMMIT;
    SELECT 1 as success, 'QR Code generated successfully' as message, v_new_qr_code as qr_code;
END;
