import { each, round } from 'lodash';
import Asset from './asset';
import Market from '../market';

// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class BaseStrategy {
  quantity: number;
  assets: Asset[];
  market: Market;

  constructor(market: Market) {
    // To be refactored to currency
    // It currently represents the amount of assets we can buy
    this.quantity = 1;

    this.assets = [];
    this.market = market;
    market.Asset = this.Asset;
    market.onAssetSell = this.handleAssetSell.bind(this);
  }

  get Asset() {
    return Asset;
  }

  handleTick(tick) {
    const value = round(tick.last / 100);

    const shouldBuy = this.determineBuy(value);
    if (shouldBuy) {
      this.signalBuy(tick);
    }

    each(this.assets, asset => asset.handleTick(tick));
  }

  determineBuy(value: number) {
    return value <= 7000;
  }

  // Buy if we have no active order
  signalBuy(tick) {
    if (this.quantity > 0) {
      this.buyAsset(tick, this.quantity);
    }
  }

  buyAsset(tick: any, quantity: number) {
    this.quantity -= quantity;

    const asset = this.market.buy(tick, quantity);

    this.assets.push(asset);
  }

  handleAssetSell(asset: Asset) {
    // Remove asset from this.assets
    const index = this.assets.indexOf(asset);
    if (index > -1) {
      this.assets.splice(index, 1);
    }

    this.quantity = 1;
  }
}

export default BaseStrategy;
