import React, { useEffect, useState } from "react";
import "./TicTacToe.css";
import circle_icon from "../Assets/circle.png";
import cross_icon from "../Assets/cross.png";

export default function TicTacToe() {
  let [state, setState] = useState(0);
  let [count, setCount] = useState(0);
  let [position, setPosition] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  let [queue, setQueue] = useState([]);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    socket.onmessage = (message) => {
      console.log(message);
    };

    socket.onclose = () => {
      console.log("WebSocket Client Disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  const toggle = (e, x, y) => {
    if (state) {
      return;
    }

    if (count % 2 === 0) {
      SetImageOnCoordinates(e, x, y, cross_icon, "x");
    } else {
      SetImageOnCoordinates(e, x, y, circle_icon, "o");
    }
  };
  function SetImageOnCoordinates(e, x, y, image, posVal) {
    e.target.innerHTML = `<img src='${image}'>`;
    const existingPosition = [...position];
    if (existingPosition[x][y] !== "") {
      return;
    }
    removeFirst();

    existingPosition[x][y] = posVal;
    const newqueue = [...queue, { x, y, e }];
    if (newqueue.length >= 6) {
      newqueue[0].e.target.className =
        newqueue[0].e.target.className + " shake";
    }
    console.log("queueadded");
    setQueue(newqueue);
    setPosition(existingPosition);
    setCount(++count);
    console.log("checkwinoutside");
    checkWin(x, y, e);
  }
  function checkWin(x, y, e) {
    let maxRow = position.length;
    let maxCol = position[0].length;
    let d_string = position[x][y];
    let isWin = false;

    for (let i = 0; i < maxRow; i++) {
      let consecutiveRow = 0;
      let consecutiveCol = 0;
      for (let j = 0; j < maxCol; j++) {
        if (position[i][j] === d_string) {
          consecutiveRow++;
          if (consecutiveRow === 3) {
            isWin = true;
            break;
          }
        }
        if (position[j][i] === d_string) {
          consecutiveCol++;
          if (consecutiveCol === 3) {
            isWin = true;
            break;
          }
        }
      }
    }
    let diagnolLeftToRight = 0;
    let diagnolRightToLeft = 0;

    for (let j = 0; j < maxCol; j++) {
      if (position[j][j] === d_string) {
        diagnolLeftToRight++;
        if (diagnolLeftToRight === 3) {
          isWin = true;
          break;
        }
      }
      if (position[j][2 - j] === d_string) {
        diagnolRightToLeft++;
        if (diagnolRightToLeft === 3) {
          isWin = true;
          break;
        }
      }
    }
    if (isWin) {
      setState(1);
      setTimeout(() => alert(position[x][y].toUpperCase() + " Won"), 100);
    }
  }
  function removeFirst() {
    console.log(queue.length);
    if (queue.length === 6) {
      let { x, y, e } = queue.shift();

      setQueue([...queue]);
      e.target.innerHTML = ``;
      e.target.className = "boxes";
      let newPosition = position;
      newPosition[x][y] = "";
      setPosition(newPosition);
    }
  }
  function redirectToPage(){
    
  }
  return (
    <div className="container">
      <h1 className="title">
        Tic Tac Toe <span>Moves : {count} </span>
      </h1>
      <button onClick={e=>redirectToPage(e)}> Play with your friends</button>
      <div className="board">
        <div className="row1">
          <div className="boxes" onClick={(e) => toggle(e, 0, 0)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 1, 0)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 2, 0)}></div>
        </div>
        <div className="row2">
          <div className="boxes" onClick={(e) => toggle(e, 0, 1)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 1, 1)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 2, 1)}></div>
        </div>
        <div className="row3">
          <div className="boxes" onClick={(e) => toggle(e, 0, 2)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 1, 2)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 2, 2)}></div>
        </div>
      </div>
      <button className="reset">Reset</button>
    </div>
  );
}
