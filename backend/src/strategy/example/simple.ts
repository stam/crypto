import { round } from 'lodash';
import Tick from '../../models/tick';
import BaseStrategy from '../base';

// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class SimpleStrategy extends BaseStrategy {
  handleTick(tick: Tick) {
    const value = Math.round(tick.last / 100);

    if (value <= 7000) {
      this.signalBuy(tick);
    }

    if (value >= 9500) {
      this.signalSell(tick);
    }
  }

  // Buy if we have no crypto
  signalBuy(tick: Tick) {
    const hasFunds = this.market.accountFiat >= tick.last;
    if (!this.market.unfullfilledOrders.length && hasFunds) {
      this.market.buy(tick.last, 1);
    }
  }

  signalSell(tick: Tick) {
    if (!this.market.unfullfilledOrders.length && this.market.accountValue >= 1) {
      this.market.sell(tick.last, 1);
    }
  }
}

export default SimpleStrategy;
