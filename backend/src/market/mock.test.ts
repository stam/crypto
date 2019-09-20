import MockMarket from './mock';

import { getRepository } from 'typeorm';
import Tick from '../models/tick';
import { delay, createTicks } from '../testUtils';
import { Order } from '.';


describe('The MockMarket', () => {
  let ticks: Tick[];
  beforeAll(async () => {
    ticks = createTicks([{
      last: 6001,
    }, { last: 5200 }, { last: 5300 }, { last: 6200 }, { last: 6100 }
    ])
  });

  it('executes a buy order when it encounters a lower tick', async () => {
    let buyOrder: Order = null;

    const market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);

    market.buy(6000, 1).then((order) => {
      buyOrder = order;
    });

    expect(buyOrder).toBeNull();

    let tick = await market.tick();
    await delay(0);

    expect(tick.last).toBeGreaterThan(6000);
    expect(buyOrder).toBeNull();

    tick = await market.tick();
    await delay(0);

    expect(tick.last).toBeLessThanOrEqual(6000);
    expect(buyOrder).not.toBe(null);
    expect(buyOrder.price).toBe(5200);
  })

  it('only executes a buy order once', async () => {
    let buyOrder: Order = null;

    const market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);

    market.buy(6000, 1).then((order) => {
      buyOrder = order;
    });
    await market.tick();
    expect(market.unfullfilledOrders).toHaveLength(1);
    await market.tick();

    await delay(0);
    expect(buyOrder.price).toBe(5200);
    expect(market.unfullfilledOrders).toHaveLength(0);
  });

  it('should fill in the orderDate with the tickDate', async () => {
    // When backtesting, the order should not gain the current timestamp,
    // but the date of the given tick.
    let buyOrder: Order = null;

    const market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
    market.setTicks(ticks);

    market.buy(6000, 1).then((order) => {
      buyOrder = order;
    });
    await market.tick();
    expect(market.unfullfilledOrders).toHaveLength(1);
    await market.tick();

    const tick = ticks[1];

    await delay(0);
    expect(buyOrder.date).toBe(tick.timestamp);
  });

  it('executes a sell order when it encounters a higher tick', async () => {
    let sellOrder: Order = null;

    const market = new MockMarket({ accountValue: 1, accountFiat: 0 });
    market.setTicks(ticks);

    market.sell(6100, 1).then((order) => {
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

  it('should support market orders', async () => {

  })
})
