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

const associate = (Model: any) => {
  return Model(sequelize);
}

const { development: env } = config;
const sequelize = new Sequelize(env.database, env.username, env.password, env);
const db: Database = {
  tick: associate(tick),
  candle: associate(candle),
  sequelize,
};

export default db;
