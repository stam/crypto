import { uniqueId, reduce } from 'lodash';
import * as talib from 'talib';

import Tick from '../models/tick';


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
  result: number;
  previousTicks: Tick[] = [];

  constructor(name: string, period: number) {
    this.name = name;
    this.period = period;
  }

  translateTicks(ticks: Tick[]) {
    return reduce(ticks, (data, tick) => {
      data.open.push(tick.last);
      data.close.push(tick.last);
      data.high.push(tick.last);
      data.low.push(tick.last);
      data.volume.push(tick.main_volume);
      return data;
    }, {
      open: [],
      close: [],
      high: [],
      low: [],
      volume: [],
    });
  }

  async handleTick(tick: Tick) {
    this.previousTicks.push(tick);

    if (this.previousTicks.length > this.period) {
      this.previousTicks.shift();
    }

    if (this.previousTicks.length === this.period) {
      const marketData = this.translateTicks(this.previousTicks);

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
}

export default Indicator;
