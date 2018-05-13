import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    componentWillMount() {
        fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: '{ candles { id open close low high } }' }),
        }).then(res => res.json()).then(res => {console.log('res', res)});
    }
    render() {
        return (
            <div className="App">
                Fetching data
            </div>
        );
    }
}

export default App;
