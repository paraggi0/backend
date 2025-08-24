# API URL Summary for Android Integration

## Quick Reference

### Query Service (FastAPI) - Port 8000
Base URL: `http://your-server:8000`

### Command Service (Node.js) - Port 3001  
Base URL: `http://your-server:3001`

## Complete Endpoint List

### Authentication
- `POST /api/command/auth/login` - User login

### Production Module
**Query Endpoints:**
- `GET /api/query/production/orders` - Get production orders
- `GET /api/query/production/outputs` - Get machine outputs  
- `GET /api/query/production/stock-wip` - Get WIP stock

**Command Endpoints:**
- `POST /api/command/production/orders` - Create production order
- `POST /api/command/production/outputs` - Create machine output

### Quality Control Module
**Query Endpoints:**
- `GET /api/query/quality-control/oqc-records` - Get OQC records
- `GET /api/query/quality-control/transfers` - Get QC transfers
- `GET /api/query/quality-control/stock-wip` - Get WIP stock
- `GET /api/query/quality-control/stock-fg` - Get finished goods stock

**Command Endpoints:**
- `POST /api/command/quality-control/oqc` - Create OQC record
- `POST /api/command/quality-control/transfer` - Create QC transfer

### Warehouse Module
**Query Endpoints:**
- `GET /api/query/warehouse/deliveries` - Get deliveries
- `GET /api/query/warehouse/returns` - Get customer returns
- `GET /api/query/warehouse/stock-fg` - Get finished goods stock

**Command Endpoints:**
- `POST /api/command/warehouse/delivery` - Create delivery
- `POST /api/command/warehouse/returns` - Create customer return

### User Management Module
**Query Endpoints:**
- `GET /api/query/users/users` - Get all users
- `GET /api/query/users/logs` - Get user logs

### Historical Stock Module
**Query Endpoints:**
- `GET /api/query/historical-stock/stock-takes` - Get stock takes
- `GET /api/query/historical-stock/adjustments` - Get stock adjustments

### Master Product Module
**Query Endpoints:**
- `GET /api/query/master-product/` - Get all master products

## Android Implementation Constants

```kotlin
object ApiConstants {
    const val QUERY_BASE_URL = "http://your-server:8000"
    const val COMMAND_BASE_URL = "http://your-server:3001"
    
    // Authentication
    const val LOGIN = "/api/command/auth/login"
    
    // Production
    const val PRODUCTION_ORDERS_QUERY = "/api/query/production/orders"
    const val PRODUCTION_OUTPUTS_QUERY = "/api/query/production/outputs"
    const val PRODUCTION_WIP_QUERY = "/api/query/production/stock-wip"
    const val PRODUCTION_ORDERS_COMMAND = "/api/command/production/orders"
    const val PRODUCTION_OUTPUTS_COMMAND = "/api/command/production/outputs"
    
    // Quality Control
    const val QC_OQC_QUERY = "/api/query/quality-control/oqc-records"
    const val QC_TRANSFERS_QUERY = "/api/query/quality-control/transfers"
    const val QC_WIP_QUERY = "/api/query/quality-control/stock-wip"
    const val QC_FG_QUERY = "/api/query/quality-control/stock-fg"
    const val QC_OQC_COMMAND = "/api/command/quality-control/oqc"
    const val QC_TRANSFER_COMMAND = "/api/command/quality-control/transfer"
    
    // Warehouse
    const val WAREHOUSE_DELIVERIES_QUERY = "/api/query/warehouse/deliveries"
    const val WAREHOUSE_RETURNS_QUERY = "/api/query/warehouse/returns"
    const val WAREHOUSE_FG_QUERY = "/api/query/warehouse/stock-fg"
    const val WAREHOUSE_DELIVERY_COMMAND = "/api/command/warehouse/delivery"
    const val WAREHOUSE_RETURNS_COMMAND = "/api/command/warehouse/returns"
    
    // User Management
    const val USERS_QUERY = "/api/query/users/users"
    const val USER_LOGS_QUERY = "/api/query/users/logs"
    
    // Historical Stock
    const val STOCK_TAKES_QUERY = "/api/query/historical-stock/stock-takes"
    const val STOCK_ADJUSTMENTS_QUERY = "/api/query/historical-stock/adjustments"
    
    // Master Product
    const val MASTER_PRODUCTS_QUERY = "/api/query/master-product/"
}
```

## Server Configuration Summary

The backend system runs on two ports:
- **Port 8000**: FastAPI Query Service (GET operations)
- **Port 3001**: Node.js Command Service (POST operations)

Both services require JWT authentication except for the login endpoint.