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
    if (!this.state.isClicked) {
      this.props.onClick();
    }
  }

  render () {
    //const isClicked = this.state.isClicked;
    //var label = isClicked ? this.props.label : "X";
    //var label = this.props.label;

    const isClicked = this.props.isClicked;

    return (
      <button
      className={isClicked ? "open" : "closed"}
      onClick={() => this.handleClick()}>
      {this.props.label}
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
      dim: props.dim,
      currSquare: undefined,
      fieldmap: initFieldmap(8*8,10),
      clickmap: Array(8*8),
    };

  }


  handleClick(c,r) {
    const idx = this.getFieldIdx(c,r);
    var clickmap = this.state.clickmap;
    // do nothing if out of bound or button(c,r).isClick == true
    if  (idx<0 || clickmap[idx])
      return;


    const fieldmap = this.state.fieldmap;

    this.setState({currSquare: [c,r]});

    // count bombs
    if (fieldmap[idx] === 9) {
      console.log("you clicked on a bomb!");
      // TODO: delete later bc no point when game ends
      clickmap[idx] = true;
    }
    else {
      var nbomb = 0;
      //set clickmap
      clickmap[idx] = true;

      // count bombs
      var x,y;
      for (x=c-1;x<c+2;++x) {
        for (y=r-1;y<r+2;++y) {
          var i = this.getFieldIdx(x,y);
          if ( fieldmap[i] === 9) ++nbomb;
        }
      }
      fieldmap[this.getFieldIdx(c,r)]=nbomb;

      this.setState({
        fieldmap: fieldmap,
        clickmap: clickmap,
      });

      if (nbomb===0) {
        const c1=c-1, c2=c+1;
        const r1=r-1, r2=r+1;
        //console.log("("+c+","+r+") -- "+"("+c1+","+c2+") x ("+r1+","+r2+")");

        //console.log("");
        //console.log("("+c1+","+r1+") -- ("+c+","+r1+") -- ("+c2+","+r1+")");
        //console.log("("+c1+","+r+") -- ("+c+","+r+") -- ("+c2+","+r+")");
        //console.log("("+c1+","+r2+") -- ("+c+","+r2+") -- ("+c2+","+r2+")");
        this.handleClick(c1,r1); this.handleClick(c ,r1); this.handleClick(c2,r1);
        this.handleClick(c1,r ); /*this.handleClick(c,)*/ this.handleClick(c2,r );
        this.handleClick(c1,r2); this.handleClick(c ,r2); this.handleClick(c2,r2);
      }

    }

  }

  getFieldIdx(c,r) {
    //var idx=r*this.state.dim+c;
    if (c<0 || r<0 || c > 7 || r > 7)
      return -1;
    //var idx=r*this.state.dim+c;
    //console.log("("+c+","+r+") = "+idx)
    return (r*this.state.dim+c);
  }

  renderCol(r,dim) {
    // poor: making a list of integer so .map() can traverse
    var colIdx = [];
    for (var i=0; i < dim; i++){
      colIdx.push(i);
    }

    const fieldmap = this.state.fieldmap;
    const clickmap = this.state.clickmap;

    const col = colIdx.map((sq,c) => {
      const idx = this.getFieldIdx(c,r);
      const isClicked = clickmap[idx];
      return (
        <Square
        key={sq}
        col={c} row={r}
        onClick={()=>{this.handleClick(c,r)}}
        isClicked={isClicked}
        label={isClicked ? fieldmap[idx] : "X"}
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
  // set upp arrays
  for (var array=[], i=0; i<dim; ++i) array[i] = i;
  for (var fieldmap=[],k=0;k<dim;++k) fieldmap[k]=0;

  // randomise bombs
  var tmp, current, top = array.length;
  if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
  }

  // plant bombs
  for (var j=0;j<nbomb;++j) {
    var el = array[j];
    fieldmap[el] = 9;
  }

  // count bombs
  //idx equals (r*dim+c);
  /*const sq00=fieldmap((r-1)*dim+(c-1));
  const sq01=fieldmap((r-1)*dim+c);
  const sq02=fieldmap((r-1)*dim+(c+1));

  const sq10=fieldmap(r*dim+(c-1));
  //const sq11=fieldmap(r*dim+c);
  const sq12=fieldmap(r*dim+(c+1));

  const sq20=fieldmap((r+1)*dim+(c-1));
  const sq21=fieldmap((r+1)*dim+c);
  const sq22=fieldmap((r+1)*dim+c+1);*/

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
