
import Simulation from '.';
import Strategy from '../strategy/example/simple';
import MockMarket from '../market/mock';
import BaseStrategy from '../strategy/base';
import { createTicks, delay } from '../testUtils';
import Tick from '../models/tick';


describe('A Simulation', () => {
  let simulation: Simulation;
  let market: MockMarket;
  let strategy: BaseStrategy;
  let ticks: Tick[];

  beforeEach(() => {
    market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    strategy = new Strategy(market);
    simulation = new Simulation({ market, strategy });
  });

  it('tells the market to broadcast its ticks', async () => {
    ticks = createTicks([{
      last: 50,

    }, {
      last: 51,
    }
  ])
    market.setTicks(ticks);
    strategy.handleTick = jest.fn();

    await simulation.run();

    expect(strategy.handleTick).toHaveBeenCalledTimes(2);
  });

  it('should track orders', async () => {
    ticks = createTicks([
      { last: 6900, },
      { last: 6900, },
      { last: 9600, },
      { last: 9600, }
  ])
    market.setTicks(ticks);

    await simulation.run();

    await delay(0);

    expect(simulation.orders).toHaveLength(2);
  });
});
