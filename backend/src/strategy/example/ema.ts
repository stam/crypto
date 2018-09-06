import { round, reduce } from 'lodash';

import Tick from '../../models/tick';
import BaseStrategy from '../base';
import Market from '../../market';
import Indicator from '../../indicator';
import Asset from '../base/asset';

// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class EmaStrategy extends BaseStrategy {
  indicators: Indicator[] = [];
  assets: Asset[] = [];

  constructor(market: Market) {
    super(market);

    this.addIndicator('EMA', 15);
  }

  addIndicator(name: string, period: number) {
    const indicator = new Indicator(name, period);
    this.indicators.push(indicator)
  }

  updateIndicators(tick: Tick) {
    const promises = this.indicators.map(indicator => indicator.handleTick(tick));
    return Promise.all(promises);
  }

  async handleTick(tick: Tick) {
    await this.updateIndicators(tick);

    const emaIndicator = this.indicators[0];

    if (emaIndicator.result && tick.last < emaIndicator.result) {
      this.signalBuy(tick);
    }

    // Shallow clone because deleting items while iterating is bad
    const assets = [...this.assets];
    assets.forEach((asset) => {
      // const value = round(price / 100);
      if ((tick.last / asset.cost) > 1.05) {
        this.market.sell(tick, asset.quantity);
        // Remove it from the OG array, not from the clone
        const index = this.assets.indexOf(asset);
        this.assets.splice(index, 1);
      }
    });
  }

  // Buy if we have no crypto
  signalBuy(tick: Tick) {
    if (this.assets.length === 0) {
      this.market.buy(tick, this.quantity);
      const asset = new Asset(tick.last, 1);
      this.assets.push(asset);
    }
  }

  // signalSell(tick: Tick) {
  //   if (this.assets.length === 0) {
  //     this.market.sell(tick, this.quantity);
  //     this.quantity = 0;
  //   }
  // }
}

export default EmaStrategy;
