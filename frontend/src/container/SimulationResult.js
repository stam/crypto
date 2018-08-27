import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  grid-row: 10 / -1;
  grid-column: 1 / -1;
`;

const Table = styled.table``;

@observer
class SimulationResult extends Component {
  static propTypes = {
    simulation: PropTypes.object,
  };

  renderOrder(order, i) {
    return (
      <div key={order.timestamp + order.type}>
        {order.timestamp} {order.type} {order.price}
      </div>
    );
  }

  renderTrade(trade, i) {
    return (
      <tr key={trade.costBasis + trade.marketValue}>
        <td>{i}.</td>
        <td>{trade.costBasis}</td>
        <td>{trade.result}</td>
        <td>{trade.marketValue}</td>
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
              <th>Cost Basis</th>
              <th>Gain/Loss</th>
              <th>Market Value</th>
            </tr>
          </thead>
          <tbody>{simulation.trades.map(this.renderTrade)}</tbody>
        </Table>
      </Container>
    );
  }
}

export default SimulationResult;
