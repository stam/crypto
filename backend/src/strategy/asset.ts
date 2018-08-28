import { round } from 'lodash';

class Asset {
  id: number;
  cost: number;
  quantity: number;
  handleSell?(price: number): () => void;

  constructor(cost: number, quantity: number, handleSell) {
    this.cost = cost;
    this.quantity = quantity;
    this.handleSell = handleSell;
    this.id = Date.now();
  }

  handleTick(tick) {
    const price: number = tick.last;

    if (this.determineSell(price)) {
      this.handleSell(price);
    }
  }

  determineSell(price: number) {
    const value = round(price / 100);
    return value >= 9500;
  }
}

export default Asset;
