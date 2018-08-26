import Simulation from '.';
import Strategy from '../strategy';
import { forIn } from 'lodash';


// Todo move ticks to some kind fixture
export class Tick {
  constructor(data) {
    forIn(data, (value, key) => {
      this[key] = value;
    });
  }
  get(key) {
    return this[key];
  }
}

const tickData = [
  { timestamp: '2018-08-24T19:21:38.170Z', last: 690000 },
  { timestamp: '2018-08-24T19:22:38.170Z', last: 960000 },
];

const ticks = tickData.map(data => new Tick(data));

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
})
