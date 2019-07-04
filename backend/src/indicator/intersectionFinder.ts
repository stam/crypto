import Indicator from ".";
import { last } from 'lodash';

class IntersectionFinder {

  // Finds the lowest value for which the shortIndicator > longIndicator
  findRisingBreakoutValue(indShort: Indicator, indLong: Indicator) {
    const currentValue = last(indShort.previousValues);
    // TODO: detect divergence

    let value = currentValue;

    while (true) {
      const shortValue = indShort.testValue(value);
      const longValue = indLong.testValue(value);

      if (shortValue > longValue) {
        return value;
      }
      value += 1;
    }
  }
}

export default new IntersectionFinder();
