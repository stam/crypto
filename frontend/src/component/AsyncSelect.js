import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import Select from './Select';

@observer
class AsyncSelect extends Component {
  @observable options = [];
  @observable loading = false;

  static propTypes = {
    value: PropTypes.any,
    query: PropTypes.string.isRequired,
    getter: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = async () => {
    const { query, getter } = this.props;
    this.loading = true;
    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query {
          ${query}
        }`,
      }),
    });

    const { data } = await response.json();
    this.options = getter(data);
    this.loading = false;
  };

  render() {
    const { getter, query, ...selectProps } = this.props;
    return (
      <Select {...selectProps}>
        {this.loading ? (
          <option value={this.props.value}>Loading..</option>
        ) : (
          this.options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))
        )}
        }
      </Select>
    );
  }
}

export default AsyncSelect;
