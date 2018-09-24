import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
    };
  }

  handleClick() {
    console.log("handler in Square");
    this.setState({isClicked: true});
    this.props.onClick();
  }

  render () {


    return (
      <button
      className={this.state.isClicked ? "open" : "closed"}
      onClick={() => this.handleClick()}>
      {this.props.col}
      </button>
    );
  }
}

function CurrentSquare(props) {
  if (props.coord) {
      return <b>({props.coord[0]},{props.coord[1]})</b>;
  }
  return <b>(X,X)</b>;

}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currSquare: undefined,
    };
  }

  handleClick(c,r) {
    console.log("square("+c+","+r+")");
    this.setState({currSquare: [c,r]});

  }

  renderCol(r,dim) {
    // poor: making a list of integer so .map() can traverse
    var colIdx = [];
    for (var i=0; i < dim; i++){
      colIdx.push(i);
    }

    const col = colIdx.map((sq,c) => {
      return (
        <Square key={sq}
        col={c} row={r}
        onClick={()=>{this.handleClick(c,r)}}
        />);
    });

    return col;
  }

  renderRow(dim) {
    var rowIdx = [];
    for (var i=0; i<dim; i++ ) {
      rowIdx.push(i);
    }

    const row = rowIdx.map((row,i) => {
      return <div key={row}>{this.renderCol(i,dim)}</div>;
    });

    return row;
  }

  render() {
    const currSq = this.state.currSquare;

    return (
      <div>
      Board here
      <br/>
      <CurrentSquare coord={currSq} />
      {this.renderRow(10)}
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
