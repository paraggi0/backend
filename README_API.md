# Backend API Summary for Android Integration

## 📋 Ringkasan/Summary

Sistem backend ini memiliki dua layanan utama yang menggunakan arsitektur CQRS (Command Query Responsibility Segregation):

**This backend system has two main services using CQRS (Command Query Responsibility Segregation) architecture:**

### 🔍 Query Service (FastAPI) - Port 8000
- **Fungsi/Function**: Operasi baca data (GET requests)
- **Framework**: FastAPI (Python)
- **Base URL**: `http://your-server:8000`

### ✏️ Command Service (Node.js) - Port 3001  
- **Fungsi/Function**: Operasi tulis data (POST requests)
- **Framework**: Express.js (Node.js)
- **Base URL**: `http://your-server:3001`

## 🚀 Daftar Lengkap URL API / Complete API URL List

### Authentication
```
POST /api/command/auth/login - Login pengguna
```

### Production Module
```
# Query (Read)
GET /api/query/production/orders      - Daftar production orders
GET /api/query/production/outputs     - Data output mesin
GET /api/query/production/stock-wip   - Stock Work-in-Progress

# Command (Write)  
POST /api/command/production/orders   - Buat production order baru
POST /api/command/production/outputs  - Buat data output mesin baru
```

### Quality Control Module
```
# Query (Read)
GET /api/query/quality-control/oqc-records - Data OQC (Outgoing Quality Control)
GET /api/query/quality-control/transfers   - Data transfer QC
GET /api/query/quality-control/stock-wip   - Stock WIP dari perspektif QC
GET /api/query/quality-control/stock-fg    - Stock barang jadi dari perspektif QC

# Command (Write)
POST /api/command/quality-control/oqc      - Buat record OQC baru
POST /api/command/quality-control/transfer - Buat transfer QC baru
```

### Warehouse Module
```
# Query (Read)
GET /api/query/warehouse/deliveries  - Data pengiriman
GET /api/query/warehouse/returns     - Data retur customer
GET /api/query/warehouse/stock-fg    - Stock barang jadi

# Command (Write)
POST /api/command/warehouse/delivery - Buat pengiriman baru
POST /api/command/warehouse/returns  - Buat retur customer baru
```

### User Management Module
```
# Query (Read)
GET /api/query/users/users - Daftar semua pengguna
GET /api/query/users/logs  - Log aktivitas pengguna
```

### Historical Stock Module
```
# Query (Read)
GET /api/query/historical-stock/stock-takes   - Riwayat stock opname
GET /api/query/historical-stock/adjustments  - Riwayat penyesuaian stock
```

### Master Product Module
```
# Query (Read)
GET /api/query/master-product/ - Data master produk
```

## 🔐 Authentication

Semua endpoint kecuali login membutuhkan JWT token:
**All endpoints except login require JWT token:**

```
Authorization: Bearer <your-jwt-token>
```

### Login Flow:
1. POST ke `/api/command/auth/login` dengan username/password
2. Simpan JWT token yang diterima
3. Sertakan token di header Authorization untuk request selanjutnya

## 📱 Konfigurasi Android Constants

```kotlin
object ApiConstants {
    const val QUERY_BASE_URL = "http://your-server:8000/"
    const val COMMAND_BASE_URL = "http://your-server:3001/"
    
    // Authentication
    const val LOGIN = "/api/command/auth/login"
    
    // Production URLs
    const val PRODUCTION_ORDERS_QUERY = "/api/query/production/orders"
    const val PRODUCTION_ORDERS_COMMAND = "/api/command/production/orders"
    const val PRODUCTION_OUTPUTS_QUERY = "/api/query/production/outputs"
    const val PRODUCTION_OUTPUTS_COMMAND = "/api/command/production/outputs"
    const val PRODUCTION_WIP_QUERY = "/api/query/production/stock-wip"
    
    // Quality Control URLs
    const val QC_OQC_QUERY = "/api/query/quality-control/oqc-records"
    const val QC_OQC_COMMAND = "/api/command/quality-control/oqc"
    const val QC_TRANSFERS_QUERY = "/api/query/quality-control/transfers"
    const val QC_TRANSFER_COMMAND = "/api/command/quality-control/transfer"
    const val QC_WIP_QUERY = "/api/query/quality-control/stock-wip"
    const val QC_FG_QUERY = "/api/query/quality-control/stock-fg"
    
    // Warehouse URLs
    const val WAREHOUSE_DELIVERIES_QUERY = "/api/query/warehouse/deliveries"
    const val WAREHOUSE_DELIVERY_COMMAND = "/api/command/warehouse/delivery"
    const val WAREHOUSE_RETURNS_QUERY = "/api/query/warehouse/returns"
    const val WAREHOUSE_RETURNS_COMMAND = "/api/command/warehouse/returns"
    const val WAREHOUSE_FG_QUERY = "/api/query/warehouse/stock-fg"
    
    // Master Data URLs
    const val MASTER_PRODUCTS_QUERY = "/api/query/master-product/"
    const val USERS_QUERY = "/api/query/users/users"
    const val USER_LOGS_QUERY = "/api/query/users/logs"
    const val STOCK_TAKES_QUERY = "/api/query/historical-stock/stock-takes"
    const val STOCK_ADJUSTMENTS_QUERY = "/api/query/historical-stock/adjustments"
}
```

