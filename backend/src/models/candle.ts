'use strict';

import Sequelize from 'sequelize';

export default (sequelize) => {
  var candle = sequelize.define('candle', { timespan: Sequelize.STRING, open: Sequelize.INTEGER, close: Sequelize.INTEGER, high: Sequelize.INTEGER, low: Sequelize.INTEGER, datetime: Sequelize.DATE }, { tableName: 'candle' });
  candle.associate = function(models) {
    // associations can be defined here
  };
  return candle;
};
