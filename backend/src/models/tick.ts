export default(sequelize, DataTypes) => {
  const Tick = sequelize.define(
    'tick',
    {
      symbol: DataTypes.STRING(25),
      ask: DataTypes.INTEGER,
      bid: DataTypes.INTEGER,
      last: DataTypes.INTEGER,
      volume: DataTypes.INTEGER,
      main_volume: DataTypes.BIGINT,
      timestamp: DataTypes.DATE,
    },
    {
      timestamps: false,
      tableName: 'tick',
    }
  );

  return Tick;
}
