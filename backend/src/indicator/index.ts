import { min, reduce, initial } from 'lodash';
import * as TA from 'technicalindicators';
import Tick from '../models/tick';
import Candle from '../models/candle';


class Indicator {
  name: string;
  period: number;
  result: number = null;
  ta = null;
  previousValues: number[] = [];

  constructor(name: string, period: number) {
    this.name = name;
    this.period = period;
    this.ta = new TA[name.toUpperCase()]({
      period: period,
      values: [],
    });
  }

  // translateCandles(candles: Candle[]) {
  //   return reduce(candles, (data, candle) => {
  //     data.open.push(candle.open);
  //     data.close.push(candle.close);
  //     data.high.push(candle.high);
  //     data.low.push(candle.low);
  //     // data.volume.push(candle.volume);
  //     return data;
  //   }, {
  //     open: [],
  //     close: [],
  //     high: [],
  //     low: [],
  //     // volume: [],
  //   });
  // }

  // async handleTick(tick: Tick) {
  //   await this.updateCandles(tick);
  // }

  updateValue(value: number) {
    this.previousValues.push(value);
    // const marketData = this.translateCandles(this.candles);

    // this.ta = new TA.EMA({
    //   period: this.period,
    //   values: marketData.close,
    // })

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

  // async updateCandles(tick: Tick) {
  //   const date = new Date(tick.timestamp.toISOString().substring(0, 10));
  //   const value = tick.last;

  //   if (this.currentCandle && this.currentCandle.datetime < date) {
  //     await this.updateValue(this.currentCandle);
  //     // CurrentCandle is complete, updated with all the ticks of that date.
  //     this.currentCandle = null;
  //   }

  //   if (!this.currentCandle) {
  //     const candle = new Candle();
  //     candle.open = value;
  //     candle.high = value;
  //     candle.low = value;
  //     candle.close = value;
  //     candle.timespan = '1D';
  //     candle.datetime = date;
  //     this.currentCandle = candle;
  //     // this.candles.push(candle);
  //   }

  //   // Update the currentCandle
  //   this.currentCandle.close = value;

  //   this.currentCandle.high = Math.max(this.currentCandle.high, value);
  //   this.currentCandle.low = Math.min(this.currentCandle.low, value);
  //   this.updateIntermediateValue(this.currentCandle);
  // }
}

export default Indicator;
