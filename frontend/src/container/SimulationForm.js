import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '../component/Button';

const Form = styled.form`
  grid-row: 2 / 9;
  grid-column: 1 / 2;

  display: flex;
  flex-direction: column;
`;

@observer
class SimulationForm extends Component {
  static propTypes = {
    simulation: PropTypes.object.isRequired,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.simulation.fetch();
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="toolbar">
        <h3>Simulate</h3>
        <Button>Run</Button>
      </Form>
    );
  }
}

export default SimulationForm;
