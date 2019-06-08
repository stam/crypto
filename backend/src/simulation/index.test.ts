
import Simulation from '.';
import Strategy from '../strategy/example/simple';
import MockMarket from '../market/mock';
import BaseStrategy from '../strategy/base';
import { ensureConnection, createTick, cleanup } from '../testUtils';


describe('A Simulation', () => {
  let simulation: Simulation;
  let market: MockMarket;
  let strategy: BaseStrategy;

  beforeAll(async () => {
    await ensureConnection();

    await createTick({
      last: 50,
    });
    await createTick({
      last: 51,
    });
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(() => {
    market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    strategy = new Strategy(market);
    simulation = new Simulation({ market, strategy });
  });

  it('feeds the ticks into the market', async () => {
    await simulation.run();

    expect(market.ticks.length).toBe(2);
  });

  it('tells the market to broadcast its ticks', async () => {
    strategy.handleTick = jest.fn();

    await simulation.run();

    expect(strategy.handleTick).toHaveBeenCalledTimes(2);
  });

  it('should track orders', async () => {

  });
});
