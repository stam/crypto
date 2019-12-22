import MockMarket from '../../market/mock';
import { cleanup, delay, createTicks } from '../../testUtils';
import SimpleStrategy from './simple';
import { getRepository } from 'typeorm';
import Tick from '../../models/tick';
import EmaStrategy from './ema';

describe('The ema strategy', () => {
  let market: MockMarket;
  let strategy: EmaStrategy;
  let ticks: Tick[];

  beforeAll(async () => {
    ticks = createTicks([
      { value: 3000, timestamp: new Date(`2019-01-01 15:00:00`) },
      { value: 2900, timestamp: new Date(`2019-01-02 15:00:00`) },
      { value: 800, timestamp: new Date(`2019-01-03 15:00:00`) },
      { value: 2700, timestamp: new Date(`2019-01-04 15:00:00`) },
      { value: 2600, timestamp: new Date(`2019-01-05 15:00:00`) },
      { value: 2500, timestamp: new Date(`2019-01-06 15:00:00`) },
      { value: 2400, timestamp: new Date(`2019-01-07 15:00:00`) },
      { value: 2300, timestamp: new Date(`2019-01-08 15:00:00`) },
      { value: 2200, timestamp: new Date(`2019-01-09 15:00:00`) },
      { value: 2100, timestamp: new Date(`2019-01-10 15:00:00`) },
      { value: 2200, timestamp: new Date(`2019-01-11 15:00:00`) },
      { value: 2300, timestamp: new Date(`2019-01-12 15:00:00`) },
      { value: 2400, timestamp: new Date(`2019-01-13 15:00:00`) },
      { value: 2500, timestamp: new Date(`2019-01-14 15:00:00`) },
      { value: 2600, timestamp: new Date(`2019-01-15 15:00:00`) },
      { value: 2700, timestamp: new Date(`2019-01-16 15:00:00`) },
      { value: 2700, timestamp: new Date(`2019-01-16 15:00:00`) },
    ]);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    market = new MockMarket({ accountValue: 0, accountFiat: 700000 });
    market.setTicks(ticks);
    strategy = new EmaStrategy(market);
  });

  it('should place a buy order when EMA7 > EMA14', async () => {
    for (let i = 14; i > 0; i--) {
      await market.tick();
    }

    expect(Math.round(strategy.indicators.EMA14.result)).toEqual(235000);
    expect(Math.round(strategy.indicators.EMA7.result)).toEqual(235171);

    expect(market.unfullfilledOrders).toHaveLength(1);
    expect(market.accountFiat).toEqual(700000 - strategy.tradeQuantity * market.nextTick.last);
  });
});
