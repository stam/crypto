const { GraphQLServer } = require('graphql-yoga');
const db = require('./models');

const typeDefs = `
  type Query {
    tick(id: ID!): Tick
  }
  type Tick {
    id: Int!
    last: Int
    timestamp: String
  }
`;

const resolvers = {
    Query: {
        tick: (_, { id }) => {
            return db.Tick.findById(id)
        },
    },
};

const server = new GraphQLServer({ typeDefs, resolvers });

db.sequelize
    .sync()
    .then(async function() {
      server.start(() => console.log('Server is running on localhost:4000'));
    })
    .catch(function(e) {
        throw new Error(e);
    });
