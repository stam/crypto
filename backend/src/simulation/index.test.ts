
import Simulation from '.';
import Strategy from '../strategy/example/simple';
import MockMarket from '../market/mock';
import BaseStrategy from '../strategy/base';
import { createTicks } from '../testUtils';
import Tick from '../models/tick';


describe('A Simulation', () => {
  let simulation: Simulation;
  let market: MockMarket;
  let strategy: BaseStrategy;
  let ticks: Tick[];

  beforeEach(() => {
    ticks = createTicks([{
      last: 50,

    }, {
      last: 51,
    }
    ])
    market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);
    strategy = new Strategy(market);
    simulation = new Simulation({ market, strategy });
  });

  it('tells the market to broadcast its ticks', async () => {
    strategy.handleTick = jest.fn();

    await simulation.run();

    expect(strategy.handleTick).toHaveBeenCalledTimes(2);
  });

  it('should track orders', async () => {

  });
});
