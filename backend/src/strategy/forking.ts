import BaseStrategy from '.';
import Asset from './asset';

class HodlAsset extends Asset {
  determineSell(value) {
    // Sell if we made 10% profit...
    return value / this.cost >= 1.1;
  }
}

class ForkingStrategy extends BaseStrategy {
  get Asset() {
    return HodlAsset;
  }
  // In this strategy we just hodl anyway
  // In the future we want to have some kind of enter strat
  determineBuy(value) {
    return value <= 7500;
  }
}

export default ForkingStrategy;
