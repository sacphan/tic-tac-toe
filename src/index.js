import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props)  {

      const classname = props.HightLine ? "square squareHightLine":"square"
      return (
        <button className={classname} onClick={props.onClick}>
          {props.value} 
        </button>
      );
  
  }
 
  function Board(props) { 
    const renderSquare = (i) =>{      
        return <Square HightLine={props.HightLine && props.HightLine.includes(i)} key={i} value={props.squares[i]} onClick={()=> props.onClick(i)} />;     
    } 
      const boardSize = 3;
      let boards  = [];
      for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
          row.push(renderSquare(i * boardSize + j));
        }       
        boards.push(<div key={i} className="board-row">{row}</div>);  
      } 
      return (
        <div>
          <div className="status">{props.status}</div>
          {boards}
        </div>
      );
    
  }
  
  function Game(props)  {
    
    const [historys,setHistorys] = useState([{squares: Array(9).fill(null)}])
    const [stepNumber,setStepNumber] = useState(0);
    const [xIsNext,setxIsNext] = useState(true);
    const [sortHistory,setsortHistory] = useState(true);

    const handleClick = (i) =>
    {
      const history = historys.slice(0,stepNumber + 1);
      const current = history[history.length -1];
      const squares = current.squares.slice();
      //const stepNumber = history.length;
      if (calculateWinner(squares).Winner || squares[i])
      {
        return;
      }
    
      squares[i] =xIsNext ? 'X' : 'O';
      setHistorys(history.concat([{
        squares:squares}]));
        setStepNumber( stepNumber+1);
        setxIsNext(!xIsNext);   
    }
    const jumpTo = (step) =>
    {
        setStepNumber(step);
        setxIsNext(step % 2 === 0);
        
    }
    const sortHistoryFunc = () =>
    {         
      setsortHistory(!sortHistory)     
    }
    
      const history = historys;
      const current = history[stepNumber];
     
     
       const calculateWinnerInfo = calculateWinner(current.squares);
      const winner = calculateWinnerInfo.Winner; 
      
      
      const moves = history.map((step,move) => {
        
        const row = Math.floor((move-1)/3);
        const col =  (move-1) % 3;
        const bold = move===stepNumber ? "bold" : "";
        const desc = move ? `Go to move #${move} [${row},${col}]` : 'Go to game start';
        return (
          <li key={move}>
            <button className={bold} onClick ={()=>jumpTo(move)}>{desc}</button>
          </li>
        );
      })
      if (!sortHistory)
      {
        moves.reverse();
      }
      let status;
      if (winner)
      {
        status = `Winner: ${winner}` 
      }
      else  
      {
        
        if (history.length === 10 && stepNumber==9)
        {
          status = 'Draw'
        }
        else
          status = `Next player: ${xIsNext ? "X" : "O"}`;
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares ={current.squares}  onClick ={(i)=> handleClick(i)} HightLine={calculateWinnerInfo.HightLine}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol><button onClick={()=>sortHistoryFunc()}>Sort</button></ol>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          Winner: squares[a],
          HightLine:lines[i]
        };
      }
    }
    return {
      Winner: null,
      HightLine:null
    };
  }