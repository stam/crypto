import MockMarket from './mock';

import { fixtureCreator, TypeormFixtures } from 'typeorm-fixtures';
import { createConnection, ConnectionOptions, getRepository } from 'typeorm';
import { generateTicks } from '../simulation/index.test';
import Tick from '../models/tick';
import { ensureConnection } from '../../testUtils';

const tickFixture = generateTicks([
  {
    last: 6001,
  },
  {
    last: 6000,
  },
]);

const TestDb = new TypeormFixtures().addFixture(tickFixture);

// describe('A Simulation', () => {
//   let simulation: Simulation;
//   let market: MockMarket;
//   let strategy: BaseStrategy;


//   beforeEach(() => {
//     market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
//     strategy = new Strategy(market);
//     simulation = new Simulation({ market, strategy });
//   });

//   it('feeds the ticks into the market', async () => {
//     await simulation.run();

//     expect(market.ticks.length).toBe(2);
//   });

//   it('tells the market to broadcast its ticks', async () => {
//     strategy.handleTick = jest.fn();

//     await simulation.run();

//     expect(strategy.handleTick).toHaveBeenCalledTimes(2);
//   });
// });


describe('The MockMarket', () => {
  beforeAll(async () => {
    await ensureConnection();

    await TestDb.loadFixtures();
  });

  afterAll(TestDb.dropFixtures);

  it('executes a buy order when it encounters a lower tick', async () => {
    const ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });

    const market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);

    const buyPromise = market.buy(60, 1);
    expect(buyPromise).toBeInstanceOf(Promise);

    let tick = await market.tick();

    expect(tick.last / 100).toBeGreaterThan(60);
    expect(buyPromise).toBeInstanceOf(Promise);

    tick = await market.tick();

    expect(tick.last / 100).toBeLessThanOrEqual(60);
    expect(buyPromise).toBe(true);
  })
})
