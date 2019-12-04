import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  constructor(props) {
    // super指代父类中的构造函数，即React.Component【super在调用之前是不能使用this,原因是：如果使用，则使用对象有可能拿不到父类的属性值，从而报一些不可预知的错误】
    // 执行super(props); 可以使基类React.Component初始化this.props
    // 如果直接写super()或者不写constructor的话，也可以在组件中使用this.props；原因：react在组件实例化的时候，同时会给实例设置一遍props
    // 但不写的话，super调用一直到构造函数结束之前，this.props依然是未定义的，所以在使用this.props.xxx会报错
    super(props);
    this.state = {
      value: null
    }
  }

  render() {
    if (this.props.highlight) { // 处理高亮
      return (
        // <button className="square" onClick={() => this.setState({value: 'X'})}>
        <button className="square more" onClick={() => this.props.onClick()}>
          {this.props.value}
          {/* {this.state.value} */}
        </button>
      );
    } else {
      return (
        // <button className="square" onClick={() => this.setState({value: 'X'})}>
        <button className="square" onClick={() => this.props.onClick()}>
          {this.props.value}
          {/* {this.state.value} */}
        </button>
      );
    }

  }
}

// square类也可以写成函数组件  结构更加简单 如下：
// function Square(props) {
//   return (
//     <button className='square' onClick={props.onClick}>
//       {props.value}
//     </button>
//   )
//  }

class Board extends React.Component {

  renderSquare(i) {
    // return <Square value={i += 1} />;
    return <Square highlight={this.props.line && this.props.line.includes(i)} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  // handleClick(i) {
  //   // 这里不直接对源数据进行处理的好处：1、简化复杂功能 2、追踪数据变化 3、确定在react中何时重新渲染
  //   const squares =this.state.squares.slice()
  //   // 当已经产生赢家或者当前格子已被填上
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O'
  //   this.setState({
  //     squares:squares,
  //     xIsNext: !this.state.xIsNext
  //   })
  // }

  render() {
    // const winner = calculateWinner(this.state.squares)
    // let status
    // if (winner) {
    //   status = 'Winner' + winner
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }
    const list = []
    for (let index = 0; index < 3; index++) {
      const item = []
      for (let temp = 3 * index; temp < 3 * index + 3; temp++) {
        item.push(this.renderSquare(temp))
      }
      list.push(<div className="board-row" key={index}>{item}</div>)
    }

    return (
      <div>
        {list}
        {/* <div className="status">{status}</div> */}
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coordinate: []
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    // 这里不直接对源数据进行处理的好处：1、简化复杂功能 2、追踪数据变化 3、确定在react中何时重新渲染
    const squares = current.squares.slice()
    const coordinate = {
      0: [1, 1],
      1: [1, 2],
      2: [1, 3],
      3: [2, 1],
      4: [2, 2],
      5: [2, 3],
      6: [3, 1],
      7: [3, 2],
      8: [3, 3],
    }
    // 当已经产生赢家或者当前格子已被填上
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares:squares,
        coordinate: coordinate[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 === 0)
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves =history.map((step, move) => {
      const coordinate = history[move].coordinate
      // const desc = move ? 'Go to move #' + move : 'Go to game start'
      const desc = move ? 'Go to move #' : 'Go to game start'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}{move ? <b>{move}</b> : ''}{move ? `--[${coordinate}]` : ''}
          </button>
        </li>
      )
    })
    let status
    if (winner) {
      status = 'Winner is :' + winner.split('-')[0]
    } else if (this.state.stepNumber === 9) {
      status = '平局'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => {this.handleClick(i)}}
          line={winner ? winner.split('-')[1] : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
      return `${squares[a]}-${lines[i]}`;
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
