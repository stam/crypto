import Indicator from '.';
import IntersectionFinder from './intersectionFinder';
import { createCandles } from '../testUtils';

const values = [
  5,
  5,
  5,
  2,
  2,
  3,
];


describe('The intersectionCalculator', () => {
  it('can find the value for which two indicators intersect', () => {
    const emaLong = new Indicator('EMA', 5);
    const emaShort = new Indicator('EMA', 2);

    values.map(val => {
      emaLong.updateValue(val);
      emaShort.updateValue(val);
    });

    // Long is now higher than short
    // Which means we are in a downwards trend
    // We want to detect when the price rises again.
    // Our signal that the price rises is that short > long.
    // Need to find value where emaLong > emaShort by the smallest amount

    expect(emaShort.testValue(4)).toBeLessThan(emaLong.testValue(4));
    // The lowest value where the Short indicator > Long indicator is 5.
    expect(emaShort.testValue(5)).toBeGreaterThan(emaLong.testValue(5));

    const intersectionPrice = IntersectionFinder.findRisingBreakoutValue(emaShort, emaLong);
    expect(intersectionPrice).toBe(5);
  });

  xit('should throw an error if they diverge', () => {

  });

  xit('should throw an error when comparing the wrong way', () => {

  });
})
