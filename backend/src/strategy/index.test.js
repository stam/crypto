const Strategy = require('.');
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

describe('The default Strategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new Strategy();
  })

  it('creates assets', () => {
    strategy.handleTick(ticks[0]);

    expect(strategy.assets.length).toBe(1);
    expect(strategy.assets[0].quantity).toBe(1);
  })

  it('creates orders', () => {
    strategy.handleTick(ticks[0]);
    strategy.handleTick(ticks[1]);

    expect(strategy.orders.length).toBe(2);
    expect(strategy.orders[0]).toEqual({
      price: tickData[0].last,
      quantity: 1,
      timestamp: tickData[0].timestamp,
      type: 'buy',
    });

    expect(strategy.orders[1]).toEqual({
      price: tickData[1].last,
      quantity: 1,
      timestamp: tickData[1].timestamp,
      type: 'sell',
    })
  });

  it('removes its assets after selling', () => {
    strategy.handleTick(ticks[0]);
    strategy.handleTick(ticks[1]);

    expect(strategy.assets.length).toBe(0);
  })
})
