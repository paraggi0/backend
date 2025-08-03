# PT. Topline Evergreen Manufacturing - Backend API Documentation

## Workflow System Management

Backend API yang komprehensif untuk sistem manajemen manufaktur PT. Topline Evergreen. Sistem ini mendukung workflow lengkap dari input produksi via mobile Android hingga manajemen admin via website.

## Arsitektur Sistem

### 1. **Index Dashboard** (`/api/dashboard/index`)
- Menampilkan overview semua data real-time
- Stock WIP, FG, Material, Component
- Status mesin running
- Schedule delivery

### 2. **Department Dashboards**
- **Production**: `/api/dashboard/production`
- **Warehouse**: `/api/dashboard/warehouse` 
- **Quality**: `/api/dashboard/quality`
- **Planning**: `/api/dashboard/planning`

### 3. **Mobile Android Integration**
- QR Code scanning untuk input data
- Lot number tracking
- Production output input
- Stock registration

### 4. **Website Admin Interface**
- Full CRUD operations
- Real-time monitoring
- CSV export functionality
- Inventory control

## API Endpoints

### Dashboard & Monitoring

```bash
# Index Dashboard - Overview semua data
GET /api/dashboard/index

# Department-specific dashboards
GET /api/dashboard/production
GET /api/dashboard/warehouse
GET /api/dashboard/quality
GET /api/dashboard/planning
GET /api/dashboard/management

# Real-time stock data
GET /api/dashboard/stock/wip
GET /api/dashboard/stock/fg
GET /api/dashboard/stock/material

# Machine status real-time
GET /api/dashboard/machine/status

# Schedule delivery
GET /api/dashboard/schedule/delivery
```

### QR Code Operations (Mobile)

```bash
# Generate QR Code
POST /api/qr/generate
{
  "partnumber": "TL001",
  "customer": "HONDA",
  "lotnumber": "LOT20250803001",
  "type": "PRODUCTION"
}

# Validate QR Code
POST /api/qr/validate
{
  "qr_string": "{...}"
}

# Register stock via QR scan
POST /api/qr/register-stock
{
  "qr_string": "{...}",
  "quantity": 100,
  "location": "WAREHOUSE",
  "operator": "OPERATOR01",
  "stock_type": "WIP"
}

# Input production via QR scan
POST /api/qr/input-production
{
  "qr_string": "{...}",
  "quantity": 95,
  "quantity_ng": 5,
  "machine": "MC001",
  "operator": "OPERATOR01",
  "shift": "1"
}

# Get QR history by lot number
GET /api/qr/history/{lotnumber}

# Bulk generate QR codes
POST /api/qr/bulk-generate
{
  "partnumber": "TL001",
  "customer": "HONDA",
  "lot_prefix": "BATCH_A",
  "quantity": 50
}
```

### Admin CRUD Operations

```bash
# Bill of Material
POST /api/admin/bom
PUT /api/admin/bom/{partnumber}/{customer}
DELETE /api/admin/bom/{partnumber}/{customer}

# Production Output
PUT /api/admin/outputmc/{id}
DELETE /api/admin/outputmc/{id}

# Schedule Management
POST /api/admin/schedule
PUT /api/admin/schedule/{id}
DELETE /api/admin/schedule/{id}

# Machine Management
POST /api/admin/machine
PUT /api/admin/machine/{machineId}

# Material & Component
PUT /api/admin/material/{id}
PUT /api/admin/component/{id}

# Inventory Control (Admin Only)
PUT /api/admin/inventory/wip/{id}
PUT /api/admin/inventory/fg/{id}

# Bulk Operations
POST /api/admin/bulk/delete
POST /api/admin/bulk/update
```

### CSV Export (Admin)

```bash
# Available export types
GET /api/export/types

# CSV Downloads
GET /api/export/csv/bom
GET /api/export/csv/production?start_date=2025-01-01&end_date=2025-12-31
GET /api/export/csv/wip
GET /api/export/csv/fg
GET /api/export/csv/material
GET /api/export/csv/component
GET /api/export/csv/schedule
GET /api/export/csv/machine

# Export info (tanpa download)
GET /api/export/info/bom
GET /api/export/info/production

# Custom export
POST /api/export/csv/custom
{
  "query": "SELECT * FROM outputmc WHERE DATE(created_at) = DATE('now')",
  "filename": "Today_Production"
}
```

### Dropdown Data untuk Frontend

```bash
# Customer list
GET /api/dashboard/dropdown/customers

# Part numbers by customer (cascading dropdown)
GET /api/dashboard/dropdown/partnumbers/{customer}

# Machine list
GET /api/dashboard/dropdown/machines

# Operator list
GET /api/dashboard/dropdown/operators
```

## Authentication

Semua endpoint memerlukan API key di header:

```bash
# Mobile Android
x-api-key: mobile-android-2025

# Website Admin
x-api-key: website-admin-2025

# Production API
x-api-key: production-api-2025
```

## Database Schema Support

Backend mendukung tabel-tabel berikut:

### Core Tables
- `billofmaterial` - Master part numbers
- `outputmc` - Production output records
- `wip` - Work in Progress stock
- `fg` - Finished Goods stock
- `material` - Material inventory
- `component` - Component inventory
- `schedule` - Delivery schedules
- `machine_status` - Real-time machine status

### Tracking Tables
- `stock_transactions` - Audit trail untuk semua transaksi stock
- `inventory_adjustments` - Log adjustment stock oleh admin

## Key Features

### 1. **Real-time Stock Management**
- Live stock levels dengan minimum stock alerts
- Automatic stock status calculation (LOW/WARNING/NORMAL)
- Integration dengan schedule delivery untuk minimum stock

### 2. **QR Code Integration**
- Generate QR codes untuk lot tracking
- Scan QR untuk input data mobile
- Complete audit trail per lot number
- Bulk QR generation untuk batch production

### 3. **Production Workflow**
- Mobile input → Backend validation → Database update
- Automatic WIP consumption saat production
- Quality tracking (good vs NG quantities)
- Machine efficiency calculation

### 4. **Admin Control**
- Full CRUD operations untuk semua data
- Inventory adjustment dengan audit trail
- Bulk operations untuk efficiency
- CSV export untuk reporting

### 5. **Dashboard Intelligence**
- Department-specific KPIs
- Real-time alerts dan notifications
- Production vs schedule tracking
- Quality metrics dan efficiency reports

## Usage Examples

### Workflow Mobile Android

1. **Scan QR Code**
   ```bash
   POST /api/qr/validate
   ```

2. **Input Production**
   ```bash
   POST /api/qr/input-production
   ```

3. **Register Stock**
   ```bash
   POST /api/qr/register-stock
   ```

### Workflow Website Admin

1. **View Dashboard**
   ```bash
   GET /api/dashboard/production
   ```

2. **Update Production Record**
   ```bash
   PUT /api/admin/outputmc/123
   ```

3. **Export Report**
   ```bash
   GET /api/export/csv/production
   ```

4. **Adjust Inventory**
   ```bash
   PUT /api/admin/inventory/wip/456
   ```

## Error Handling

Semua endpoint menggunakan standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Response format:
```json
{
  "success": true/false,
  "message": "Descriptive message",
  "data": {...},
  "error": "Error details if failed"
}
```

## Security Features

- API key authentication untuk semua endpoints
- Input validation dan sanitization
- SQL injection protection
- Rate limiting
- Audit trails untuk sensitive operations

Backend ini dirancang untuk mendukung workflow lengkap sistem manajemen manufaktur dengan fokus pada real-time monitoring, mobile integration, dan admin control yang komprehensif.
