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

  handleTick(tick: Tick) {}
}

export default BaseStrategy;
