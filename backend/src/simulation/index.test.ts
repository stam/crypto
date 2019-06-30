
import Simulation from '.';
import Strategy from '../strategy/example/simple';
import MockMarket from '../market/mock';
import BaseStrategy from '../strategy/base';
import { createTicks, delay, createOrders } from '../testUtils';
import Tick from '../models/tick';
import { Order, OrderType } from '../market';


describe('A Simulation', () => {
  let simulation: Simulation;
  let market: MockMarket;
  let strategy: BaseStrategy;
  let ticks: Tick[];

  beforeEach(() => {
    market = new MockMarket({ accountValue: 0, accountFiat: 700000 });
    strategy = new Strategy(market);
    simulation = new Simulation({ market, strategy });
  });

  it('tells the market to broadcast its ticks', async () => {
    ticks = createTicks([{
      last: 50,

    }, {
      last: 51,
    }
    ])
    market.setTicks(ticks);
    strategy.handleTick = jest.fn();

    await simulation.run();

    expect(strategy.handleTick).toHaveBeenCalledTimes(2);
  });

  it('should track orders', async () => {
    ticks = createTicks([
      { value: 6900, },
      { value: 6900, },
      { value: 9600, },
      { value: 9600, }
    ])
    market.setTicks(ticks);

    await simulation.run();

    await delay(0);

    expect(simulation.orders).toHaveLength(2);
  });

  it('should calculate profit', async () => {
    market = new MockMarket({ accountValue: 0.5, accountFiat: 690000 });
    strategy = new Strategy(market);
    simulation = new Simulation({ market, strategy });

    ticks = createTicks([
      { value: 6900, },
      { value: 6900, },
      { value: 9600, },
      { value: 9600, }
    ])
    market.setTicks(ticks);

    await simulation.run();

    await delay(0);

    // Profit should be 137.8%

    // Start value = 0.5 * 6900 + 7000 = 10450
    expect(simulation.startBalance).toBe(0.5 * 6900 + 6900);
    // End value = 0.5 * 9600 + 9600 = 14400
    expect(simulation.endBalance).toBe(0.5 * 9600 + 9600);
    expect(simulation.profit).toBe(139.1);
  })

  describe('when condensing trades', () => {
    it('should calculate the result based on sell and buyPrice', () => {
      const orders = createOrders([
        { quantity: 1, price: 100, type: OrderType.BUY },
        { quantity: 1, price: 150, type: OrderType.SELL },
      ]);

      orders.forEach(order => simulation.handleOrder(order));

      expect(simulation.trades).toHaveLength(1);
      expect(simulation.trades[0].buyPrice).toBe(100);
      expect(simulation.trades[0].sellPrice).toBe(150);
      expect(simulation.trades[0].result).toBe(150);

    });

    it('should leave initial sell orders as open trades', () => {
      const orders = createOrders([
        { quantity: 1, price: 150, type: OrderType.SELL },
        { quantity: 1, price: 100, type: OrderType.BUY },
        { quantity: 1, price: 150, type: OrderType.SELL },
      ]);

      orders.forEach(order => simulation.handleOrder(order));

      expect(simulation.trades).toHaveLength(2);
      expect(simulation.trades[0].buyPrice).toBe(null);
      expect(simulation.trades[0].sellPrice).toBe(150);
      expect(simulation.trades[0].result).toBe(undefined);
      expect(simulation.trades[1].buyPrice).toBe(100);
      expect(simulation.trades[1].sellPrice).toBe(150);
      expect(simulation.trades[1].result).toBe(150);
    })
  });

  xit('should track trades', async () => {
    ticks = createTicks([
      { last: 6900, },
      { last: 6900, },
      { last: 9600, },
      { last: 9600, }
    ])
    market.setTicks(ticks);

    await simulation.run();

    await delay(0);

    expect(simulation.trades).toHaveLength(1);
  })
});
