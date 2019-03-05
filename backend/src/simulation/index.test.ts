import { fixtureCreator, TypeormFixtures } from 'typeorm-fixtures';

import Simulation from '.';
import Strategy from '../strategy/example/simple';
import MockMarket from '../market/mock';
import { ensureConnection } from '../../testUtils';
// import { createConnection, ConnectionOptions } from 'typeorm';
import Tick from '../models/tick';
import BaseStrategy from '../strategy/base';

export const generateTicks = fixtureCreator<Tick>(Tick, function(entity, index) {
  return {
    symbol: 'BTCUSD',
    ask: 100,
    bid: 100,
    last: 100 + index,
    volume: 1200,
    main_volume: 5000,
    timestamp: new Date(`2019-01-01 15:00:${index}`),
    ...entity,
  };
});

const tickFixture = generateTicks([
  {
    last: 50,
  },
  {
    last: 51,
  },
]);

const TestDb = new TypeormFixtures().addFixture(tickFixture);

describe('A Simulation', () => {
  let simulation: Simulation;
  let market: MockMarket;
  let strategy: BaseStrategy;

  beforeAll(async () => {
    await ensureConnection();

    await TestDb.loadFixtures();
  });

  afterAll(TestDb.dropFixtures);

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
});
