import Tick from '../models/tick';
import { remove } from 'lodash';
import BaseMarket, { Order, OrderType, PendingOrder } from '.';

export default class MockMarket extends BaseMarket {
  ticks: Tick[] = [];
  tickIndex: number = 0;
  onPlaceOrder: (order: Order) => void = null;

  unfullfilledOrders: PendingOrder[] = [];

  constructor(accountStartValues) {
    super(accountStartValues);
  }

  async setTicks (ticks: Tick[]) {
    this.ticks = ticks;
  }

  async checkIfOrdersResolve(tick: Tick) {
    remove(this.unfullfilledOrders, (order) => {

      if (order.type === OrderType.BUY && tick.last <= order.price ) {
        const o = new Order({
          date: tick.timestamp,
          quantity: order.quantity,
          type: order.type,
          price: tick.last,
        });
        if (this.onPlaceOrder) {
          this.onPlaceOrder(o);
        }
        order.resolve(o);
        return true;
      }
      if (order.type === OrderType.SELL && tick.last >= order.price) {
        const o = new Order({
          date: tick.timestamp,
          quantity: order.quantity,
          type: order.type,
          price: tick.last,
        });
        if (this.onPlaceOrder) {
          this.onPlaceOrder(o);
        }
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

      if (type === OrderType.BUY) {
        this.accountFiat -= Math.round(price * quantity);
      } else if (type === OrderType.SELL) {
        this.accountValue -= quantity;
      }
      this.unfullfilledOrders.push(pendingOrder);
    });

    return p;
  }
}
