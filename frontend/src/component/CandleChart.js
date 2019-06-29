import React from 'react';
import PropTypes from 'prop-types';

import { scaleTime } from 'd3-scale';
import { utcDay } from 'd3-time';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { ChartCanvas, Chart } from 'react-stockcharts';
import {
  CrossHairCursor,
  MouseCoordinateX,
  CurrentCoordinate,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';
import { ema, wma, sma, tma } from 'react-stockcharts/lib/indicator';
import { CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series';
import { MovingAverageTooltip } from 'react-stockcharts/lib/tooltip';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { fitDimensions } from 'react-stockcharts/lib/helper';
import { last, timeIntervalBarWidth } from 'react-stockcharts/lib/utils';

import { observer } from 'mobx-react';
import OrderAnnotations from './OrderAnnotations';

class CandleStickChart extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    simulation: PropTypes.object.isRequired,
  };

  render() {
    const { width, height, data, ratio, simulation } = this.props;
    const xAccessor = d => d.date;
    const xExtents = [xAccessor(last(data)), xAccessor(data[0])];

    const emaA = ema()
      .options({
        windowSize: 14,
      })
      .merge((d, c) => {
        d.emaA = c;
      })
      .accessor(d => d.emaA);

    const emaB = ema()
      .options({
        windowSize: 7,
      })
      .merge((d, c) => {
        d.emaB = c;
      })
      .accessor(d => d.emaB);

    const calculatedData = emaA(emaB(data));

    return (
      <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        type="svg"
        seriesName="MSFT"
        data={calculatedData}
        xAccessor={xAccessor}
        xScale={scaleTime()}
        xExtents={xExtents}
      >
        <Chart id={1} yExtents={d => [d.high, d.low]}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />
          <YAxis axisAt="left" orient="left" ticks={5} />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
          {simulation.orders && <OrderAnnotations orders={simulation.orders} />}
          <MouseCoordinateY at="left" orient="left" displayFormat={format('.0f')} />
          <LineSeries yAccessor={emaA.accessor()} stroke={emaA.stroke()} />
          <LineSeries yAccessor={emaB.accessor()} stroke={emaB.stroke()} />
          <CurrentCoordinate yAccessor={emaA.accessor()} fill={emaA.stroke()} />
          <MovingAverageTooltip
            onClick={e => console.error(e)}
            origin={[20, 0]}
            options={[
              {
                yAccessor: emaA.accessor(),
                type: 'EMA',
                stroke: emaA.stroke(),
                windowSize: emaA.options().windowSize,
              },
              {
                yAccessor: emaB.accessor(),
                type: 'EMA',
                stroke: emaB.stroke(),
                windowSize: emaB.options().windowSize,
              },
            ]}
          />
          <CandlestickSeries width={timeIntervalBarWidth(utcDay)} />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

export default fitDimensions(observer(CandleStickChart));
