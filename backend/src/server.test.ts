import { request } from 'graphql-request';
import { map } from 'lodash';

import { startServer } from './server';
import Simulation from './simulation';

describe('The server', () => {
  let getHost;

  beforeAll(async () => {
    const app = await startServer();
    const { port } = app.address();

    getHost = () => `http://127.0.0.1:${port}/api`;

    Simulation.prototype.run = jest.fn();
  });

  describe('when running a simulation', async () => {
    it('it creates a simulation class and feeds it the startValues', async () => {
      const params = `mutation {
  runSimulation(startFiat: 2000, startValue: 0) {
    orders {
      date
      type
      quantity
      price
    }
  }
}`;
      await request(getHost(), params);

      expect(Simulation.prototype.run).toHaveBeenCalled();
    });
  });
});
