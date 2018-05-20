const { GraphQLServer } = require('graphql-yoga');
const db = require('./models');

const typeDefs = `
  scalar Date
  type Query {
    tick(id: ID!): Tick
    candles: [Candle]
  }
  type Mutation {
    runSimulation: Simulation
  }
  type Simulation {
      from: Date
      to: Date
      orders: [Order]
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
        runSimulation: (_) => {
            const sim = {
                from: new Date(),
                to: new Date(),
                orders: [{
                    type: 'buy',
                    timestamp: new Date(),
                    quantity: 100,
                    price: 100,
                }, {
                    type: 'sell',
                    timestamp: new Date(),
                    quantity: 100,
                    price: 100,
                }]
            }
            return sim;
        }
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
