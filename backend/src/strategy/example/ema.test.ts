import Strategy from './ema';
import Market from '../../market';
import { bulkCreate } from '../../simulation/index.test';
import Tick from '../../models/tick';


// id|symbol|ask|bid|last|volume|main_volume|timestamp
// 2002|BTCUSD|941920|940747|941944|621238|5869754325|2018-03-09 15:40:00.001
// 2003|BTCUSD|943302|941874|941963|621328|5870415605|2018-03-09 15:41:00.007
// 2004|BTCUSD|943136|941874|942001|621548|5872371990|2018-03-09 15:42:00.002
// 2005|BTCUSD|943338|943229|943195|621621|5872730459|2018-03-09 15:42:59.313
// 2006|BTCUSD|942278|941566|942277|621680|5873110628|2018-03-09 15:44:00.003
// 2007|BTCUSD|942465|941801|941928|621695|5873201315|2018-03-09 15:45:00.001
// const tickData = [{
//   ask: 941920, bid: 940747, last: 941944, volume: 621238, main_volume: 5869754325, timestamp: new Date('2018-03-09 15:40:00.001'),
// }, {
//   ask: 943302, bid: 941874, last: 941963, volume: 621328, main_volume: 5870415605, timestamp: new Date('2018-03-09 15:41:00.007'),
// }, {
//   ask: 943136, bid: 941874, last: 942001, volume: 621548, main_volume: 5872371990, timestamp: new Date('2018-03-09 15:42:00.002'),
// }, {
//   ask: 943338, bid: 943229, last: 943195, volume: 621621, main_volume: 5872730459, timestamp: new Date('2018-03-09 15:43:00.001'),
// }, {
//   ask: 942278, bid: 941566, last: 942277, volume: 621680, main_volume: 5873110628, timestamp: new Date('2018-03-09 15:44:00.001'),
// }, {
//   ask: 942465, bid: 941801, last: 941928, volume: 621695, main_volume: 5873201315, timestamp: new Date('2018-03-09 15:45:00.001'),
// }];

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

const ticks = bulkCreate(Tick, tickData);
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
  })

  // it('keeps track of 5 candles maximum', async () => {

  // })

  // it('keeps track of previous 5 ticks', async () => {
  //   strategy.handleTick(ticks[0]);

  //   const indicator = strategy.indicators[0];
  //   expect(indicator.previousTicks).toEqual([ticks[0]]);

  //   const promises = [];
  //   for (let i = 1; i < ticks.length; i++) {
  //     const promise = strategy.handleTick(ticks[i]);
  //     promises.push(promise);
  //   }

  //   expect(indicator.previousTicks.length).toBe(5);

  //   expect(indicator.previousTicks).toEqual([
  //     ticks[5], ticks[6], ticks[7], ticks[8], ticks[9]
  //   ]);

  //   await Promise.all(promises);

  //   expect(indicator.result).toBe(ticks[7].last);
  // });
});
