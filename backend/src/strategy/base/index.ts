import { round } from 'lodash';
import Market from '../../market';
import Tick from '../../models/tick';

class BaseStrategy {
  market: Market;

  constructor(market: Market) {
    this.market = market;
    this.market.addTickListener(this);
  }

  handleTick(tick: Tick) {}
}

export default BaseStrategy;
