import MockMarket from './mock';

import { getRepository } from 'typeorm';
import Tick from '../models/tick';
import { ensureConnection, createTick, cleanup } from '../testUtils';


describe('The MockMarket', () => {
  beforeAll(async () => {
    await ensureConnection();

    await createTick({
      last: 6001,
    });
    await createTick({
      last: 6000,
    });

  });

  afterAll(async () => {
    await cleanup();
  });

  xit('executes a buy order when it encounters a lower tick', async () => {
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
