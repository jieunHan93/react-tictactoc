import React, { useState, useEffect } from 'react';
import './Game.css';

const Square = ({ value, onClick }) => {
    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    );
}

const Board = ({squares, onClick}) => {

    const renderSquare = (i) => {
        return (
            <Square
                value={squares[i]}
                onClick={() => onClick(i)}
            />);
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );

}

const Game = () => {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [status, setStatus] = useState("");

    const handleClick = (i) => {
        const hist = history.slice(0, stepNumber + 1);
        const current = hist[hist.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";

        setHistory(hist.concat([{ squares }]));
        setStepNumber(hist.length);
        setXIsNext(!xIsNext);
    }

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }


    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <span key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </span>
        );
    });


    let current = history[stepNumber];
    let winner = calculateWinner(current.squares);
    useEffect(() => {
        current = history[stepNumber];
        winner = calculateWinner(current.squares);
        if (winner) {
            setStatus("Winner: " + winner);
        } else if (isBoardFull(current.squares)) {
            setStatus("Draw!!");
        } else {
            setStatus("Next player: " + (xIsNext ? "X" : "O"));
        }
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={i => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div>{moves}</div>
            </div>
        </div>
    );

}

export default Game;

const calculateWinner = (squares) => {
    const possibleLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    // go over all possibly winning lines and check if they consist of only X's/only O's
    for (let i = 0; i < possibleLines.length; i++) {
        const [a, b, c] = possibleLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

const isBoardFull = (squares) => {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] == null) {
            return false;
        }
    }
    return true;
}