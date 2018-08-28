import { GraphQLServer } from 'graphql-yoga';
import { createConnection } from 'typeorm';
// import db from './db';
import Strategy from './strategy/forking';
import Simulation from './simulation';

const db = {};
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
    timestamp: Date
    quantity: Int
    price: Int
  }
  type Tick {
    id: Int!
    last: Int
    timestamp: Date
  }
  type Trade {
    costBasis: Int
    marketValue: Int
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
      return db.tick.findById(id)
    },
    candles: (_) => {
      return db.candle.findAll();
    }
  },
  Mutation: {
    runSimulation: async (_, { startDate, endDate, startValue }) => {
      const ticks = await db.tick.findAll({
        order: ['timestamp'],
      });

      const simulation = new Simulation({ ticks, Strategy });

      simulation.run();

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

db.sequelize
  .authenticate()
  .then(async function() {
    server.start(options, () => console.log('Server is running on localhost:4000'));
  })
  .catch(function(e) {
      throw new Error(e);
  });
