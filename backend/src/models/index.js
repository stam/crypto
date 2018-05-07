const Sequelize = require('sequelize');

const db = {};
const sequelize = new Sequelize('postgres', 'postgres', '', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const Tick = sequelize.define('tick', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    symbol: Sequelize.STRING(25),
    ask: Sequelize.INTEGER,
    bid: Sequelize.INTEGER,
    last: Sequelize.INTEGER,
    volume: Sequelize.INTEGER,
    main_volume: Sequelize.BIGINT,
    timestamp: Sequelize.DATE,
}, {
    timestamps: false,
    tableName: 'tick',
});

db.Tick = Tick;
db.sequelize = sequelize;

module.exports = db;