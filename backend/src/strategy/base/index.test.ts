import Strategy from '.';
import Market from '../../market';
import { ticks } from '../../simulation/index.test';

const market = new Market({ saveOrder: null});

describe('The default Strategy', () => {
  let strategy;

  beforeEach(() => {
    market.buy = jest.fn();
    market.sell = jest.fn();
    strategy = new Strategy(market);
  })

  // it('creates assets', () => {
  //   strategy.handleTick(ticks[0]);

  //   expect(strategy.assets.length).toBe(1);
  //   expect(strategy.assets[0].quantity).toBe(1);
  // })

  it('creates buy and sell signals', () => {
    strategy.handleTick(ticks[0]);
    strategy.handleTick(ticks[1]);

    expect(market.buy).toHaveBeenCalledTimes(1);
    expect(market.sell).toHaveBeenCalledTimes(1);

    expect(market.buy).toHaveBeenCalledWith(ticks[0], 0);
    expect(market.sell).toHaveBeenCalledWith(ticks[1], 1);
  });

  // it('removes its assets after selling', () => {
  //   strategy.handleTick(ticks[0]);
  //   strategy.handleTick(ticks[1]);

  //   expect(strategy.assets.length).toBe(0);
  // })
});
