import React from 'react';
import { zipObject } from 'lodash';
import PropTypes from 'prop-types';
import { Annotate, SvgPathAnnotation, buyPath, sellPath } from 'react-stockcharts/lib/annotation';
import { observer } from 'mobx-react';

const sellProps = {
  fill: '#FF0000',
  path: sellPath,
  tooltip: 'Sell',
};

const buyProps = {
  fill: '#006517',
  path: buyPath,
  tooltip: 'Buy',
};

const toDateString = d => d.date.toISOString().substring(0, 10);

class OrderAnnotations extends React.Component {
  static propTypes = {
    orders: PropTypes.object.isRequired,
  };

  filterCandleOnOrderDate(orders) {
    return candle => {
      const orderDates = orders.map(o => o.date.substring(0, 10));
      return orderDates.includes(toDateString(candle));
    };
  }

  generateOrderPriceSelector(orders) {
    const orderDates = orders.map(o => o.date.substring(0, 10));
    const mappedOrders = zipObject(orderDates, orders);

    return ({ yScale, datum }) => {
      const date = toDateString(datum);
      const order = mappedOrders[date];
      return yScale(parseInt(order.resultPrice / 100, 10));
    };
  }

  render() {
    const { orders } = this.props;
    const buyOrders = orders.filter(o => o.side === 'buy');
    const sellOrders = orders.filter(o => o.side === 'sell');

    const enhancedBuyProps = {
      ...buyProps,
      y: this.generateOrderPriceSelector(buyOrders),
    };
    const enhancedSellProps = {
      ...sellProps,
      y: this.generateOrderPriceSelector(sellOrders),
    };

    return (
      <React.Fragment>
        <Annotate
          with={SvgPathAnnotation}
          when={this.filterCandleOnOrderDate(buyOrders)}
          usingProps={enhancedBuyProps}
        />
        <Annotate
          with={SvgPathAnnotation}
          when={this.filterCandleOnOrderDate(sellOrders)}
          usingProps={enhancedSellProps}
        />
      </React.Fragment>
    );
  }
}

export default observer(OrderAnnotations);
