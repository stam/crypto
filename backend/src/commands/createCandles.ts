import db from '../models';
import { each, has, values } from 'lodash';

async function generateCandles() {
  const ticks = await db.tick.findAll({
    attributes: [
      'timestamp',
      'last',
      [db.sequelize.fn('date', db.sequelize.col('timestamp')), 'date']
      // [db.sequelize.fn('date_trunc', 'day', db.sequelize.col('timestamp')), 'date']
    ],
    order: ['timestamp']
  });

  const result = {};
  each(ticks, tick => {
    let date = tick.get('date');
    let val = tick.get('last');
    if (!has(result, date)) {
      result[date] = { open: val, high: val, low: val, close: val, timespan: '1D', datetime: date };
    }
    const candle = result[date];

    // ordered by timestamp, so we keep setting this (current = latest)
    candle.close = val;

    candle.high = Math.max(candle.high, val);
    candle.low = Math.min(candle.low, val);
  });

  const bulkCreateResult = await db.candle.bulkCreate(values(result));
  console.log(`Candle generation success! ${bulkCreateResult.length} candles created`);
}

generateCandles();

