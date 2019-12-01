import { getRepository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import Tick from './models/tick';
import Candle from './models/candle';
import MockMarket from './market/mock';
import Strategy from './strategy/example/ema';
import Simulation from './simulation';

export const resolvers = {
  Query: {
    tick: (_, { id }) => {
      return getRepository(Tick).findOne(id);
    },
    candles: _ => {
      return getRepository(Candle).find({
        order: {
          datetime: 'ASC',
        },
      });
    },
  },
  Mutation: {
    runSimulation: async (_, { startValue, startFiat, startDate, endDate }) => {
      let where = {};
      if (startDate && endDate) {
        where = {
          timestamp: Between(startDate, endDate),
        };
      } else if (startDate && !endDate) {
        where = {
          timestamp: MoreThanOrEqual(startDate),
        };
      } else if (!startDate && endDate) {
        where = {
          timestamp: LessThanOrEqual(endDate),
        };
      }

      const ticks = await getRepository(Tick).find({
        where,
        order: {
          timestamp: 'ASC',
        },
      });

      const market = new MockMarket({ accountValue: startValue, accountFiat: startFiat });
      const strategy = new Strategy(market);
      const simulation = new Simulation({ market, strategy });

      market.setTicks(ticks);

      await simulation.run();

      return simulation;
    },
  },
};