## 🧪 Testing API

### Menjalankan Demo API / Running Demo API:
```bash
cd /home/runner/work/backend/backend
python demo_api.py
```

Kemudian buka / Then open: `http://localhost:8000/docs` untuk Swagger UI

### Contoh Curl Commands:

**Login:**
```bash
curl -X POST http://your-server:3001/api/command/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

**Get Production Orders:**
```bash
curl -X GET "http://your-server:8000/api/query/production/orders?skip=0&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Production Order:**
```bash
curl -X POST http://your-server:3001/api/command/production/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderNumber": "PO-2024-001", "productId": 101, "quantity": 100}'
```

## 📊 Pagination

Kebanyakan endpoint query mendukung pagination:
**Most query endpoints support pagination:**

```
?skip=0&limit=20
```

- `skip`: Jumlah record yang dilewati / Number of records to skip
- `limit`: Maksimal record yang dikembalikan / Maximum records returned

## 🔧 Server Configuration

Berdasarkan file `ecosystem.config.js`:
**Based on `ecosystem.config.js` file:**

### Query Service (FastAPI):
```bash
./venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Command Service (Node.js):
```bash
cd node && node server.js
# Port: 3001 (from process.env.PORT || 3001)
```

### Environment Variables yang Diperlukan:
**Required Environment Variables:**
```
DB_NAME=database_name
DB_USER=database_username  
DB_PASSWORD=database_password
DB_HOST=database_host
DB_PORT=database_port
PORT=3001
```

## 📄 File Dokumentasi Tambahan / Additional Documentation Files

1. **`API_DOCUMENTATION.md`** - Dokumentasi lengkap dengan penjelasan detail setiap endpoint
2. **`API_URLS.md`** - Daftar cepat semua URL endpoint
3. **`ANDROID_INTEGRATION_EXAMPLE.md`** - Contoh lengkap implementasi di Android dengan Kotlin
4. **`demo_api.py`** - API demo yang bisa dijalankan untuk testing

## 🚀 Panduan Implementasi Android / Android Implementation Guide

### 1. Setup Retrofit:
```kotlin
// Buat dua instance Retrofit untuk query dan command service
val queryRetrofit = Retrofit.Builder()
    .baseUrl(ApiConstants.QUERY_BASE_URL)
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val commandRetrofit = Retrofit.Builder()
    .baseUrl(ApiConstants.COMMAND_BASE_URL)
    .addConverterFactory(GsonConverterFactory.create())
    .build()
```

### 2. Buat Interface API:
```kotlin
interface QueryApiService {
    @GET("api/query/production/orders")
    suspend fun getProductionOrders(
        @Header("Authorization") token: String,
        @Query("skip") skip: Int = 0,
        @Query("limit") limit: Int = 20
    ): Response<List<ProductionOrder>>
}

interface CommandApiService {
    @POST("api/command/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
}
```

### 3. Pattern CQRS:
- Gunakan **Query Service** untuk semua operasi READ (GET)
- Gunakan **Command Service** untuk semua operasi WRITE (POST/PUT/DELETE)

## ✅ Checklist untuk Developer Android

- [ ] Setup dua base URL yang berbeda (port 8000 dan 3001)
- [ ] Implementasi authentication dengan JWT token storage
- [ ] Buat interface terpisah untuk Query dan Command operations
- [ ] Handle pagination untuk endpoint yang mendukung
- [ ] Implementasi error handling untuk kedua service
- [ ] Test konektivitas ke kedua service
- [ ] Implementasi offline caching jika diperlukan
- [ ] Setup proper network security (HTTPS di production)

## 🔗 Useful Links

- **Swagger UI**: `http://your-server:8000/docs`
- **ReDoc**: `http://your-server:8000/redoc`
- **OpenAPI JSON**: `http://your-server:8000/openapi.json`

---

**Catatan**: Ganti `your-server` dengan IP address atau domain server yang sebenarnya.
**Note**: Replace `your-server` with the actual server IP address or domain.