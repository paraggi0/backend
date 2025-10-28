const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const models = {
    User: require('./user'),
    UserLog: require('./userLog'),
    ProductionOrder: require('./productionOrder'),
    OutputMc: require('./outputMc'),
    TransferQc: require('./transferQc'),
    OQC: require('./oqc'),
    Delivery: require('./delivery'),
    Return: require('./return'),
};

// Definisikan asosiasi antar tabel di sini
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
