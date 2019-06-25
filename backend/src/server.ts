import { GraphQLServer } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import { importSchema } from 'graphql-import';
import * as path from 'path';

import { resolvers } from './resolvers';

export const startServer = async () => {
  const typeDefs = importSchema(path.join(__dirname, './schema.graphql'));
  const server = new GraphQLServer({ typeDefs, resolvers });

  const options = {
    endpoint: '/api',
    subscriptions: '/subscriptions',
    playground: '/playground',
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  };

  const connection = await createConnection();
  const app = await server.start(options);

  console.info('Server is running on localhost:4000')

  return app;
}



