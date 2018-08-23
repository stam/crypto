const _ = require('lodash');

class Asset {
  constructor(buyTick, quantity) {
    this.costBasis = buyTick;
    this.quantity = quantity;
    console.log('create Asset', buyTick.get('id'), quantity);
  }

  handleTick(tick, value) {
    if (value >= 9500) {
      this.handleSell(tick);
    }
  }

  handleSell() {
    // should be implemented by its strategy
    // for now we can only sell the asset in its entirety
  }
}

// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class Strategy {
  constructor() {
    // To be refactored to currency
    // It currently represents the amount of assets we can buy
    this.quantity = 1;

    this.assets = [];
    this.orders = [];
  }

  handleTick(tick) {
    const value = parseInt(tick.get('last') / 100);
    if (value <= 7000) {
      this.signalBuy(tick);
    }

    _.each(this.assets, asset => asset.handleTick(tick, value));
  }

  // Buy if we have no active order
  signalBuy(tick) {
    if (this.quantity > 0) {
      this.activeOrder = this.buyAsset(tick, this.quantity);
    }
  }

  // Sell if we have an active order
  signalSell(tick) {
    if (this.activeOrder !== null) {
      this.createOrder(tick, 'sell');
      this.activeOrder = null;
    }
  }

  //
  buyAsset(tick, quantity) {
    this.quantity -= quantity;

    this.createAsset(tick, quantity);
    this.createOrder(tick, 'buy', quantity);
  }

  createAsset(buyTick, quantity) {
    const asset = new Asset(buyTick, quantity);

    // Make sure the asset sell is handled in the strategy
    // to fix orders and asset management
    asset.handleSell = (sellTick) => {
      this.handleAssetSell(asset, sellTick);
    }
    this.assets.push(asset);
  }

  handleAssetSell(asset, sellTick) {
    // Remove asset from this.assets
    const index = this.assets.indexOf(asset);
    if (index > -1) {
      this.assets.splice(index, 1);
    }

    this.createOrder(sellTick, 'sell', asset.quantity);
  }

  createOrder(tick, type, quantity) {
    console.log(`> Creating ${type} order: quantity ${quantity}, price: ${tick.get('last')}`)
    const order = {
      type,
      timestamp: tick.get('timestamp'),
      price: tick.get('last'),
      quantity,
    };
    this.orders.push(order);
    return order;
  }
}

module.exports = Strategy;
