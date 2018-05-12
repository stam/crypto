module.exports = (sequelize, DataTypes) => {
    const Tick = sequelize.define(
        'tick',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
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