const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING(100) },
    role: { type: DataTypes.ENUM('production', 'quality', 'warehouse'), allowNull: false }
}, { tableName: 'users', createdAt: 'created_at', updatedAt: true });

module.exports = User;
