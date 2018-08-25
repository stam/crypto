const _ = require('lodash');


// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class BaseStrategy {
  constructor(market) {
    // To be refactored to currency
    // It currently represents the amount of assets we can buy
    this.quantity = 1;

    this.assets = [];
    this.market = market;
    market.onAssetSell = this.handleAssetSell.bind(this);
  }

  handleTick(tick) {
    const value = parseInt(tick.get('last') / 100);
    if (value <= 7000) {
      this.signalBuy(tick);
    }

    _.each(this.assets, asset => asset.handleTick(tick));
  }

  // Buy if we have no active order
  signalBuy(tick) {
    if (this.quantity > 0) {
      this.activeOrder = this.buyAsset(tick, this.quantity);
    }
  }

  buyAsset(tick, quantity) {
    this.quantity -= quantity;

    const asset = this.market.buy({
      price: tick.get('last'),
      quantity,
    });

    this.assets.push(asset);
  }

  // createAsset(buyTick, quantity) {
  //   const handleSell = (sellTick) => {
  //     this.handleAssetSell(asset, sellTick);
  //   };

  //   // Make sure the asset sell is handled in the strategy
  //   // to fix orders and asset management
  //   const asset = new Asset(buyTick, quantity, handleSell);
  //   this.assets.push(asset);
  // }

  handleAssetSell(asset) {
    // Remove asset from this.assets
    const index = this.assets.indexOf(asset);
    if (index > -1) {
      this.assets.splice(index, 1);
    }
  }
}

module.exports = BaseStrategy;
