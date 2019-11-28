import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment';
import styled from 'styled-components';

const Container = styled.div`
  overflow-y: scroll;
  grid-row: 10 / -1;
  grid-column: 3 / -1;

  h3 {
    opacity: 0.4;
  }
`;

const Table = styled.table`
  td {
    padding: 8px 16px;
  }
`;

const RightAlignTd = styled.td`
  text-align: right;
`;

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

  renderTrade = (trade, i, firstOfDate) =>
    trade.buyDate && (
      <tr key={trade.buyDate + trade.sellPrice}>
        <td>{i}.</td>
        <RightAlignTd>
          {firstOfDate ? this.formatDate(trade.buyDate) : this.formatTime(trade.buyDate)}
        </RightAlignTd>
        <td>{this.formatPrice(trade.buyPrice)}</td>
        <td>{trade.quantity}</td>
        <RightAlignTd>{trade.result}%</RightAlignTd>
        <td>{this.formatPrice(trade.sellPrice)}</td>
        <td>{trade.sellDate && this.formatDate(trade.sellDate)}</td>
      </tr>
    );

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

    let lastDate = null;
    return (
      <Container>
        <h3>Trades:</h3>
        <Table>
          <thead>
            <tr>
              <th />
              <th>Buy Date</th>
              <th>Buy Price</th>
              <th>Quantity</th>
              <th>Result</th>
              <th>Sell Price</th>
              <th>Sell Date</th>
            </tr>
          </thead>
          <tbody>
            {simulation.trades.map((t, i) => {
              const date = t.sellDate.substr(0, 10);

              let firstOfDate = false;
              if (!lastDate) {
                firstOfDate = true;
              } else {
                if (lastDate < date) {
                  firstOfDate = true;
                }
              }
              lastDate = date;
              return this.renderTrade(t, i, firstOfDate);
            })}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default observer(Trades);
