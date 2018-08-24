// const db = require('../models');
// const Strategy = require('../strategy');
const _ = require('lodash');
const AssetInterface = require('../asset/interface');

class Trade {
  constructor(asset) {
    this.costBasis = asset.cost;
  }

  sell(value) {
    this.marketValue = value;
    this.result = _.round(100 * value / this.costBasis, 1);
  }
}

class Simulation {
  constructor({ ticks, Strategy }) {
    this.ticks = ticks;

    this.assetInterface = new AssetInterface({
      createOrder: this.handleOrder.bind(this),
    })

    this.trades = {};
    this.orders = [];
    this.strategy = new Strategy(this.assetInterface);
  }

  run() {
    _.each(this.ticks, (tick) => {
      this.strategy.handleTick(tick);
    });

    this.trades = Object.values(this.trades);
  }

  handleOrder({ price, type, asset }) {
    console.info(`> Creating ${type} order: quantity ${asset.quantity}, price: ${price}`)
    const now = new Date();

    const order = {
      timestamp: now.toISOString(),
      quantity: asset.quantity,
      price,
      type,
    };

    this.orders.push(order);

    if (type === 'buy') {
      const trade = new Trade(asset);
      this.trades[asset.id] = trade;
    } else {
      const trade = this.trades[asset.id];
      trade.sell(price);

    }
    return order;
  }
}

module.exports = Simulation;
