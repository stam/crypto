
import MockMarket from '../../market/mock';
import { cleanup, delay, createTicks } from '../../testUtils';
import SimpleStrategy from './simple';
import { getRepository } from 'typeorm';
import Tick from '../../models/tick';


describe('The simple strategy', () => {
  let market: MockMarket;
  let strategy: SimpleStrategy;
  let ticks: Tick[];

  beforeAll(async () => {
    ticks = createTicks([
      { value: 7500, },
      { value: 6999, },
      { value: 7000, },
      { value: 6998, },
      { value: 9500, },
      { value: 9449, },
      { value: 9501, },
    ])
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    market = new MockMarket({ accountValue: 0, accountFiat: 700000 });
    market.setTicks(ticks);
    strategy = new SimpleStrategy(market);
  });

  it('should place a buy order when the price dips under 7000', async () => {
    await market.tick();
    await market.tick();

    expect(market.unfullfilledOrders).toHaveLength(1);
    expect(market.unfullfilledOrders[0].side).toBe('buy');
  });

  it('should not have orders resolve immediately, only after the next matching tick', async () => {
    await market.tick();
    await market.tick();
    await market.tick();

    expect(market.unfullfilledOrders).toHaveLength(1);
    await market.tick();

    expect(market.unfullfilledOrders).toHaveLength(0);
    expect(market.accountFiat).toBe(200) // 7000 - 6998
    expect(market.accountValue).toBe(1)

  });

  it('should create a sell order when the price peaks above 9500', async () => {
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();

    expect(market.unfullfilledOrders).toHaveLength(1);
    expect(market.unfullfilledOrders[0].type).toBe('limit');
    expect(market.unfullfilledOrders[0].side).toBe('sell');
  });

  it('should resolve the sell order when a price above 9500 is found', async () => {
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();
    await market.tick();


    expect(market.unfullfilledOrders).toHaveLength(0);
    expect(market.accountFiat).toBe(950300) // 7000 - 6998 + 9501
    expect(market.accountValue).toBe(0)
  });
});
