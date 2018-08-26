import { round } from 'lodash';

interface Asset {
  cost: number;
  quantity: number;
  handleSell: any;
  id: number;
}

class Asset {
  constructor(cost, quantity, handleSell) {
    this.cost = cost;
    this.quantity = quantity;
    this.handleSell = handleSell;
    this.id = Date.now();
  }

  handleTick(tick) {
    const price = tick.get('last');
    if (this.determineSell(price)) {
      this.handleSell(price);
    }
  }

  determineSell(price) {
    const value = round(price / 100);
    return value >= 9500;
  }
}

export default Asset;
