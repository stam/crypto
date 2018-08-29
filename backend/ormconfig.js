require('dotenv').config();

module.exports =
{
  "type": process.env.DB_TYPE,
  "host": process.env.DB_HOST,
  "port": process.env.DB_POST,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "synchronize": false,
  "logging": false,
  "entities": [
     "src/models/**/*.ts"
  ],
  "migrations": [
     "migrations/**/*.ts"
  ],
  "subscribers": [
     "src/subscribers/**/*.ts"
  ],
  "cli": {
     "entitiesDir": "src/models",
     "migrationsDir": "migrations",
     "subscribersDir": "src/subscribers"
  }
}
