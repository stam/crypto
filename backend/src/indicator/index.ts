import * as TA from 'technicalindicators';
import Candle from '../models/candle';


class Indicator {
  name: string;
  period: number;
  result: number = null;
  ta = null;
  previousValues: number[] = [];

  currentCandle?: Candle = null;

  constructor(name: string, period: number) {
    this.name = name;
    this.period = period;
    this.ta = new TA[name.toUpperCase()]({
      period: period,
      values: [],
    });
  }

  get desiredLengthOrPreviousValues() {
    return 7 * this.period;
  }

  updateValue(value: number) {
    this.previousValues.push(value);

    if (this.previousValues.length > this.desiredLengthOrPreviousValues) {
      this.previousValues.shift();
    }

    this.result = this.ta.nextValue(value) || null;
    return this.result;
  }

  testValue(value: number) {
    const clonedTa = new TA[this.name.toUpperCase()]({
      period: this.period,
      values: [],
    });

    this.previousValues.forEach(prevValue => {
      clonedTa.nextValue(prevValue);
    });

    this.result = clonedTa.nextValue(value) || null;
    return this.result;
  }

  async handleTick(value: number, date: Date) {
    const truncatedDate = new Date(date.toISOString().substring(0, 10));

    if (this.currentCandle && truncatedDate > this.currentCandle.datetime) {
      this.updateValue(this.currentCandle.close);
      this.currentCandle = null;
    }

    if (!this.currentCandle) {
      const candle = new Candle();
      candle.open = value;
      candle.high = value;
      candle.low = value;
      candle.close = value;
      candle.timespan = '1D';
      candle.datetime = truncatedDate;
      this.currentCandle = candle;
    } else {
      // Update the currentCandle
      this.currentCandle.close = value;

      this.currentCandle.high = Math.max(this.currentCandle.high, value);
      this.currentCandle.low = Math.min(this.currentCandle.low, value);
    }

    this.testValue(this.currentCandle.close);
  }
}

export default Indicator;
