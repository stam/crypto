
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
    market = new MockMarket({ accountValue: 0, accountFiat: 7000 });
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
      { last: 6900, },
      { last: 6900, },
      { last: 9600, },
      { last: 9600, }
    ])
    market.setTicks(ticks);

    await simulation.run();

    await delay(0);

    expect(simulation.orders).toHaveLength(2);
  });

  describe('when condensing trades', () => {
    simulation.orders = createOrders([
      { quantity: 1, price: 100, type: OrderType.BUY },
      { quantity: 1, price: 150, type: OrderType.SELL },
    ]);

    simulation.condenseOrders();

    expect(simulation.trades).toHaveLength(1);
    expect(simulation.trades[0].buyPrice).toBe(100);
    expect(simulation.trades[0].sellPrice).toBe(150);
    expect(simulation.trades[0].result).toBe(2);
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
