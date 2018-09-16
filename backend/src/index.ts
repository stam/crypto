import { GraphQLServer } from 'graphql-yoga';
import { createConnection, getRepository } from 'typeorm';
import Tick from './models/tick';
import Candle from './models/candle';
import Strategy from './strategy/example/ema';
import Simulation from './simulation';

const typeDefs = `
  scalar Date
  type Query {
    tick(id: ID!): Tick
    candles: [Candle]
  }
  type Mutation {
    runSimulation(startDate: Date!, endDate: Date!, startValue: String!): Simulation
  }
  type Simulation {
    from: Date
    to: Date
    orders: [Order]
    trades: [Trade]
  }
  type Order {
    type: String
    date: Date
    quantity: Int
    price: Int
  }
  type Tick {
    id: Int!
    last: Int
    timestamp: Date
  }
  type Trade {
    buyPrice: Int
    sellPrice: Int
    buyDate: Date
    sellDate: Date
    result: Float
  }
  type Candle {
    id: Int
    open: Int
    close: Int
    high: Int
    low: Int
    datetime: Date
  }
`;

const resolvers = {
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
      const ticks = await getRepository(Tick).find({
        order: {
          timestamp: 'ASC',
        },
      });

      const simulation = new Simulation({ ticks, Strategy });

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

const server = new GraphQLServer({ typeDefs, resolvers });

const options = {
  endpoint: '/api',
  subscriptions: '/subscriptions',
  playground: '/playground',
};

createConnection().then(() => {
  server.start(options, () => console.log('Server is running on localhost:4000'));
});
