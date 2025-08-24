const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: true, // Matikan logging SQL di console untuk produksi
        dialectOptions: {
            timezone: '+07:00', // Sesuaikan dengan timezone server Anda (WIB)
        },
        define: {
            timestamps: true // Nonaktifkan timestamps default Sequelize (createdAt, updatedAt)
        }
    }
);

module.exports = sequelize;
