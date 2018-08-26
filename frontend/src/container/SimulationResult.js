import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  grid-row: 10 / -1;
  grid-column: 1 / -1;
`;

@observer
class SimulationResult extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  renderOrder(order, i) {
    return (
      <li key={order.timestamp + order.type}>
        {order.timestamp} {order.type} {order.price}
      </li>
    );
  }

  render() {
    const { data } = this.props;
    return (
      <Container>
        {!data && <p>No simulation active</p>}
        {data && <ul>{data.orders.map(this.renderOrder)}</ul>}
      </Container>
    );
  }
}

export default SimulationResult;
