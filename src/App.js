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
    //this.setState({isClicked: true});
    if (!this.state.isClicked) {
      this.props.onClick();
    }
  }

  render () {
    const isClicked = this.props.isClicked;

    const className = isClicked ? "open square" : "closed square";

    return (
      <button
      className={className}
      onClick={() => this.handleClick()}>
      {this.props.label}
      </button>
    );
  }
}

function MsgBoard(props) {
  return <b>{props.msg}</b>
  //if (props.coord) {
      //return <b>({props.coord[0]},{props.coord[1]})</b>;
  //}
  //return <b>(X,X)</b>;

}

class Board extends Component {
  constructor(props) {
    super(props);
    const dim = props.dim;
    const size = dim*dim;
    const nbomb = props.bomb;
    this.state = {
      dim: dim,
      nbomb: nbomb,
      fieldmap: initFieldmap(size,nbomb),
      clickmap: Array(size),
      exploded: false,
      win: false,
    };

  }

  // count no. of bombs around a square
  countBomb(c,r) {
    // Note: ok to iterate over square(c,r) bc we know it's not a bomb
    var nbomb = 0;
    const fieldmap = this.state.fieldmap;

    if (fieldmap[this.getFieldIdx(c,r)] === 9) {
      return 9;
    }
    for (var x=c-1;x<c+2;++x) {
      for (var y=r-1;y<r+2;++y) {
        var i = this.getFieldIdx(x,y);
        if (fieldmap[i] === 9) {
          ++nbomb;
        }
      }
    }
    return nbomb;
  }

  handleClick(c,r) {
    const idx = this.getFieldIdx(c,r);
    const clickmap = this.state.clickmap;
    // do nothing if
    // 1. out of bound
    // 2. button is already clicked
    // 3. a mine has exploded
    // 4. win
    if  (idx<0 || clickmap[idx] || this.state.exploded || this.state.win )
      return;

    const fieldmap = this.state.fieldmap;

    // if clicked on 9-square (a bomb)
    if (fieldmap[idx] === 9) {
      console.log("you clicked on a bomb!");
      // open all 9-squares (bomb squares)
      this.setState({
        clickmap: fieldmap.map((v,i) => {
          return (v===9) ? true : clickmap[i]; }),
        exploded: true,
        ends: true,
      });
    } else {
    // if clicked on x-square

      // set square clicked
      clickmap[idx] = true;

      // count no. of neighbouring bombs
      const nbomb = this.countBomb(c,r);
      fieldmap[idx] = nbomb;

      // update these states before recursing on neighbours
      this.setState({
          fieldmap: fieldmap,
          clickmap: clickmap,
      });

      // if square(c,r) is a 0-square, open its neighbours
      if (nbomb===0) {
        const c1=c-1, c2=c+1, r1=r-1, r2=r+1;
        this.handleClick(c1,r1); this.handleClick(c,r1 );  this.handleClick(c2,r1);
        this.handleClick(c1,r ); /*this.handleClick(c,r)*/ this.handleClick(c2,r );
        this.handleClick(c1,r2); this.handleClick(c,r2 );  this.handleClick(c2,r2);
      }

      // set state.win = true if all squares are clicked before explosion
      const nclick = countClickmap(this.state.clickmap)
      if (nclick === clickmap.length - this.state.nbomb) {
        this.setState({win: true});
      }
    }
  }

  // return index of square if col and row within bounds
  getFieldIdx(c,r) {
    const d = this.state.dim - 1;
    if (c<0 || r<0 || c > d || r > d)
      return -1;

    return (r*this.state.dim+c);
  }

  // return [col,row] from square[idx]
  getFieldCR(idx) {
    const dim = this.state.dim;
    var c = idx % dim;
    var r = (idx - c) / dim;

    return [c,r];
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
        label={isClicked ? fieldmap[idx] : ""}
        />);
    });

    return col;
  }

  renderBoard(dim) {
    var rowIdx = [];
    for (var i=0; i<dim; i++ ) {
      rowIdx.push(i);
    }

    // render a row
    const row = rowIdx.map((row,i) => {
      return (
        <div align="centre"className="board-row" key={row}>
          {this.renderCol(i,dim)}
        </div>
      );
    });

    return row;
  }

  render() {

    var msg = "Playing...";

    if (this.state.exploded) {
      msg = "You lost!";
    } else {
      if (this.state.win) {
        msg = "You won!";
      }
    }


    return (
      <div>
      <br/>
      <MsgBoard msg={msg} />
      {this.renderBoard(this.state.dim)}
      </div>
    );

  }

}

function countClickmap(clickmap) {

  var count = 0;

  for (var i=0; i<clickmap.length; ++i) {
      if (clickmap[i]) {
        count++;
      }
    }

    console.log("count: ",count);
    return count;

}
  //count click



function initFieldmap(size,nbomb) {
  // size = dim*dim
  // set upp arrays
  for (var array=[], i=0; i<size; ++i) array[i] = i;
  for (var fieldmap=[],k=0;k<size;++k) fieldmap[k]=0;

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
          Welcome to Minesweeper
        </p>
        <div>
          <Board dim="8" bomb="10"/>
        </div>
      </div>
    );
  }
}

export default App;
