import Simulation from '.';
import Strategy from '../strategy';
import Tick from '../models/tick';

const tickData = [
  { timestamp: '2018-08-24T19:21:38.170Z', last: 690000 },
  { timestamp: '2018-08-24T19:22:38.170Z', last: 960000 },
];

export const ticks = tickData.map(data => {
  const t = new Tick();
  t.timestamp = new Date(data.timestamp);
  t.last = data.last;
  return t;
});

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
