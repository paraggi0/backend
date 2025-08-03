# Setup Konfigurasi Cascading Dropdown System
# PT. Topline Evergreen Manufacturing

## 1. Database Setup

### Langkah 1: Pastikan Database Connection
```bash
cd backend
node quick-test-db.js
```

### Langkah 2: Setup WIP Table dengan Customer Column
```bash
node setup-wip-customer.js
```

### Langkah 3: Verifikasi Data BOM
```sql
-- Cek jumlah customers dalam BOM
SELECT COUNT(DISTINCT customer) as total_customers FROM billofmaterial;

-- Cek sample data BOM
SELECT customer, partnumber, model, description FROM billofmaterial LIMIT 10;

-- Cek struktur tabel WIP
DESCRIBE wip;
```

## 2. Backend Configuration

### File: `backend/.env`
```env
# Database Configuration
DB_HOST=34.101.128.165
DB_PORT=3306
DB_NAME=topline_manufacturing
DB_USER=Bangor
DB_PASSWORD=Bangor0802
DB_CONNECTION_NAME=robotic-charmer-465708-h3:asia-southeast2:topline-db

# Server Configuration
PORT=3001
NODE_ENV=development

# Cache Control Headers
CACHE_CONTROL=no-cache, no-store, must-revalidate
```

### API Endpoints Configuration:
- `GET /api/website/bom/customers` - Dropdown customers
- `GET /api/website/bom/descriptions/:customer` - Dropdown descriptions by customer
- `GET /api/website/bom/parts/:customer/:description` - Auto-fill parts data
- `GET /api/website/wip` - WIP data dengan customer column
- `POST /api/website/wip` - Create WIP dengan customer
- `PUT /api/website/wip/:id` - Update WIP
- `DELETE /api/website/wip/:id` - Delete WIP

## 3. Frontend Configuration

### File: `frontend/pages/produksi/invwip.html`
```html
<!-- Updated to use invwip-new.js -->
<script src="../../assets/js/js-produksi/invwip-new.js"></script>
```

### JavaScript Configuration:
- **Real-time Data Fetching**: Tidak ada caching
- **Cache-busting**: Timestamp di setiap request
- **Error Handling**: Fallback untuk connection issues
- **Fresh Data**: Setiap dropdown selection fetch dari database

## 4. Database Schema

### Tabel `billofmaterial`:
```sql
CREATE TABLE billofmaterial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partnumber VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    description VARCHAR(200),
    customer VARCHAR(100),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer (customer),
    INDEX idx_partnumber (partnumber)
);
```

### Tabel `wip` (Updated):
```sql
ALTER TABLE wip ADD COLUMN customer VARCHAR(100) AFTER id;
ALTER TABLE wip ADD INDEX idx_customer (customer);
```

## 5. Deployment Steps

### Step 1: Database Setup
```bash
# Test connection
cd backend
node quick-test-db.js

# Setup tables and data
node setup-wip-customer.js
```

### Step 2: Backend Server
```bash
# Start backend server
cd backend
node server.js
# Server akan running di http://localhost:3001
```

### Step 3: Frontend Server
```bash
# Start frontend server
cd frontend
npx http-server -p 8080 -c-1
# Frontend akan running di http://localhost:8080
```

### Step 4: Verification
```bash
# Test API endpoints
curl http://localhost:3001/api/website/bom/customers
curl http://localhost:3001/api/website/wip

# Open frontend
# http://localhost:8080/pages/produksi/invwip.html
```

## 6. Configuration Files

### Backend Dependencies (`package.json`):
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcrypt": "^5.1.0"
  }
}
```

### Environment Variables:
- `DB_HOST` - Database host IP
- `DB_PORT` - Database port (3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `PORT` - Backend server port (3001)

## 7. Troubleshooting

### Database Connection Issues:
```bash
# Check IP dan port
ping 34.101.128.165

# Test connection
node -e "const { pool } = require('./config/database'); pool.execute('SELECT 1').then(() => console.log('OK')).catch(console.error);"
```

### Frontend Issues:
```javascript
// Check browser console untuk error messages
// Pastikan CORS enabled di backend
// Verify API endpoints response
```

## 8. Security Configuration

### CORS Settings:
```javascript
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
```

### Cache Control Headers:
```javascript
res.set({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
});
```

## 9. Performance Optimization

### Database Indexing:
```sql
-- Add indexes untuk performance
CREATE INDEX idx_bom_customer ON billofmaterial(customer);
CREATE INDEX idx_bom_description ON billofmaterial(customer, description);
CREATE INDEX idx_wip_customer ON wip(customer);
```

### Frontend Optimization:
- Cache-busting dengan timestamp
- Minimal DOM manipulation
- Async/await untuk database calls
- Error handling dengan user feedback

## 10. Monitoring dan Maintenance

### Log Files:
- Backend server logs di console
- Database connection status
- API response times
- Error tracking

### Regular Maintenance:
```bash
# Weekly database check
SELECT COUNT(*) FROM billofmaterial;
SELECT COUNT(*) FROM wip;

# Performance monitoring
SHOW PROCESSLIST;
EXPLAIN SELECT * FROM billofmaterial WHERE customer = 'TOYOTA';
```

## 11. Backup dan Recovery

### Database Backup:
```bash
mysqldump -h 34.101.128.165 -u Bangor -p topline_manufacturing > backup.sql
```

### Restore:
```bash
mysql -h 34.101.128.165 -u Bangor -p topline_manufacturing < backup.sql
```

---

**Status: ✅ READY FOR PRODUCTION**

Sistem cascading dropdown sudah siap dengan:
- ✅ Real-time database integration
- ✅ No caching system
- ✅ Complete API endpoints
- ✅ Error handling
- ✅ Performance optimization
- ✅ Security configuration
