# Crypto
Playground for testing crypto trading bots

## Getting started:

```
node_modules/.bin/sequelize db:migrate
```

## Generating migrations

Sequelize doesn't have auto migrations and the packages for it are unmaintained.
It recommends generating models and their migrations through the cli:

```
node_modules/.bin/sequelize model:generate --name Tock --attributes symbol:string,ask:integer,bid:integer,last:integer,volume:integer,main_volume:bigint,timestamp:date
```
