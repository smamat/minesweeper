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
    // TODO: ignore click if square is open
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

    /*for (var ra=[],i=0;i<40;++i) ra[i]=i;
    ra = shuffle(ra);
    */
    // shuffle(dimension,no. of bomb)
    //var ra = initFieldmap(8*8,10);


    this.state = {
      dim: props.dim,
      currSquare: undefined,
      fieldmap: initFieldmap(8*8,10),
    };
  console.log(this.state.fieldmap);
  }


  handleClick(c,r) {
    const fieldmap = this.state.fieldmap;
    this.setState({currSquare: [c,r]});
    if (this.state.fieldmap[this.getFieldIdx(c,r)] === 9) {
      console.log("you clicked on a bomb!");
    }

    var idx=this.getFieldIdx(0,-1);
    console.log("idx: "+idx+"val: "+fieldmap[idx]);
  }

  getFieldIdx(c,r) {
    console.log("square: "+c+","+r);
    var idx=r*this.state.dim+c;
    console.log("dim: "+this.state.dim+" idx: "+idx);
    return idx;
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
      {this.renderRow(8)}
      </div>
    );

  }

}

function initFieldmap(dim,nbomb) {
  for (var array=[], i=0; i<dim; ++i) {
    array[i] = i;
  }
  for (var fieldmap=[],k=0;k<dim;++k) fieldmap[k]=0;

  var tmp, current, top = array.length;
  if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
  }

  for (var j=0;j<nbomb;++j) {
    var el = array[j];
    fieldmap[el] = 9;
  }

  return fieldmap;
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
          <Board dim="8"/>
        </div>
      </div>
    );
  }
}

export default App;
