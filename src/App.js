import React, { Component } from 'react';
import logo from './logo.svg';
import shockey from './shockey.svg';
import smiley from './smiley.svg';
import deady from './deady.svg';
import bomb from './bomb.svg';
import tile from './tile.svg';
import sq1 from './sq1.svg';
import sq2 from './sq2.svg';
import sq3 from './sq3.svg';
import sq4 from './sq4.svg';
import sq5 from './sq5.svg';
import sq6 from './sq6.svg';
import sq7 from './sq7.svg';
import sq8 from './sq8.svg';
import './App.css';
import LEDBoard from './LEDBoard.js'

function Square(props) {
    var className = "square open ";
    var sq = [sq1,sq2,sq3,sq4,sq5,sq6,sq7,sq8];

    var label, id = "";
    switch(props.label) {
      case 0:
        label = "";
        break;
      case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8:
        label = sq[props.label-1];
        break;
      case 9:
        label = bomb
        id = "bomb";
        break;
      case 10:
        label = bomb;
        id = "bomb";
        className += "gone "
        break;
      default:
        label = tile;
        className = "square"
    }

    // handle both left and right clicks
    function handleClick(e) {
      if (e.nativeEvent.which === 1) {
        props.onClick();
      } else if (e.nativeEvent.which === 3) {
        e.preventDefault();
        props.onRightClick();
      }
    }

    return (
      <button className={className} onClick={handleClick} onContextMenu={handleClick}>
        <img src={label} alt="" id={id} />
      </button>
    );
  }

function MsgBoard(props) {

  //render() {
    //const msg = this.props.msg;
    const msg = props.msg;

    var icon=shockey;
    if (msg==="1") {icon=deady;}
    if (msg==="2") {icon=smiley;}

    return (
        <button className="msgbutton" onClick={props.onClick}>
          <img src={icon} alt="shocked" />
        </button>
    );
  //}
}

class Board extends Component {

  renderCol(r,dim) {
    // poor: making a list of integer so .map() can traverse
    var colIdx = [];
    for (var i=0; i < dim; i++) colIdx.push(i);

    const fieldmap = this.props.fieldmap;
    const clickmap = this.props.clickmap;

    const col = colIdx.map((sq,c) => {
      const idx = r*dim+c;
      const isClicked = clickmap[idx];
      return (
        <Square key={sq}
        onClick={() => {this.props.onClick(c,r)}}
        onRightClick={() => {this.props.onRightClick(c,r)}}
        label={isClicked ? fieldmap[idx] : "" }
        />);
    });

    return col;
  }

  render() {
    const dim = this.props.dim;

    var rowIdx = [];
    for (var i=0; i < dim; i++ ) rowIdx.push(i);

    // render a row
    const row = rowIdx.map((item,i) => {
      return (
        <div align="centre" className="board-row" key={item}>
          {this.renderCol(i,dim)}
        </div>
      );
    });

    return row;
  }
}

