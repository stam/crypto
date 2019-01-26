import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from './resolvers';
import { createConnection } from 'typeorm';

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

export const startServer = async () => {
  const server = new GraphQLServer({ typeDefs, resolvers });

  const options = {
    endpoint: '/api',
    subscriptions: '/subscriptions',
    playground: '/playground',
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  };

  await createConnection();
  const app = await server.start(options);

  console.log('Server is running on localhost:4000')

  return app;
}



