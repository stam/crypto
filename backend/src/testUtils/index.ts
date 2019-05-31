import { createConnection, getConnection, ConnectionOptions, getRepository } from 'typeorm';
import Tick from '../models/tick';

export async function ensureConnection () {
  try {
    getConnection();
  } catch (e) {
    const config = require(`${process.cwd()}/ormconfig.js`);
    await createConnection({
      ...(config as ConnectionOptions),
    });
  }
}

let tickIndex = 0;

export async function createTick(tickData) {
  const tickRepo = getRepository(Tick);

  const data = {
    symbol: 'BTCUSD',
    ask: 100,
    bid: 100,
    last: 100 + tickIndex,
    volume: 1200,
    main_volume: 5000,
    timestamp: new Date(`2019-01-01 15:00:${tickIndex}`),
    ...tickData,
  }

  tickIndex += 1;

  const tick = new Tick();
  Object.assign(tick, data);

  return tickRepo.save(tick);
}

export async function cleanup() {
  const tickRepo = getRepository(Tick);

  return tickRepo.clear();
}
