import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import Header from '../component/Header';
import SimulationForm from './SimulationForm';
import CoinValue from './CoinValue';
import SimulationResult from './SimulationResult';
import Trades from './Trades';
import Simulation from '../store/Simulation';

const Main = styled.main`
  display: grid;
  padding: 1rem 1rem;

  background: linear-gradient(#1f2640, #070a17);
  color: white;
  height: 100vh;
  width: 100vw;

  grid-template-rows: repeat(16, 1fr);
  grid-template-columns: repeat(8, 1fr);
  grid-row-gap: 1rem;
  grid-column-gap: 2rem;
`;

@observer
class App extends Component {
  componentWillMount() {
    this.simulation = new Simulation();
  }

  render() {
    return (
      <Main>
        <Header>Crypto</Header>
        <SimulationForm simulation={this.simulation} />
        <SimulationResult simulation={this.simulation} />
        <Trades simulation={this.simulation} />
        <CoinValue simulation={this.simulation} />
      </Main>
    );
  }
}

export default App;
