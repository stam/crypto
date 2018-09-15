import { values } from 'lodash';

import Tick from '../../models/tick';
import BaseStrategy from '../base';
import Market from '../../market';
import Indicator from '../../indicator';
import Asset from '../base/asset';

class EmaStrategy extends BaseStrategy {
  indicators: { [key: string]: Indicator } = {};
  assets: Asset[] = [];

  constructor(market: Market) {
    super(market);

    this.addIndicator('EMA', 7);
    this.addIndicator('EMA', 14);
  }

  addIndicator(name: string, period: number) {
    const indicator = new Indicator(name, period);
    this.indicators[`${name}${period}`] = indicator;
  }

  updateIndicators(tick: Tick) {
    const promises = values(this.indicators).map(indicator => indicator.handleTick(tick));
    return Promise.all(promises);
  }

  async handleTick(tick: Tick) {
    await this.updateIndicators(tick);

    const emaShort = this.indicators.EMA7;
    const emaLong = this.indicators.EMA14;

    if (emaShort.result === null || emaLong.result === null) {
      return;
    }

    if (emaShort.result > emaLong.result) {
      this.signalBuy(tick);
    } else if (emaShort.result < emaLong.result) {
      this.signalSell(tick);
    }
  }

  // Buy if we have no crypto
  signalBuy(tick: Tick) {
    if (this.assets.length === 0) {
      this.market.buy(tick, this.quantity);
      const asset = new Asset(tick.last, 1);
      this.assets.push(asset);
    }
  }

  signalSell(tick: Tick) {
    // Shallow clone because deleting items while iterating is bad
    const assets = [...this.assets];

    assets.forEach((asset) => {
      this.market.sell(tick, asset.quantity);
      // Remove it from the OG array, not from the clone
      const index = this.assets.indexOf(asset);
      this.assets.splice(index, 1);
    });
  }
}

export default EmaStrategy;
