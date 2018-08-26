import Sequelize from 'sequelize';

export default(sequelize) => {
  const Tick = sequelize.define(
    'tick',
    {
      symbol: Sequelize.STRING(25),
      ask: Sequelize.INTEGER,
      bid: Sequelize.INTEGER,
      last: Sequelize.INTEGER,
      volume: Sequelize.INTEGER,
      main_volume: Sequelize.BIGINT,
      timestamp: Sequelize.DATE,
    },
    {
      timestamps: false,
      tableName: 'tick',
    }
  );

  return Tick;
}
