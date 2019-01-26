import { getRepository } from 'typeorm';
import Tick from './models/tick';
import Candle from './models/candle';
import MockMarket from './market/mock';
import Strategy from './strategy/example/simple';
import Simulation from './simulation';

export const resolvers = {
  Query: {
    tick: (_, { id }) => {
      return getRepository(Tick).findOne(id);
    },
    candles: (_) => {
      return getRepository(Candle).find();
    }
  },
  Mutation: {
    runSimulation: async (_, { startDate, endDate, startValue }) => {
      const market = new MockMarket();
      const strategy = new Strategy(market);
      const simulation = new Simulation({ market, strategy });

      await simulation.run();

      const sim = {
        from: startDate,
        to: endDate,
        orders: simulation.orders,
        trades: simulation.trades,
      }

      return sim;
    },
  }
};



