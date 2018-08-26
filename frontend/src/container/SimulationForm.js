import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
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
  @observable.ref data;

  static propTypes = {
    setSimulation: PropTypes.func.isRequired,
  };

  handleSubmit = e => {
    e.preventDefault();
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation {
          runSimulation(
            startDate: "2018-01-01",
            endDate: "2018-12-31",
            startValue: "7000USD"
          ) {
            from
            to
            orders {
              timestamp
              type
              quantity
              price
            }
            trades {
              costBasis
              marketValue
              result
            }
          }
      }`,
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.props.setSimulation(res.data.runSimulation);
      });
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
