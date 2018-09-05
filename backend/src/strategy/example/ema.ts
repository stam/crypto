import { round, reduce } from 'lodash';

import Tick from '../../models/tick';
import BaseStrategy from '../base';
import Market from '../../market';
import Indicator from '../../indicator';

// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class EmaStrategy extends BaseStrategy {
  indicators: Indicator[] = [];

  constructor(market: Market) {
    super(market);

    this.addIndicator('EMA', 5);
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
    const value = round(tick.last / 100);

    const emaIndicator = this.indicators[0];
    if (emaIndicator.result && tick.last < emaIndicator.result) {
      this.signalBuy(tick);
    }

    if (value > 8400) {
      this.signalSell(tick);
    }
  }

  // Buy if we have no crypto
  signalBuy(tick: Tick) {
    if (this.quantity === 0) {
      this.market.buy(tick, this.quantity);
      this.quantity = 1;
    }
  }

  signalSell(tick: Tick) {
    if (this.quantity === 1) {
      this.market.sell(tick, this.quantity);
      this.quantity = 0;
    }
  }
}

export default EmaStrategy;
