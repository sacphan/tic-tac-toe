import React from 'react';
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
 
  class Board extends React.Component { 
    renderSquare(i) {
      
        return <Square HightLine={this.props.HightLine && this.props.HightLine.includes(i)} key={i} value={this.props.squares[i]} onClick={()=> this.props.onClick(i)} />;
      
      
    }
  
    render() {
      const boardSize = 3;
      let boards  = [];
      for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
          row.push(this.renderSquare(i * boardSize + j));
        }       
        boards.push(<div key={i} className="board-row">{row}</div>);
      }
  
      
      return (
        <div>
          <div className="status">{this.props.status}</div>
          {boards}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props)
    {
        super(props)
        this.state = {
          history: [{
            squares: Array(9).fill(null),
           
          }],
          stepNumber: 0,
          xIsNext:true,
          sortHistory: true
        }
    }
    handleClick(i)
    {
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length -1];
      const squares = current.squares.slice();
      //const stepNumber = history.length;
      if (calculateWinner(squares).Winner || squares[i])
      {
        return;
      }
    
      squares[i] =this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history:history.concat([{
          squares:squares,
         
        }]),
        stepNumber: this.state.stepNumber+1,
        xIsNext: !this.state.xIsNext
      })
   
    }
    jumpTo(step)
    {
      
        this.setState({
          stepNumber: step,
          xIsNext: step % 2 === 0
        })
    }
    sortHistory()
    {            
        this.setState({
          sortHistory: !this.state.sortHistory,                 
      })
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
     
     
       const calculateWinnerInfo = calculateWinner(current.squares);
      const winner = calculateWinnerInfo.Winner; 
      
      
      const moves = history.map((step,move) => {
        
        const row = Math.floor((move-1)/3);
        const col =  (move-1) % 3;
        const bold = move===this.state.stepNumber ? "bold" : "";
        const desc = move ? `Go to move #${move} [${row},${col}]` : 'Go to game start';
        return (
          <li key={move}>
            <button className={bold} onClick ={()=>this.jumpTo(move)}>{desc}</button>
          </li>
        );
      })
      if (!this.state.sortHistory)
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
        console.log(this.state.stepNumber)
        if (this.state.history.length === 10 && this.state.stepNumber==9)
        {
          status = 'Draw'
        }
        else
          status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares ={current.squares}  onClick ={(i)=> this.handleClick(i)} HightLine={calculateWinnerInfo.HightLine}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol><button onClick={()=>this.sortHistory()}>Sort</button></ol>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
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