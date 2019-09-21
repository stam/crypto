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
    // console.log('[MockMarket] | checkIfOrdersResolve | ', this.unfullfilledOrders.length, tick.last);
    remove(this.unfullfilledOrders, (order) => {
      if (order.checkIfResolves(tick)) {
        order.resolve(tick.last, tick.timestamp);
        // console.log('[MockMarket] | checkIfOrdersResolve | done',order);
        if (this.onPlaceOrder) {
          this.onPlaceOrder(order);
        }
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

  protected async placeOrder(type: OrderType, side: OrderSide, quantity: number, price?: number) {
    if (type === OrderType.LIMIT) {
      if (side === OrderSide.BUY) {
        this.accountFiat -= Math.round(price * quantity);
      } else if (side === OrderSide.SELL) {
        this.accountValue -= quantity;
      }
    }
    const p = new Promise<Order>((resolve, reject) => {
      const order = new Order(type, side, quantity, price);
      order.onResolve = resolve;
      order.onReject = reject;

      this.unfullfilledOrders.push(order);
    });

    return p;
  }
}
