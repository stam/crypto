import Tick from '../models/tick';
import { remove } from 'lodash';
import BaseMarket from '.';
import Order, {OrderSide, OrderType } from './order';

export default class MockMarket extends BaseMarket {
  ticks: Tick[] = [];
  tickIndex: number = 0;
  onPlaceOrder: (order: Order) => void = null;

  unfullfilledOrders: Order[] = [];

  constructor(accountStartValues) {
    super(accountStartValues);
  }

  async setTicks (ticks: Tick[]) {
    this.ticks = ticks;
  }

  async checkIfOrdersResolve(tick: Tick) {
    remove(this.unfullfilledOrders, (order) => {
      if (order.checkIfResolves) {
        if (this.onPlaceOrder) {
          this.onPlaceOrder(order);
        }
        order.resolve(tick.last, tick.timestamp);
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

  async placeOrder(type: OrderType, side: OrderSide, quantity: number, price?: number) {
    // Todo, pendingorder should be an order which can resolve itself,
    // and possible rollback the transaction fees
    const p = new Promise<Order>((resolve, reject) => {
      const order = new Order(type, side, quantity, price);
      order.onResolve = resolve;
      order.onReject = reject;
      // const pendingOrder = {
      //   price,
      //   quantity,
      //   type,
      //   side,
      //   resolve,
      // }

      // if (type === OrderType.LIMIT) {
      //   if (side === OrderSide.BUY) {
      //     this.accountFiat -= Math.round(price * quantity);
      //   } else if (side === OrderSide.SELL) {
      //     this.accountValue -= quantity;
      //   }
      // }

      // this.unfullfilledOrders.push(pendingOrder);
    });

    return p;
  }
}
