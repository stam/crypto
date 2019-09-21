import { round } from 'lodash';
import Market from '../../market';
import Tick from '../../models/tick';

class BaseStrategy {
  market: Market;

  constructor(market: Market) {
    this.market = market;
    this.market.addTickListener((...args) => this.handleTick(...args));
  }

  handleTick(tick: Tick) {}
}

export default BaseStrategy;
