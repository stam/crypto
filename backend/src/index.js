const { GraphQLServer } = require('graphql-yoga');
const db = require('./models');

const typeDefs = `
  scalar Date
  type Query {
    tick(id: ID!): Tick
  }
  type Tick {
    id: Int!
    last: Int
    timestamp: Date
  }
`;

const resolvers = {
    Query: {
        tick: (_, { id }) => {
            return db.tick.findById(id)
        },
    },
};

const server = new GraphQLServer({ typeDefs, resolvers });

const options = {
    endpoint: '/graphql',
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
