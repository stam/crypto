import Tick from '../models/tick';
import { remove } from 'lodash';
import BaseMarket, { Order, OrderType } from '.';

interface PendingOrder {
  price: number;
  quantity: number;
  type: OrderType;
  resolve: (order: Order) => void;
}

export default class MockMarket extends BaseMarket {
  ticks: Tick[] = [];
  tickIndex: number = 0;

  unfullfilledOrders: PendingOrder[] = [];

  constructor(accountStartValues) {
    super(accountStartValues);

    // this.addTickListener({
    //   handleTick: (tick) => this.checkIfOrdersResolve(tick),
    // })
  }

  async setTicks (ticks: Tick[]) {
    this.ticks = ticks;
  }

  async checkIfOrdersResolve(tick: Tick) {
    remove(this.unfullfilledOrders, (order) => {
      const price = order.price * 100;

      if (order.type === OrderType.BUY && tick.last <= price ) {
        const o = new Order({
          date: new Date('2018-03-07T00:00:00.000Z'),
          quantity: order.quantity,
          type: order.type,
          price: tick.last,
        });
        order.resolve(o);
        return true;
      }
      if (order.type === OrderType.SELL && tick.last >= price) {
        const o = new Order({
          date: new Date('2018-03-07T00:00:00.000Z'),
          quantity: order.quantity,
          type: order.type,
          price: tick.last,
        });
        order.resolve(o);
        return true;
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

  async placeOrder(price: number, quantity: number, type: OrderType) {
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
