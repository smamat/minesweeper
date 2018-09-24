import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Square extends Component {
  render () {
    return (<button>{this.props.col}</button>);
  }
}

class Board extends Component {

  renderCol(dim) {
    // poor: making a list of integer so .map() can traverse
    var colIdx = [];
    for (var i=0; i < dim; i++){
      colIdx.push(i);
    }

    const col = colIdx.map((sq,i) => {
      return <Square key={sq} col={i}/>;
    });

    return col;
  }

  renderRow(dim) {
    var rowIdx = [];
    for (var i=0; i<dim; i++ ) {
      rowIdx.push(i);
    }

    const row = rowIdx.map((row,i) => {
      return <div key={row}>{this.renderCol(dim)}</div>;
    });

    return row;
  }

  render() {
    return (
      <div>
      Board here
      {this.renderRow(5)}
      </div>
    );

  }

}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <Board/>
        </div>
      </div>
    );
  }
}

export default App;
