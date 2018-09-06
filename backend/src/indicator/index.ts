import { min, reduce, initial } from 'lodash';
const talib = require('talib');
import Tick from '../models/tick';
import Candle from '../models/candle';


const Talib = (options) => {
  return new Promise(function(resolve, reject) {
    return talib.execute(options, (err, result) => {
      if (err) {
        reject(err);
      }
      const output: number = result.result.outReal[0];
      resolve(output);
    })
  });
};

class Indicator {
  name: string;
  period: number;
  result: number = null;
  currentCandle: Candle = null;
  candles: Candle[] = [];

  constructor(name: string, period: number) {
    this.name = name;
    this.period = period;
  }

  translateCandles(candles: Candle[]) {
    return reduce(candles, (data, candle) => {
      data.open.push(candle.open);
      data.close.push(candle.close);
      data.high.push(candle.high);
      data.low.push(candle.low);
      // data.volume.push(candle.volume);
      return data;
    }, {
      open: [],
      close: [],
      high: [],
      low: [],
      // volume: [],
    });
  }

  async handleTick(tick: Tick) {
    this.updateCandles(tick);

    if (this.candles.length === this.period) {
      // If we also use the current candle to calculate a minimum,
      // we also use the current price for checking the minimum,
      // meaning we can't simple check if the new price is below the minimum
      // const initialCandles = initial(this.candles);

      // const minimum = min(initialCandles.map(candle => candle.low));
      // this.result = minimum;


      const marketData = this.translateCandles(this.candles);
      const emaResult: number = <number> await Talib({
        name: 'EMA',
        startIdx: 0,
        endIdx: this.period,
        inReal: marketData.close,
        optInTimePeriod: this.period,
      });

      this.result = emaResult;
    }
  }

  updateCandles(tick: Tick) {
    const date = new Date(tick.timestamp.toISOString().substring(0, 10));
    const value = tick.last;

    if (!this.currentCandle || this.currentCandle.datetime < date) {
      const candle = new Candle();
      candle.open = value;
      candle.high = value;
      candle.low = value;
      candle.close = value;
      candle.timespan = '1D';
      candle.datetime = date;
      this.currentCandle = candle;
      this.candles.push(candle);
    }

    if (this.candles.length > this.period) {
      this.candles.shift();
    }

    // Update the currentCandle
    this.currentCandle.close = value;

    this.currentCandle.high = Math.max(this.currentCandle.high, value);
    this.currentCandle.low = Math.min(this.currentCandle.low, value);
  }
}

export default Indicator;
