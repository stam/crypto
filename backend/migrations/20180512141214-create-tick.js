'use strict';
export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tick', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.STRING
      },
      ask: {
        type: Sequelize.INTEGER
      },
      bid: {
        type: Sequelize.INTEGER
      },
      last: {
        type: Sequelize.INTEGER
      },
      volume: {
        type: Sequelize.INTEGER
      },
      main_volume: {
        type: Sequelize.BIGINT
      },
      timestamp: {
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tick');
  }
};
