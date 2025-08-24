const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OQC = sequelize.define('OQC', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    part_number: { type: DataTypes.STRING(100), allowNull: false },
    quantity_passed: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    inspection_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    inspector_id: { type: DataTypes.INTEGER },
    notes: { type: DataTypes.TEXT }
}, { tableName: 'oqc', timestamps: true });

module.exports = OQC;
