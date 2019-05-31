import Tick from '../models/tick';
import { round, each, remove } from 'lodash';
import BaseMarket, { Order } from '.';

class PendingOrder {

}

export default class MockMarket extends BaseMarket {
  ticks: Tick[] = [];
  tickIndex: number = 0;

  unfullfilledOrders: any[] = [];

  constructor(accountStartValues) {
    super(accountStartValues);

    this.addTickListener({
      handleTick: (tick) => this.checkIfOrdersResolve(tick),
    })
  }

  async setTicks (ticks: Tick[]) {
    this.ticks = ticks;
  }

  checkIfOrdersResolve(tick: Tick) {
    remove(this.unfullfilledOrders, (order) => {

      const price = order.price * 100;

      if (order.type === 'buy' && tick.last <= price ) {
        const o = new Order({
          date: new Date('2018-03-07T00:00:00.000Z'),
          quantity: order.quantity,
          type: order.type,
          price: tick.last,
        });
        order.resolve(o);
        return true;
      }
      if (order.type === 'sell' && tick.last >= price) {
        // TODO sell
      }
      return false;
    })
  }

  get hasTicks() {
    return this.tickIndex < this.ticks.length;
  }

  protected async queryTick() {
    const tick = this.ticks[this.tickIndex];
    this.tickIndex += 1;

    return tick;
  }

  async placeOrder(price: number, quantity: number, type: string) {
    const p = new Promise<Order>((resolve, reject) => {
      const pendingOrder = {
        price,
        quantity,
        type,
        resolve,
      }
      this.unfullfilledOrders.push(pendingOrder);
    });

    return p;
  }
}
