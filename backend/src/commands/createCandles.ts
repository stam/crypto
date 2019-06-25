import { createConnection } from 'typeorm';
import { each, has, values, chunk } from 'lodash';
import Tick from '../models/tick';
import Candle from '../models/candle';

async function generateCandles() {
  const connection = await createConnection();
  const ticks = await connection.getRepository(Tick).find({
    order: {
      timestamp: 'ASC',
    },
  });

  const result = {};
  each(ticks, (tick: Tick) => {
    const date = tick.timestamp.toISOString().substring(0, 10);
    const value = tick.last;

    if (!has(result, date)) {
      result[date] = {
        open: value,
        high: value,
        low: value,
        close: value,
        timespan: '1D',
        datetime: new Date(date) };
    }
    const candle = result[date];

    // ordered by timestamp, so we keep setting this (current = latest)
    candle.close = value;

    candle.high = Math.max(candle.high, value);
    candle.low = Math.min(candle.low, value);
  });

  // SQLite cannot handle > 999 variables, so split into chunks
  const insertChunks = chunk(values(result), 50);

  await connection.transaction(async manager => {
    const chunkPromises = insertChunks.map(chunk => (
      manager.insert(Candle, chunk)
    ));
    return Promise.all(chunkPromises);
  });

  console.info(`Candle generation success! ${values(result).length} candles created`);
}

generateCandles();

