import MockMarket from './mock';

import { getRepository } from 'typeorm';
import Tick from '../models/tick';
import { ensureConnection, createTick, cleanup, delay } from '../testUtils';
import { Order } from '.';


describe('The MockMarket', () => {
  beforeAll(async () => {
    await ensureConnection();

    await createTick({
      last: 6001,
    });
    await createTick({
      last: 5200,
    });
    await createTick({
      last: 5300,
    });
    await createTick({
      last: 6200,
    });
    await createTick({
      last: 6100,
    });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('executes a buy order when it encounters a lower tick', async () => {
    let buyOrder : Order = null;
    const ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });

    const market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);

    market.buy(60, 1).then((order) => {
      buyOrder = order;
    });

    expect(buyOrder).toBeNull();

    let tick = await market.tick();
    await delay(0);

    expect(tick.last / 100).toBeGreaterThan(60);
    expect(buyOrder).toBeNull();

    tick = await market.tick();
    await delay(0);

    expect(tick.last / 100).toBeLessThanOrEqual(60);
    expect(buyOrder).not.toBe(null);
    expect(buyOrder.price).toBe(5200);
  })

  it('only executes a buy order once', async () => {
    let buyOrder : Order = null;

    const ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });

    const market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);

    market.buy(60, 1).then((order) => {
      buyOrder = order;
    });
    await market.tick();
    expect(market.unfullfilledOrders).toHaveLength(1);
    await market.tick();

    await delay(0);
    expect(buyOrder.price).toBe(5200);
    expect(market.unfullfilledOrders).toHaveLength(0);
  });

  it('executes a sell order when it encounters a higher tick', async () => {
    let sellOrder : Order = null;

    const ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });

    const market = new MockMarket({ accountValue: 1, accountFiat: 0 });
    market.setTicks(ticks);

    market.sell(61, 1).then((order) => {
      sellOrder = order;
    });

    await market.tick();
    expect(market.unfullfilledOrders).toHaveLength(1);
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();

    await delay(0);
    expect(sellOrder.price).toBe(6200);
    expect(market.unfullfilledOrders).toHaveLength(0);
  });
})
