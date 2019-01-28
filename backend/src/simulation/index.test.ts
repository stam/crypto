import Simulation from '.';
import Strategy from '../strategy/example/simple';
import MockMarket from '../market/mock';
import { createConnection } from 'typeorm';

const mockQuery = jest.fn();

// jest.mock('typeorm', () => ({
//   ...jest.requireActual('typeorm'),
//   getRepository: (model) => {
//     console.log('import getRepo');
//     return 'bar';
//     // find: mockQuery,
//   }
// }));

describe('A Simulation', () => {
  let simulation;

  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: 'test.sqlite',
      logging: false,
      synchronize: true,
      entities: ['src/models/**/*.ts'],
      migrations: ['migrations/**/*.ts'],
      subscribers: ['src/subscribers/**/*.ts'],
    });
  });

  beforeEach(() => {
    const market = new MockMarket({ accountValue: 1000, accountFiat: 0 });
    const strategy = new Strategy(market);

    simulation = new Simulation({ market, strategy });
  });

  it('fetches ticks', async () => {
    await simulation.run();

    expect(mockQuery).toHaveBeenCalled();
  });

  xit('feeds the ticks into the market', async () => {});

  xit('tells the market to query', async () => {});
});
