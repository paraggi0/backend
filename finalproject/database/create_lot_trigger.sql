-- ================================
-- LOT NUMBER TRIGGER FOR GOOGLE CLOUD SQL
-- ================================
-- Execute this AFTER creating all tables from 20_gcp_complete_deployment.sql
-- This trigger automatically generates lot numbers when inserting new lot records

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