class Game extends Component {
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
      ticker0: new Date(),
      ticker: 0,
    };

    this.resetGame = this.resetGame.bind(this);

  }

  resetGame() {
    const dim = this.state.dim;
    const size = dim*dim;
    const nbomb = this.state.nbomb;

    this.setState({
      fieldmap: initFieldmap(size,nbomb),
      clickmap: Array(size),
      exploded: false,
      win: false,
      ticker0: new Date(),
      ticker: 0,
    });

    this.stopTicker();
  }

  // count no. of bombs around a square
  countBomb(c,r) {
    var nbomb = 0;
    const fieldmap = this.state.fieldmap;

    if (fieldmap[this.getFieldIdx(c,r)] === 9) {
      return 9;
    }

    // ok to iterate over square(c,r) bc now we know it's not a bomb
    for (var x=c-1; x < c+2; ++x) {
      for (var y=r-1; y < r+2; ++y) {
        var i = this.getFieldIdx(x,y);
        if (fieldmap[i] === 9) ++nbomb;
      }
    }

    return nbomb;
  }

  // flag or unflag square
  handleRightClick(c,r) {
    var clickmap = this.state.clickmap;
    const idx = this.getFieldIdx(c,r);

    console.log("rightclicked: ("+c+","+r+")")
    //- if square is open, do nothing
    if (clickmap[idx]) {
      console.log("square open: do nothing");
      return;
    }

    console.log("square closed: do something");

    var fieldmap = this.state.fieldmap;
    // toggle set flag:
    //  11 - flagged
    //   0 - unclicked
    console.log("fieldmap("+c+","+r+"): " + fieldmap[idx]);

  }

  handleClick(c,r) {
    const idx = this.getFieldIdx(c,r);
    const clickmap = this.state.clickmap;
    // do nothing if
    // 1. out of bound
    // 2. button is already clicked
    // 3. a mine has been clicked (exploded)
    // 4. win
    if  (idx < 0 || clickmap[idx] || this.state.exploded || this.state.win ) {
      return;
    }

    // start stopwatch when first square is clicked
    if (countClickmap(clickmap) < 1) this.startTicker();

    const fieldmap = this.state.fieldmap;

    // if clicked 9-square (a mine), open all mines, set clicked square to 10
    if (fieldmap[idx] === 9) {
      fieldmap[idx] = 10;
      clickmap[idx] = true;
      this.setState({
        clickmap: fieldmap.map((v,i) => {
          return (v===9) ? true : clickmap[i]; }),
        exploded: true,
        fieldmap: fieldmap,
      });
      this.stopTicker();
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
        this.stopTicker();
      }
    }
  }

  startTicker() {
    this.setState({
      ticker0: new Date(),
    });

      this.timerID = setInterval(
        () => this.tick(),
        900
      );
  }

  stopTicker() {
    //console.log("stop ticker at " + this.state.ticker );
    clearInterval(this.timerID);
    this.setState({
    });
  }

  tick() {
    const t0 = this.state.ticker0.getTime();
    const t1 = (new Date()).getTime();
    const t = Math.ceil((t1-t0)/1000);

    this.setState({
      ticker: t,
    });
  }

  // return index of square if col and row within bounds
  getFieldIdx(c,r) {
    const d = this.state.dim - 1;
    if (c<0 || r<0 || c > d || r > d)
      return -1;

    return (r*this.state.dim+c);
  }

  render() {

    var msg = "0";

    if (this.state.exploded) {
      msg = "1";
    } else {
      if (this.state.win) {
        msg = "2";
      }
    }
    //console.log("msg1: "+msg);
        //<button className="tickerbutton">{this.state.ticker}</button>

    return (
      <div>
      <br/>
      <div className="scoreboard">
        <LEDBoard>3</LEDBoard>
        <MsgBoard onClick={() => this.resetGame()} msg={msg} />
        <LEDBoard>{this.state.ticker}</LEDBoard>
      </div>
      <Board
        dim={this.state.dim}
        fieldmap={this.state.fieldmap}
        clickmap={this.state.clickmap}
        onClick={(c,r) => this.handleClick(c,r)}
        onRightClick={(c,r) => this.handleRightClick(c,r)}
        />
      </div>
    );
  }

} // end class Game

function countClickmap(clickmap) {
  var count = 0;

  for (var i=0; i < clickmap.length; ++i) {
    if (clickmap[i]) count++;
  }

  return count;
}

function initFieldmap(size,nbomb) {
  // size = dim*dim
  // set up arrays

  for (var i=0, array=[], fieldmap=[]; i < size; ++i) {
    array[i] = i;
    fieldmap[i] = 0;
  }

  // randomise bombs
  var tmp, current, top = array.length;
  if (top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
  }

  // plant bombs
  for (var j=0; j < nbomb;++j) {
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
          <Game dim="9" bomb="10"/>
        </div>
      </div>
    );
  }
}

export default App;
