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
  823055,
850494,
801134,
865185,
878744,
910155,
911966,
887303,
910020,
872971,
861454,
826020,
796002,
800501,
714836,
732404,
724072,
723592,
726249,
752900,
698253,
700799,
708363,
716640,
731721,
695105,
706623,
707763,
800243,
825615,
825252,
856005,
826070,
817313,
836317,
855664,
897950,
900005,
902331,
934822,
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

  it('keeps track of its own history, 7 times the period', () => {
    const emaIndicator = new Indicator('EMA', 7);

    values.map((value, index) => {
      emaIndicator.updateValue(value);
    })

    expect(values).toHaveLength(49);
    expect(emaIndicator.previousValues).toEqual(values);

    emaIndicator.updateValue(974004);
    expect(emaIndicator.previousValues).toHaveLength(49);
    expect(emaIndicator.previousValues[0]).toBe(values[1]);
    expect(emaIndicator.previousValues[48]).toBe(974004);
  })

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

  describe('when handling strategy ticks', () => {
    it('creates new candles', () => {
      const emaIndicator = new Indicator('EMA', 7);
      emaIndicator.handleTick(5, new Date('2018-05-06 23:59:00'));

      expect(emaIndicator.currentCandle).not.toBeNull();
    });

    it('will not create a new candle when it is the same date', () => {
      const emaIndicator = new Indicator('EMA', 7);
      emaIndicator.handleTick(4, new Date('2018-05-06 23:58:00'));

      const candle = emaIndicator.currentCandle;

      emaIndicator.handleTick(5, new Date('2018-05-06 23:59:00'));

      expect(emaIndicator.currentCandle).toBe(candle);
    })

    it('creates new candles based on date', () => {
      const emaIndicator = new Indicator('EMA', 7);
      emaIndicator.handleTick(4, new Date('2018-05-06 23:00:00'));

      const candle = emaIndicator.currentCandle;

      emaIndicator.handleTick(5, new Date('2018-05-07 09:01:00'));

      expect(emaIndicator.currentCandle).not.toBe(candle);
    });

    it('always updates intermediate values', () => {
      const emaIndicator = new Indicator('EMA', 7);
      emaIndicator.testValue = jest.fn();

      emaIndicator.handleTick(4, new Date('2018-05-06 23:00:00'));
      emaIndicator.handleTick(5, new Date('2018-05-07 09:01:00'));
      emaIndicator.handleTick(6, new Date('2018-05-07 10:01:00'));

      expect(emaIndicator.testValue).toHaveBeenCalledTimes(3);
    });


    it('updates its value when a candle is done', () => {
      const emaIndicator = new Indicator('EMA', 7);
      emaIndicator.updateValue = jest.fn();

      emaIndicator.handleTick(4, new Date('2018-05-06 05:00:00'));
      emaIndicator.handleTick(4, new Date('2018-05-06 10:00:00'));
      emaIndicator.handleTick(4, new Date('2018-05-06 15:00:00'));
      expect(emaIndicator.updateValue).not.toHaveBeenCalled();

      emaIndicator.handleTick(5, new Date('2018-05-07 09:01:00'));
      expect(emaIndicator.updateValue).toHaveBeenCalled();

    });
  })
});
