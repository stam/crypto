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

class Trades extends Component {
  static propTypes = {
    simulation: PropTypes.object.isRequired,
  };

  formatDate = date => moment(date).format('YYYY-MM-DD HH:mm:ss');

  renderOrder(order) {
    return (
      <div key={order.timestamp + order.type}>
        {order.timestamp} {order.type} {order.price}
      </div>
    );
  }

  renderTrade = (trade, i) =>
    trade.buyDate && (
      <tr key={trade.buyDate + trade.sellPrice}>
        <td>{i}.</td>
        <td>{this.formatDate(trade.buyDate)}</td>
        <td>{trade.buyPrice}</td>
        <td>{trade.quantity}</td>
        <td>{trade.result}%</td>
        <td>{trade.sellPrice}</td>
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
          <tbody>{simulation.trades.map(this.renderTrade)}</tbody>
        </Table>
      </Container>
    );
  }
}

export default observer(Trades);
