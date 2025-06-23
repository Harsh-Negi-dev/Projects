const boardElement = document.getElementById('chessboard');
const statusElement = document.getElementById('turn-status');

const chessboard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const pieceSymbols = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let selectedSquare = null;
let currentTurn = 'white'; // 'white' = uppercase pieces

function renderChessboard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            const piece = chessboard[row][col];
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'white-square' : 'black-square');
            square.dataset.row = row;
            square.dataset.col = col;
            square.textContent = piece ? pieceSymbols[piece] : '';
            square.addEventListener('click', onSquareClick);
            boardElement.appendChild(square);
        }
    }
    if (selectedSquare) {
        const index = selectedSquare.row * 8 + selectedSquare.col;
        boardElement.children[index].classList.add('selected');
    }
}

function onSquareClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const clickedPiece = chessboard[row][col];

    if (selectedSquare) {
        const source = selectedSquare;
        const destination = { row, col };
        const moveWasSuccessful = attemptMove(source, destination);

        if (moveWasSuccessful) {
            currentTurn = currentTurn === 'white' ? 'black' : 'white';
        }

        selectedSquare = null;
        renderChessboard();
        statusElement.textContent = `${capitalize(currentTurn)}'s turn`;
        return;
    }

    // Selecting a piece
    if ((currentTurn === 'white' && isWhite(clickedPiece)) ||
        (currentTurn === 'black' && isBlack(clickedPiece))) {
        selectedSquare = { row, col };
        renderChessboard();
    }
}

function isWhite(piece) {
    return piece >= 'A' && piece <= 'Z';
}

function isBlack(piece) {
    return piece >= 'a' && piece <= 'z';
}

function isSquareEmpty(row, col) {
    return chessboard[row][col] === '';
}

function attemptMove(from, to) {
    const movingPiece = chessboard[from.row][from.col];
    const targetPiece = chessboard[to.row][to.col];

    if (!movingPiece) return false;
    if ((isWhite(movingPiece) && isWhite(targetPiece)) ||
        (isBlack(movingPiece) && isBlack(targetPiece))) return false;

    const moveIsValid = isLegalMove(movingPiece, from, to);
    if (!moveIsValid) {
        alert("Illegal move!");
        return false;
    }

    chessboard[to.row][to.col] = movingPiece;
    chessboard[from.row][from.col] = '';
    return true;
}

function isLegalMove(piece, from, to) {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    const absRow = Math.abs(rowDiff);
    const absCol = Math.abs(colDiff);

    const rowStep = Math.sign(rowDiff);
    const colStep = Math.sign(colDiff);

    switch (piece.toLowerCase()) {
        case 'p': {
            const forward = isWhite(piece) ? -1 : 1;
            const startRow = isWhite(piece) ? 6 : 1;

            if (colDiff === 0 && isSquareEmpty(to.row, to.col)) {
                if (rowDiff === forward) return true;
                if (from.row === startRow && rowDiff === 2 * forward &&
                    isSquareEmpty(from.row + forward, to.col)) return true;
            }

            if (absCol === 1 && rowDiff === forward && !isSquareEmpty(to.row, to.col)) return true;
            return false;
        }
        case 'r': {
            if (rowDiff !== 0 && colDiff !== 0) return false;
            return isPathClear(from, to);
        }
        case 'b': {
            if (absRow !== absCol) return false;
            return isPathClear(from, to);
        }
        case 'q': {
            if (absRow === absCol || rowDiff === 0 || colDiff === 0) {
                return isPathClear(from, to);
            }
            return false;
        }
        case 'n': {
            return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
        }
        case 'k': {
            return absRow <= 1 && absCol <= 1;
        }
    }
    return false;
}

function isPathClear(from, to) {
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);
    let row = from.row + rowStep;
    let col = from.col + colStep;

    while (row !== to.row || col !== to.col) {
        if (!isSquareEmpty(row, col)) return false;
        row += rowStep;
        col += colStep;
    }
    return true;
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

renderChessboard();