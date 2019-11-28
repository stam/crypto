import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment';
import styled from 'styled-components';
import {
  COLOR_SOFT,
  COLOR_POSITIVE,
  COLOR_NEGATIVE,
  COLOR_NEUTRAL,
  COLOR_EMPHASIS,
} from '../utils/colors';

const Container = styled.div`
  overflow-y: scroll;
  grid-row: 10 / -1;
  grid-column: 3 / -1;

  h3 {
    color: ${COLOR_SOFT};
  }
`;

const Table = styled.table`
  td {
    color: ${COLOR_NEUTRAL};
    padding: 8px 16px;
  }
`;

const EmphasisTd = styled.td`
  color: ${COLOR_EMPHASIS} !important;
`;
const THead = styled.thead`
  color: ${COLOR_SOFT};
  text-align: right;
`;

const ValueTd = styled.td`
  color: ${props => (props.profit ? COLOR_POSITIVE : COLOR_NEGATIVE)} !important;
`;

const RightAlignTd = styled.td`
  text-align: right;
`;

let lastDate = {};
const isFirstOfDate = (key, date) => {
  let firstOfDate = false;
  if (!lastDate[key]) {
    firstOfDate = true;
  } else {
    if (lastDate[key] < date) {
      firstOfDate = true;
    }
  }
  lastDate[key] = date;
  return firstOfDate;
};

class Trades extends Component {
  static propTypes = {
    simulation: PropTypes.object.isRequired,
  };

  formatDate = date => moment(date).format('YYYY-MM-DD HH:mm:ss');
  formatTime = date => moment(date).format('HH:mm:ss');
  formatPrice = price => Math.round(price / 100).toLocaleString();

  renderOrder(order) {
    return (
      <div key={order.timestamp + order.type}>
        {order.timestamp} {order.type} {order.price}
      </div>
    );
  }

  renderTrade = (trade, i) => {
    if (!trade.buyDate) {
      return null;
    }
    const buyDate = moment(trade.buyDate).format('YYYY-MM-DD HH:mm:ss');
    const sellDate = moment(trade.sellDate).format('YYYY-MM-DD HH:mm:ss');
    const firstOfBuyDate = isFirstOfDate('buy', buyDate.substr(0, 10));
    const firstOfSellDate = isFirstOfDate('sell', sellDate.substr(0, 10));

    return (
      <tr key={trade.buyDate + trade.sellPrice}>
        <td>{i}.</td>
        <RightAlignTd>{firstOfBuyDate ? buyDate : this.formatTime(trade.buyDate)}</RightAlignTd>
        <EmphasisTd>{this.formatPrice(trade.buyPrice)}</EmphasisTd>
        <td>{trade.quantity}</td>
        <ValueTd profit={trade.result > 100}>{trade.result}%</ValueTd>
        <EmphasisTd>{this.formatPrice(trade.sellPrice)}</EmphasisTd>
        <RightAlignTd>
          {trade.sellDate && (firstOfSellDate ? sellDate : this.formatTime(trade.sellDate))}
        </RightAlignTd>
      </tr>
    );
  };

  render() {
    const { simulation } = this.props;

    if (simulation.loading) {
      return (
        <Container>
          <h3>Loading...</h3>
        </Container>
      );
    }
    if (!simulation.orders) {
      return <Container />;
    }

    lastDate = {};
    return (
      <Container>
        <Table>
          <THead>
            <tr>
              <th />
              <th>Buy Date</th>
              <th>Buy Price</th>
              <th>Quantity</th>
              <th>Result</th>
              <th>Sell Price</th>
              <th>Sell Date</th>
            </tr>
          </THead>
          <tbody>{simulation.trades.map(this.renderTrade)}</tbody>
        </Table>
      </Container>
    );
  }
}

export default observer(Trades);
