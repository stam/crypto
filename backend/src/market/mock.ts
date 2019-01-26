import { uniqueId } from 'lodash';
import Tick from '../models/tick';
import BaseMarket from './base';
import { getRepository } from 'typeorm';

export default class MockMarket extends BaseMarket {
  ticks: Tick[];

  async initialize () {
    this.ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });
  }
}
