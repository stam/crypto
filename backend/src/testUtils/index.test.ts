import { createTick, cleanup } from '.';
import { ensureConnection } from '../testUtils';
import { getRepository } from 'typeorm';
import Tick from '../models/tick';

describe('The test utils', () => {
  it('should be able to create ticks', async () => {
    await ensureConnection();
    await getRepository(Tick).clear();
    await createTick({
      last: 99,
    });

    const ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });

    expect(ticks.length).toBe(1);
  });

  it('should be able to cleanup all data', async() => {
    await ensureConnection();

    await createTick({
      last: 99,
    });

    await cleanup();

    const ticks = await getRepository(Tick).find({
      order: {
        timestamp: 'ASC',
      },
    });

    expect(ticks.length).toBe(0);

  })
});
