require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import semua routes
const authRoutes = require('./routes/authRoutes');
const productionRoutes = require('./routes/productionRoutes');
const qcRoutes = require('./routes/qcRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Daftarkan semua routes dengan prefix yang sesuai
app.use('/api/command/auth', authRoutes);
app.use('/api/command/production', productionRoutes);
app.use('/api/command/quality-control', qcRoutes);
app.use('/api/command/warehouse', warehouseRoutes);

const PORT = process.env.PORT || 3001;

sequelize.authenticate()
    .then(() => {
        console.log('Koneksi database berhasil.');
        app.listen(PORT, () => console.log(`Command service berjalan di port ${PORT}`));
    })
    .catch(err => console.error('Gagal terhubung ke database:', err));
