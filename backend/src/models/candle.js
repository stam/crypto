'use strict';
module.exports = (sequelize, DataTypes) => {
  var candle = sequelize.define('candle', { timespan: DataTypes.STRING, open: DataTypes.INTEGER, close: DataTypes.INTEGER, high: DataTypes.INTEGER, low: DataTypes.INTEGER, datetime: DataTypes.DATE }, { tableName: 'candle' });
  candle.associate = function(models) {
    // associations can be defined here
  };
  return candle;
};