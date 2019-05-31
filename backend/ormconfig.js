require('dotenv').config();

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    type: 'sqlite',
    database: 'test.sqlite',
    logging: false,
    synchronize: true,
    entities: ['src/models/**/*.ts'],
    migrations: ['migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
  };
} else {
  module.exports = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_POST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['src/models/**/*.ts'],
    migrations: ['migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'migrations',
      subscribersDir: 'src/subscribers',
    },
}

};
