# Crypto
Playground for testing crypto trading bots.
Comes with 5 months of market data from HitBTC with 1 minute resolution.

This data can be used to test strategies of Crypto trading bots.
This codebase contains some very basic strategies, which can be visualized and backtested in the included react app.

![React frontend](/screenshot.png?raw=true "React frontend")

## Getting started:
The default configuration uses an sqlite database.
To use PostgreSQL, update the .env

Bootstrapping the database and running the backend:
```
cp .env.example .env
cd backend
yarn
yarn typeorm migration:run
sqlite3 database.sqlite ".mode csv" ".import ../tick_2018_08_25.csv tick"
yarn create-candles
yarn start
```

Running the frontend:

```
cd ../frontend
yarn && yarn start
```

## Structure

A simulation is started with a set of market data and a Strategy type.

The simulation creates the strategy instance and supplies it with a market interface. 

The simulation then feeds the ticks into the strategy.
The strategy handles the ticks and determines the buy/sell signals.
To generate those signals it can feed the ticks into indicators and compare the values.

When the strategy encounters a signal, tells the market to create an order, depending on the amount of held stocks the strategy wants.



