import React from 'react';
import './LEDBoard.css';
import led0 from "./led0.svg";
import led1 from "./led1.svg";
import led2 from "./led2.svg";
import led3 from "./led3.svg";
import led4 from "./led4.svg";
import led5 from "./led5.svg";
import led6 from "./led6.svg";
import led7 from "./led7.svg";
import led8 from "./led8.svg";
import led9 from "./led9.svg";
import neg from "./led-.svg";

class LEDBoard extends React.Component {
  render () {
    const number = this.props.children;
    var led = [led0,led1,led2,led3,led4,led5,led6,led7,led8,led9]
    var panel = [led[0],led[3],led[2]];

    if (number > 999) {
      panel = [led9, led9, led9];
    }

    panel[0] = led[(Math.floor(number/100)%10)];
    panel[1] = led[(Math.floor(number/10)%10)];
    panel[2] = led[number%10];

    // handles negative numbers until 99
    if (number < 0 ) {
      panel[0] = neg;
      const number2 = -number;
      panel[1] = led[(Math.floor(number2/10)%10)];
      panel[2] = led[(number2%10)];
      if (number < 99) {
        panel [neg,led9,led9];
      }
    }

    return (
      <button className="ledboard">
        <img src={panel[0]} alt="" />
        <img src={panel[1]} alt="" />
        <img src={panel[2]} alt="" />
      </button>
    );
  }
}

export default LEDBoard
