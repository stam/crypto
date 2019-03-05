import Tick from '../models/tick';
import { round } from 'lodash';
import BaseMarket, { Order } from '.';

export default class MockMarket extends BaseMarket {
  ticks: Tick[] = [];
  tickIndex: number = 0;
  tickCallBacks = [];

  async setTicks (ticks: Tick[]) {
    this.ticks = ticks;
  }

  get hasTicks() {
    return this.tickIndex < this.ticks.length;
  }

  protected async queryTick() {
    const tick = this.ticks[this.tickIndex];
    this.tickIndex += 1;

    return tick;
  }

  // todo fix this shit
  async placeOrder(price: number, quantity: number, type: string) {
    const p = new Promise<Order>((resolve, reject) => {
      this.tickCallBacks.push((tick) => {
        const value = round(tick.last / 100);
        console.log('checkconstraints', type, value, price);

        if (type === 'buy' && value <= price) {
          const o = new Order({
            date: new Date('2018-03-07T00:00:00.000Z'),
            quantity,
            type,
            price: value,
          });
          resolve(o);
        } else if (type === 'sell' && value >= price) {
          const o = new Order({
            date: new Date('2018-03-07T00:00:00.000Z'),
            quantity,
            type,
            price: value,
          });
          resolve(o);
        }
      })
    });

    return p;
  }
}
