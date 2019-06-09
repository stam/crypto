
import MockMarket from '../../market/mock';
import { ensureConnection, createTick, cleanup, delay } from '../../testUtils';
import SimpleStrategy from './simple';
import { getRepository } from 'typeorm';
import Tick from '../../models/tick';


describe('The simple strategy', () => {
  let market: MockMarket;
  let strategy: SimpleStrategy;
  let ticks: Tick[];

  beforeAll(async () => {
    await ensureConnection();

    await createTick({
      last: 7500,
    });
    await createTick({
      last: 6999,
    });
    await createTick({
      last: 7010,
    });
    await createTick({
      last: 9500,
    });
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });
    market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);
    strategy = new SimpleStrategy(market);
  });

  it('should buy when the price dips under 7000', async () => {
    await market.tick();
    await market.tick();

    await delay(0);

    expect(market.unfullfilledOrders).toHaveLength(1);
    expect(market.unfullfilledOrders[0].type).toBe('buy');
  });

  it('should sell when the price peaks above 9500', async () => {
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();

    await delay(0);

    expect(market.unfullfilledOrders).toHaveLength(1);
    expect(market.unfullfilledOrders[0].type).toBe('sell');
  })
});
