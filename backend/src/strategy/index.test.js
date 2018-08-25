const Strategy = require('.');
const Market = require('../market');
const _ = require('lodash');

class Tick {
  constructor(data) {
    _.forIn(data, (value, key) => {
      this[key] = value;
    });
  }
  get(key) {
    return this[key];
  }
}

const tickData = [
  { timestamp: '2018-08-24T19:21:38.170Z', last: 690000 },
  { timestamp: '2018-08-24T19:22:38.170Z', last: 960000 },
];

const ticks = tickData.map(data => new Tick(data));
const market = new Market({ });

describe('The default Strategy', () => {
  let strategy;

  beforeEach(() => {
    market.createOrder = jest.fn();
    strategy = new Strategy(market);
  })

  it('creates assets', () => {
    strategy.handleTick(ticks[0]);

    expect(strategy.assets.length).toBe(1);
    expect(strategy.assets[0].quantity).toBe(1);
  })

  it('creates orders', () => {
    strategy.handleTick(ticks[0]);
    strategy.handleTick(ticks[1]);

    expect(market.createOrder).toHaveBeenCalledTimes(2);
    const orders = market.createOrder.mock.calls;

    expect(orders[0][0].price).toBe(tickData[0].last);
    expect(orders[0][0].asset.quantity).toBe(1);
    expect(orders[0][0].type).toBe('buy');

    expect(orders[1][0].price).toBe(tickData[1].last);
    expect(orders[1][0].asset.quantity).toBe(1);
    expect(orders[1][0].type).toBe('sell');

  });

  it('removes its assets after selling', () => {
    strategy.handleTick(ticks[0]);
    strategy.handleTick(ticks[1]);

    expect(strategy.assets.length).toBe(0);
  })
})
