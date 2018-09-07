import React from 'react';
import PropTypes from 'prop-types';

import { scaleTime } from 'd3-scale';
import { utcDay } from 'd3-time';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { zipObject } from 'lodash';

import { ChartCanvas, Chart } from 'react-stockcharts';
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { fitDimensions } from 'react-stockcharts/lib/helper';
import { last, timeIntervalBarWidth } from 'react-stockcharts/lib/utils';

import {
  Annotate,
  SvgPathAnnotation,
  buyPath,
  sellPath,
} from 'react-stockcharts/lib/annotation';
import { observer } from 'mobx-react';

const shortAnnotationProps = {
  y: ({ yScale, datum }) => yScale(datum.high),
  fill: '#FF0000',
  path: sellPath,
  tooltip: 'Go short',
};

const SellAnnotations = props => {
  const toDateString = d => d.date.toISOString().substring(0, 10);
  const orderDates = props.orders.map(o => o.date.substring(0, 10));

  const mappedOrders = zipObject(orderDates, props.orders);
  const validDate = candle => orderDates.includes(toDateString(candle));

  const shortAnnotationProps = {
    y: ({ yScale, datum }) => {
      const date = toDateString(datum);
      const order = mappedOrders[date];
      return yScale(parseInt(order.price / 100));
    },
    fill: '#FF0000',
    path: sellPath,
    tooltip: 'Go short',
  };

  return (
    <Annotate
      {...props}
      with={SvgPathAnnotation}
      when={validDate}
      usingProps={shortAnnotationProps}
    />
  );
};

const BuyAnnotations = props => {
  const toDateString = d => d.date.toISOString().substring(0, 10);
  const orderDates = props.orders.map(o => o.date.substring(0, 10));

  const mappedOrders = zipObject(orderDates, props.orders);
  const validDate = candle => orderDates.includes(toDateString(candle));

  const longAnnotationProps = {
    y: ({ yScale, datum }) => {
      const date = toDateString(datum);
      const order = mappedOrders[date];
      return yScale(parseInt(order.price / 100));
    },
    fill: '#006517',
    path: buyPath,
    tooltip: 'Go long',
  };

  return (
    <Annotate
      {...props}
      with={SvgPathAnnotation}
      when={validDate}
      usingProps={longAnnotationProps}
    />
  );
};

@fitDimensions
@observer
export default class CandleStickChart extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    simulation: PropTypes.object.isRequired,
  };

  render() {
    const { width, height, data, ratio, simulation } = this.props;
    const xAccessor = d => d.date;
    const xExtents = [xAccessor(last(data)), xAccessor(data[0])];

    return (
      <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        type="svg"
        seriesName="MSFT"
        data={data}
        xAccessor={xAccessor}
        xScale={scaleTime()}
        xExtents={xExtents}
      >
        <Chart id={1} yExtents={d => [6000, 11000]}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />
          <YAxis axisAt="left" orient="left" ticks={5} />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%Y-%m-%d')}
          />
          {simulation.orders && (
            <BuyAnnotations
              orders={simulation.orders.filter(o => o.type === 'buy')}
            />
          )}
          {simulation.orders && (
            <SellAnnotations
              orders={simulation.orders.filter(o => o.type === 'sell')}
            />
          )}

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format('.0f')}
          />
          <CandlestickSeries width={timeIntervalBarWidth(utcDay)} />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}
