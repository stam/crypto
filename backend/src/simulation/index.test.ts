import { forIn } from 'lodash';

import Simulation from '.';
import Strategy from '../strategy/example/simple';
import Tick from '../models/tick';
import { Order } from '../market';

const tickData = [
  { timestamp: new Date('2018-08-24T19:21:38.170Z'), last: 690000 },
  { timestamp: new Date('2018-08-24T19:22:38.170Z'), last: 960000 },
];

// Todo move to fixtures of some kind
const bulkCreate = (Model, data) => {
  return data.map(entry => {
    const m = new Model();
    forIn(entry, (value, key) => {
      m[key] = value;
    })
    return m;
  })
}

export const ticks = bulkCreate(Tick, tickData);

describe('A Simulation', () => {
  let simulation;

  beforeEach(() => {
    simulation = new Simulation({ ticks, Strategy });
  });

  it('receives orders from its strategy', () => {
    simulation.run();

    expect(simulation.orders.length).toBe(2);
  });

  it('calculates metrics for each asset sold', () => {
    simulation.run();

    expect(simulation.trades.length).toBe(1);

    const trade = simulation.trades[0];
    expect(trade.costBasis).toBe(690000);
    expect(trade.marketValue).toBe(960000);
    expect(trade.result).toBe(139.1);
  })

  xit('bundles orders into trades', () => {
    const s = new Simulation({ ticks, Strategy });

    const orders = bulkCreate(Order, [
      { date: new Date(), quantity: 2, price: 1000, buy: 'buy' },
      { date: new Date(), quantity: 2, price: 1000, buy: 'buy' },
      { date: new Date(), quantity: 1, price: 1000, buy: 'sell' },
      { date: new Date(), quantity: 2, price: 1000, buy: 'sell' },
      { date: new Date(), quantity: 1, price: 1000, buy: 'sell' },
    ]);

    expect(s.trades.length).toBe(2);

    // Trade 1 should contain 1 buy and 2 sell orders,

    // Trade 1 should contain 1 buy and 2 sell orders (sell trade #2 is split over 2 trades)
  });
})
