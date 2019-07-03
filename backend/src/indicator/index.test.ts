import Indicator from '.';
import * as TA from 'technicalindicators';
import { createCandles } from '../testUtils';

const candleData = [
  { open: 1037801, close: 1030748, low: 1030748, high: 1037801, timespan: '1D', datetime: new Date('2018-03-07T00:00:00.000Z')},
  { open: 1031580, close: 962644, low: 961699, high: 1043700, timespan: '1D', datetime: new Date('2018-03-08T00:00:00.000Z')},
  { open: 962500, close: 962912, low: 900002, high: 975756, timespan: '1D', datetime: new Date('2018-03-09T00:00:00.000Z')},
  { open: 961182, close: 901575, low: 900773, high: 977840, timespan: '1D', datetime: new Date('2018-03-10T00:00:00.000Z')},
  { open: 901618, close: 964205, low: 882721, high: 979625, timespan: '1D', datetime: new Date('2018-03-11T00:00:00.000Z')},
  { open: 964600, close: 933945, low: 901524, high: 999988, timespan: '1D', datetime: new Date('2018-03-12T00:00:00.000Z')},
  { open: 935230, close: 935627, low: 907508, high: 955300, timespan: '1D', datetime: new Date('2018-03-13T00:00:00.000Z')},

  // Intermediate value
  { open: 937230, close: 924967, low: 850001, high: 951140, timespan: '1D', datetime: new Date('2018-03-13T12:00:00.000Z')},

  { open: 937230, close: 860124, low: 850001, high: 951140, timespan: '1D', datetime: new Date('2018-03-14T00:00:00.000Z')},
];

export const candles = createCandles(candleData);

it('The TA lib supports rolling indicator calculations', () => {
  const ta = new TA.EMA({
    period: 7,
    values: [],
  });

  expect(ta.result).toEqual([]);

  let result;

  ta.nextValue(candleData[0].close);
  ta.nextValue(candleData[1].close);
  ta.nextValue(candleData[2].close);
  ta.nextValue(candleData[3].close);
  ta.nextValue(candleData[4].close);
  result = ta.nextValue(candleData[5].close);

  expect(result).toBeUndefined();

  result = ta.nextValue(candleData[6].close);
  expect(Math.round(result)).toBe(955951);

  result = ta.nextValue(candleData[8].close);
  expect(Math.round(result)).toBe(931994);
});

describe('An indicator', () => {
  it('will calculate a result based on candles', async () => {
    const emaIndicator = new Indicator('EMA', 7);

    emaIndicator.updateValue(candles[0]);
    emaIndicator.updateValue(candles[1]);
    emaIndicator.updateValue(candles[2]);
    emaIndicator.updateValue(candles[3]);
    emaIndicator.updateValue(candles[4]);
    emaIndicator.updateValue(candles[5]);

    expect(emaIndicator.result).toBe(null);

    emaIndicator.updateValue(candles[6]);
    expect(Math.round(emaIndicator.result)).toBe(955951);

    emaIndicator.updateValue(candles[8]);
    expect(Math.round(emaIndicator.result)).toBe(931994);
  });

  it('calculates intermediate values', async () => {
    const emaIndicator = new Indicator('EMA', 7);

    emaIndicator.updateValue(candles[0]);
    emaIndicator.updateValue(candles[1]);
    emaIndicator.updateValue(candles[2]);
    emaIndicator.updateValue(candles[3]);
    emaIndicator.updateValue(candles[4]);
    emaIndicator.updateValue(candles[5]);

    expect(emaIndicator.result).toBe(null);

    emaIndicator.updateValue(candles[6]);
    expect(Math.round(emaIndicator.result)).toBe(955951);

    emaIndicator.updateIntermediateValue(candles[7]);
    expect(Math.round(emaIndicator.result)).toBe(948205);

    emaIndicator.updateValue(candles[8]);
    expect(Math.round(emaIndicator.result)).toBe(931994);
  });
});
