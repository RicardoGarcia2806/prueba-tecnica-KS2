const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const House = sequelize.define('House', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('disponible', 'vendido'),
    defaultValue: 'disponible',
  },
}, {
  timestamps: true,
});

module.exports = House;
