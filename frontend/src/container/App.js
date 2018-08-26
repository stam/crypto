import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { observable } from 'mobx';

import Header from '../component/Header';
import SimulationForm from './SimulationForm';
import CoinValue from './CoinValue';
import SimulationResult from './SimulationResult';

const Main = styled.main`
  display: grid;
  padding: 16px;
  height: 100vh;
  width: 100vw;
  font-family: system-ui;

  grid-template-rows: repeat(16, 1fr);
  grid-template-columns: repeat(8, 1fr);
  grid-row-gap: 8px;
  grid-column-gap: 8px;
`;

@observer
class App extends Component {
  @observable simulation;

  setSimulation = simulation => {
    this.simulation = simulation;
  };

  render() {
    return (
      <Main>
        <Header>Crypto</Header>
        <SimulationForm setSimulation={this.setSimulation} />
        <CoinValue />
        <SimulationResult data={this.simulation} />
      </Main>
    );
  }
}

export default App;
