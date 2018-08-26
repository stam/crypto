'use strict';
export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('candle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timespan: {
        type: Sequelize.STRING
      },
      open: {
        type: Sequelize.INTEGER
      },
      close: {
        type: Sequelize.INTEGER
      },
      high: {
        type: Sequelize.INTEGER
      },
      low: {
        type: Sequelize.INTEGER
      },
      datetime: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('candles');
  }
};
