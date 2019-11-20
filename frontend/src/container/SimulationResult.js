import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  grid-row: 10 / -1;
  grid-column: 1 / 3;
`;

class Trades extends Component {
  static propTypes = {
    simulation: PropTypes.object.isRequired,
  };

  render() {
    const { simulation } = this.props;

    if (simulation.loading || !simulation.orders) {
      return <Container />;
    }
    return (
      <Container>
        <p>Start balance: {simulation.startBalance}</p>
        <p>End balance: {simulation.endBalance}</p>
        <p>Result: {simulation.profit}%</p>
      </Container>
    );
  }
}

export default observer(Trades);
