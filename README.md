# Crypto
Playground for testing crypto trading bots.
Comes with 5 months of market data from HitBTC with 1 minute resolution.

This data can be used to test strategies of Crypto trading bots.
This codebase contains some very basic strategies, which can be visualized and backtested in the included react app.

## Getting started:
The default configuration uses an sqlite database.
To use PostgreSQL, update the .env

```
cp .env.example .env
cd backend
node_modules/.bin/sequelize db:migrate
sqlite3 database.sqlite ".mode csv" ".import ../tick_2018_08_25.csv tick"
yarn && yarn create-candles
yarn start
```

Running the frontend:

```
cd ../frontend
yarn && yarn start
```

