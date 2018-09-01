import { round } from 'lodash';
import Market from '../../market';
import Tick from '../../models/tick';

// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class BaseStrategy {
  quantity: number;
  market: Market;

  constructor(market: Market) {
    // Amount of crypto we have
    this.quantity = 0;

    this.market = market;
  }

  handleTick(tick: Tick) {
    const value = round(tick.last / 100);

    if (value <= 7000) {
      this.signalBuy(tick);
    }

    if (value >= 9500) {
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

export default BaseStrategy;
