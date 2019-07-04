import Indicator from '.';
import * as TA from 'technicalindicators';

const values = [
  1030748,
  962644,
  962912,
  901575,
  964205,
  933945,
  935627,
  // Intermediate value
  924967,

  860124,
];

it('The TA lib supports rolling indicator calculations', () => {
  const ta = new TA.EMA({
    period: 7,
    values: [],
  });

  expect(ta.result).toEqual([]);

  let result;

  ta.nextValue(values[0]);
  ta.nextValue(values[1]);
  ta.nextValue(values[2]);
  ta.nextValue(values[3]);
  ta.nextValue(values[4]);
  result = ta.nextValue(values[5]);

  expect(result).toBeUndefined();

  result = ta.nextValue(values[6]);
  expect(Math.round(result)).toBe(955951);

  result = ta.nextValue(values[8]);
  expect(Math.round(result)).toBe(931994);
});

describe('An indicator', () => {
  it('will calculate a result based on candles', async () => {
    const emaIndicator = new Indicator('EMA', 7);

    emaIndicator.updateValue(values[0]);
    emaIndicator.updateValue(values[1]);
    emaIndicator.updateValue(values[2]);
    emaIndicator.updateValue(values[3]);
    emaIndicator.updateValue(values[4]);
    emaIndicator.updateValue(values[5]);

    expect(emaIndicator.result).toBe(null);

    emaIndicator.updateValue(values[6]);
    expect(Math.round(emaIndicator.result)).toBe(955951);

    emaIndicator.updateValue(values[8]);
    expect(Math.round(emaIndicator.result)).toBe(931994);
  });

  it('calculates intermediate values', () => {
    const emaIndicator = new Indicator('EMA', 7);

    emaIndicator.updateValue(values[0]);
    emaIndicator.updateValue(values[1]);
    emaIndicator.updateValue(values[2]);
    emaIndicator.updateValue(values[3]);
    emaIndicator.updateValue(values[4]);
    emaIndicator.updateValue(values[5]);

    expect(emaIndicator.result).toBe(null);

    emaIndicator.updateValue(values[6]);
    expect(Math.round(emaIndicator.result)).toBe(955951);

    // Note the previous test:
    // We feed value[7] to the indicator (as a testValue),
    // and it should NOT alter the chain:
    // updateValue w/ values[8] should act like values[7] was never added.
    const testValue = emaIndicator.testValue(values[7]);
    expect(Math.round(testValue)).toBe(948205);

    emaIndicator.updateValue(values[8]);
    expect(Math.round(emaIndicator.result)).toBe(931994);
  });
});
