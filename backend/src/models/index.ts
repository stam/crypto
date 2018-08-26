'use strict';

import Sequelize from 'sequelize';
import config from '../../config';

import tick from './tick';
import candle from './candle';

interface Database {
  tick: any;
  candle: any;
  sequelize: any;
}

const { development: env } = config;
const sequelize = new Sequelize(env.database, env.username, env.password, env);
const db: Database = {
  tick,
  candle,
  sequelize,
};

/*
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
//   })
//   .forEach(file => {
//     const model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;*/

export default db;
