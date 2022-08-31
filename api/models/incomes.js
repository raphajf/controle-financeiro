'use strict';
const {
  Model
} = require('sequelize');
const Clientes = require('./clientes.js');
module.exports = (sequelize, DataTypes) => {
  class Incomes extends Model {
    static associate(models) {
      this.belongsTo(models.Clientes);
    }
  }
  Incomes.init({
    description: DataTypes.STRING,
    value: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Incomes'
  });
  return Incomes;
};