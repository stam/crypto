import { request } from 'graphql-request';

import { startServer } from './server';
import Simulation from './simulation';

const mockMarketConstructor = jest.fn();

jest.mock('./market/mock', () => ({
  default: class Market {
    constructor(...args) {
      mockMarketConstructor(...args);
    }
  }
}))

describe('The server', () => {
  let getHost;

  beforeAll(async () => {
    const app = await startServer();
    const { port } = app.address();

    getHost = () => `http://127.0.0.1:${port}/api`;

    Simulation.prototype.run = jest.fn();
  });

  beforeEach(() => {
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
    return request(getHost(), params);
  })


  describe('when running a simulation', () => {
    it('creates a simulation class and feeds it the startValues', async () => {
      expect(Simulation.prototype.run).toHaveBeenCalled();
    });

    it('creates a market with the given fiat and value', () => {
      expect(mockMarketConstructor).toHaveBeenCalledWith(
        { accountFiat: 2000, accountValue: 0 }
      );
    });
  });
});
