import { uniqueId } from 'lodash';
import Tick from '../models/tick';
import BaseMarket from '.';
import { getRepository } from 'typeorm';

export default class MockMarket extends BaseMarket {
  ticks: Tick[] = [];
  tickIndex: number = 0;

  async setTicks (ticks: Tick[]) {
    this.ticks = ticks;
  }

  get hasTicks() {
    return this.tickIndex < this.ticks.length;
  }

  protected queryTick() {
    const tick = this.ticks[this.tickIndex];
    this.tickIndex += 1;
    return tick;
  }
}
