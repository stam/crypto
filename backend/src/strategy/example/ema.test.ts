import Strategy from './ema';
import Market from '../../market';
import { bulkCreate } from '../../simulation/index.test';
import Tick from '../../models/tick';


const tickData = [
{ last: 1, timestamp: new Date('2018-03-01 09:00:00.000')},
{ last: 0, timestamp: new Date('2018-03-01 10:00:00.000') },
{ last: 2, timestamp: new Date('2018-03-01 11:00:00.000') },
{ last: 4, timestamp: new Date('2018-03-01 12:00:00.000') },
{ last: 3, timestamp: new Date('2018-03-01 13:00:00.000') },
{ last: 6, timestamp: new Date('2018-03-02 09:00:00.000') },
{ last: 5, timestamp: new Date('2018-03-02 10:00:00.000') },
{ last: 7, timestamp: new Date('2018-03-02 11:00:00.000') },
{ last: 9, timestamp: new Date('2018-03-02 12:00:00.000') },
{ last: 8, timestamp: new Date('2018-03-02 13:00:00.000') },
]

const tickDataDistinct = [
{ last: 0, timestamp: new Date('2018-03-01 10:00:00.000') },
{ last: 1, timestamp: new Date('2018-03-02 10:00:00.000') },
{ last: 2, timestamp: new Date('2018-03-03 10:00:00.000') },
{ last: 3, timestamp: new Date('2018-03-04 10:00:00.000') },
{ last: 4, timestamp: new Date('2018-03-05 10:00:00.000') },
{ last: 5, timestamp: new Date('2018-03-06 10:00:00.000') },
]

const ticks = bulkCreate(Tick, tickData);
const ticksDistinct = bulkCreate(Tick, tickDataDistinct);
const market = new Market({ saveOrder: null});

describe('The EMA Strategy', () => {
  beforeEach(() => {
    market.buy = jest.fn();
    market.sell = jest.fn();
  });

  it('creates candles on the fly', async () => {
    const strategy = new Strategy(market);
    const indicator = strategy.indicators[0];

    const promises = [];
    for (let i = 0; i < ticks.length; i++) {
      const promise = strategy.handleTick(ticks[i]);
      promises.push(promise);
    }

    await Promise.all(promises);
    expect(indicator.candles.length).toBe(2);

    expect(indicator.candles[0].open).toBe(1);
    expect(indicator.candles[0].close).toBe(3);
    expect(indicator.candles[0].low).toBe(0);
    expect(indicator.candles[0].high).toBe(4);
    expect(indicator.candles[0].timespan).toBe('1D');
    expect(indicator.candles[0].datetime).toEqual(new Date('2018-03-01'));

    expect(indicator.candles[1].open).toBe(6);
    expect(indicator.candles[1].close).toBe(8);
    expect(indicator.candles[1].low).toBe(5);
    expect(indicator.candles[1].high).toBe(9);
    expect(indicator.candles[1].timespan).toBe('1D');
    expect(indicator.candles[1].datetime).toEqual(new Date('2018-03-02'));
  });

  it('keeps track of 5 candles maximum', async () => {
    const strategy = new Strategy(market);
    const indicator = strategy.indicators[0];

    const promises = [];
    for (let i = 0; i < ticksDistinct.length; i++) {
      const promise = strategy.handleTick(ticksDistinct[i]);
      promises.push(promise);
    }

    await Promise.all(promises);
    expect(indicator.candles.length).toBe(5);
  });

  it('calculates the EMA result', async () => {
    const strategy = new Strategy(market);
    const indicator = strategy.indicators[0];

    await strategy.handleTick(ticksDistinct[0]);
    await strategy.handleTick(ticksDistinct[1]);

    expect(indicator.result).toBe(null);

    await strategy.handleTick(ticksDistinct[2]);
    await strategy.handleTick(ticksDistinct[3]);
    await strategy.handleTick(ticksDistinct[4]);
    await strategy.handleTick(ticksDistinct[5]);
    expect(indicator.result).toBe(3);
  });
});
