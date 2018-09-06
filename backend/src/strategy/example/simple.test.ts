import Strategy from './simple';
import Market from '../../market';
import { ticks } from '../../simulation/index.test';

const market = new Market({ saveOrder: null});

describe('The simple Strategy', () => {
  let strategy;

  beforeEach(() => {
    market.buy = jest.fn();
    market.sell = jest.fn();
    strategy = new Strategy(market);
  })

  it('creates buy and sell signals', () => {
    strategy.handleTick(ticks[0]);
    strategy.handleTick(ticks[1]);

    expect(market.buy).toHaveBeenCalledTimes(1);
    expect(market.sell).toHaveBeenCalledTimes(1);

    expect(market.buy).toHaveBeenCalledWith(ticks[0], 0);
    expect(market.sell).toHaveBeenCalledWith(ticks[1], 1);
  });
});
