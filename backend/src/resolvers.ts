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
    runSimulation: async (_, { startValue, startFiat }) => {
      const market = new MockMarket({ accountValue: startValue, accountFiat: startFiat });
      const strategy = new Strategy(market);

      const simulation = new Simulation({ market, strategy });

      await simulation.run();

      const sim = {
        orders: [],
        trades: [],
      }

      return sim;
    },
  }
};



