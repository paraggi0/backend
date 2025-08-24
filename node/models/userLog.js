const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserLog = sequelize.define('UserLog', {
    id_user: { type: DataTypes.INTEGER, primaryKey: true, references: { model: 'users', key: 'id' } },
    email: { type: DataTypes.STRING(50), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    logs_status: { type: DataTypes.TEXT }
}, { tableName: 'user_log', timestamps: true });

module.exports = UserLog;
