'use strict';
const {
  Model
} = require('sequelize');

const Clientes = require('./clientes.js');
module.exports = (sequelize, DataTypes) => {
  class Expenses extends Model {
    static associate(models) {
      this.belongsTo(models.Clientes);
    }
  }
  Expenses.init({
    description: DataTypes.STRING,
    value: DataTypes.FLOAT,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Expenses'
  });
  return Expenses;
};