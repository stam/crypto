import { round } from 'lodash';

class Asset {
  id: number;
  cost: number;
  quantity: number;

  constructor(cost: number, quantity: number) {
    this.cost = cost;
    this.quantity = quantity;
  }

  // handleTick(tick) {
  //   const price: number = tick.last;

  //   if (this.determineSell(price)) {
  //     this.handleSell(price);
  //   }
  // }

  // determineSell(price: number) {
  //   const value = round(price / 100);
  //   return (value / this.cost) > 1.1;
  // }
}

export default Asset;
