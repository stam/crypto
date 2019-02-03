import { fixtureCreator, TypeormFixtures } from 'typeorm-fixtures';

import Simulation from '.';
import Strategy from '../strategy/example/simple';
import MockMarket from '../market/mock';
import { createConnection, ConnectionOptions } from 'typeorm';
import Tick from '../models/tick';

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
  let simulation;

  beforeAll(async () => {
    const config = require(`${process.cwd()}/ormconfig.js`);
    await createConnection({
      ...(config as ConnectionOptions),
    });

    await TestDb.loadFixtures();
  });

  afterAll(TestDb.dropFixtures);

  beforeEach(() => {
    const market = new MockMarket({ accountValue: 1000, accountFiat: 0 });
    const strategy = new Strategy(market);

    simulation = new Simulation({ market, strategy });
  });

  it('fetches ticks', async () => {
    await simulation.run();

    expect(simulation.ticks.length).toBe(2);
  });

  xit('feeds the ticks into the market', async () => {});

  xit('tells the market to query', async () => {});
});
