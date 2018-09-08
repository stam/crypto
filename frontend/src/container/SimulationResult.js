import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  grid-row: 10 / -1;
  grid-column: 2 / -1;
`;

const Table = styled.table`
  td {
    padding: 8px 16px;
  }
`;

class SimulationResult extends Component {
  static propTypes = {
    simulation: PropTypes.object.isRequired,
  };

  renderOrder(order) {
    return (
      <div key={order.timestamp + order.type}>
        {order.timestamp} {order.type} {order.price}
      </div>
    );
  }

  renderTrade(trade, i) {
    return (
      <tr key={trade.buyDate + trade.sellPrice}>
        <td>{i}.</td>
        <td>{trade.buyDate}</td>
        <td>{trade.buyPrice}</td>
        <td>{trade.result}%</td>
        <td>{trade.sellPrice}</td>
        <td>{trade.sellDate}</td>
      </tr>
    );
  }

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
      return (
        <Container>
          <h3>No simulation active</h3>
        </Container>
      );
    }
    return (
      <Container>
        <h3>Simulation result: Trades</h3>
        {/* <OrderContainer>
          {data && data.orders.map(this.renderOrder)}
        </OrderContainer> */}
        <Table>
          <thead>
            <tr>
              <th />
              <th>Buy Date</th>
              <th>Buy Price</th>
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

export default observer(SimulationResult);
