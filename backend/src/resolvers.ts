import { getRepository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import Tick from './models/tick';
import Candle from './models/candle';
import MockMarket from './market/mock';
import * as Strategies from './strategy';
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
    strategies: _ => {
      return Object.keys(Strategies);
    },
  },
  Mutation: {
    runSimulation: async (
      _,
      { startValue, startFiat, strategy: strategyName, startDate, endDate },
    ) => {
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

      const TargetStrat = Strategies[strategyName];
      const strategy = new TargetStrat(market);
      const simulation = new Simulation({ market, strategy });

      market.setTicks(ticks);

      await simulation.run();

      return simulation;
    },
  },
};
