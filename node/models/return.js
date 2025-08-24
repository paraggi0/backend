const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Return = sequelize.define('Return', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    return_number: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    customer: { type: DataTypes.STRING(255), allowNull: false },
    part_number: { type: DataTypes.STRING(255), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(50), defaultValue: 'PENDING' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'returns', timestamps: true });

module.exports = Return;
