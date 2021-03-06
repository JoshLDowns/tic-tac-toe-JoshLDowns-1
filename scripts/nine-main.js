//variable declaration
let winningArrays = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let player = 'x';
let playerXName = 'X';
let playerOName = 'O';
let onePlayer = false;

let boards = Array.from(document.getElementsByClassName('board'));
let cells = Array.from(document.getElementsByClassName('cell'));
let textUpdate = document.getElementById('status-update');
let onePlayerStart = document.getElementById('one-player');
let twoPlayerStart = document.getElementById('two-player');

let boardReference = {};
let fullBoard = {
    0: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    1: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    2: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    3: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    4: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    5: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    6: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    7: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
    8: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false }
}

let regBoard = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };

for (let i = 0; i < 9; i++) {
    boardReference[i] = cells.splice(0, 9);
}
//event listeners
onePlayerStart.addEventListener('click', ()=>{
    onePlayer = true;
    start();
});
twoPlayerStart.addEventListener('click', start)
//starts function
function start() {
    boardReference[4].forEach((cell) => cell.addEventListener('click', clicked));
    boards[4].style.opacity = '1';
    boards[4].style.backgroundColor = '#f0f0f0';
    onePlayerStart.disabled = true;
    twoPlayerStart.disabled = true;
    textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
}

//all basic game logic on click event
function clicked() {
    //sets board look to inactive in case there was turn previous that enabled all squares
    boards.forEach((board) => {
        board.style.opacity = '.25';
        board.style.backgroundColor = 'lightGray';
        if ('finished' in fullBoard[boards.indexOf(board)]) {
            board.style.opacity = '1';
            board.style.backgroundColor = '#f0f0f0';
        }
    });
    //prepares current board to be left, adds text, and declare variables for various logic checks
    cells.forEach((cell) => cell.removeEventListener('click', clicked))
    let currentBoard = event.target.id[0];
    let nextBoard = event.target.id[2];
    fullBoard[currentBoard][nextBoard] = player;
    let values = Object.values(fullBoard[currentBoard]);
    if (!values.includes(false)) {
        fullBoard[currentBoard].finished = true;
    }
    event.target.textContent = player.toUpperCase();
    event.target.removeEventListener('click', clicked);
    //checks if there is a win in local board
    let win = checkWin(buildBoardState(fullBoard[currentBoard]), player, currentBoard);
    if (win === true) {
        //updates the full board with player move if they won the local board
        regBoard[currentBoard] = player;
        boardReference[currentBoard].forEach((cell) => {
            cell.removeEventListener('click', clicked);
            cell.style.opacity = '0';
        });
        boards[currentBoard].style.display = 'block';
        boards[currentBoard].textContent = player.toUpperCase();
        boards[currentBoard].style.opacity = '1';
        boards[currentBoard].style.backgroundColor = '#f0f0f0';
        fullBoard[currentBoard].finished = true;
        //checks if player won on global board
        let fullWin = checkWin(buildBoardState(regBoard), player, undefined);
        if (fullWin === true) {
            return textUpdate.textContent = `${player === 'x' ? playerXName : playerOName} WINS!!!`;
        } else {
            //checks if board being moved to is full
            if ('finished' in fullBoard[nextBoard]) {
                boards.forEach((board) => {
                    if (!('finished' in fullBoard[boards.indexOf(board)])) {
                        boardReference[boards.indexOf(board)].forEach((cell) => {
                            if (fullBoard[boards.indexOf(board)][boardReference[boards.indexOf(board)].indexOf(cell)] === false)
                                cell.addEventListener('click', clicked)
                        });
                        board.style.opacity = '1';
                        board.style.backgroundColor = '#f0f0f0';
                    }
                })
                if (onePlayer === false) {
                    player = player === 'x' ? 'o' : 'x';
                    return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
                } else {
                    return aiTurn(nextBoard);
                }
                //updates boards for next turn
            } else {
                boardReference[nextBoard].forEach((cell) => {
                    if (fullBoard[nextBoard][boardReference[nextBoard].indexOf(cell)] === false)
                        cell.addEventListener('click', clicked)
                });
                boards[nextBoard].style.opacity = '1';
                boards[nextBoard].style.backgroundColor = '#f0f0f0';

                if (onePlayer === false) {
                    player = player === 'x' ? 'o' : 'x';
                    return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
                } else {
                    return aiTurn(nextBoard);
                }
            }
        }
    } else {

        //checks if board being moved to is full
        if ('finished' in fullBoard[nextBoard]) {
            boards.forEach((board) => {
                if (!('finished' in fullBoard[boards.indexOf(board)])) {
                    boardReference[boards.indexOf(board)].forEach((cell) => {
                        if (fullBoard[boards.indexOf(board)][boardReference[boards.indexOf(board)].indexOf(cell)] === false)
                            cell.addEventListener('click', clicked)
                    });
                    board.style.opacity = '1';
                    board.style.backgroundColor = '#f0f0f0';
                }
            })
            if (onePlayer === false) {
                player = player === 'x' ? 'o' : 'x';
                return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
            } else {
                return aiTurn(nextBoard);
            }
        } else {
            //updates boards for next turn
            boardReference[currentBoard].forEach((cell) => cell.removeEventListener('click', clicked));
            boards[currentBoard].style.opacity = '.25';
            boards[currentBoard].style.backgroundColor = 'lightGray';
            if ('finished' in fullBoard[currentBoard]) {
                boards[currentBoard].style.opacity = '1';
                boards[currentBoard].style.backgroundColor = '#f0f0f0';
            }
            boardReference[nextBoard].forEach((cell) => {
                if (fullBoard[nextBoard][boardReference[nextBoard].indexOf(cell)] === false)
                    cell.addEventListener('click', clicked)
            });
            boards[nextBoard].style.opacity = '1';
            boards[nextBoard].style.backgroundColor = '#f0f0f0';

            if (onePlayer === false) {
                player = player === 'x' ? 'o' : 'x';
                return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
            } else {
                return aiTurn(nextBoard);
            }
        }
    }
}

//turn functions for ai
function aiTurn(nextBoard) {
    let postFullBoard = false;
    player = player === 'x' ? 'o' : 'x';
    let aiMove = makeMove(fullBoard, buildBoardState(fullBoard[nextBoard]), player, fullBoard[nextBoard].finished === true?true:false);
    console.log(aiMove)
    if (aiMove.length === 2) {
        postFullBoard = true;
        nextBoard = aiMove[0];
        aiMove = aiMove[1];
    }
    let nextPlayerBoard = aiMove;
    fullBoard[nextBoard][aiMove] = player;
    let nextValues = Object.values(fullBoard[nextBoard]);
    if (!nextValues.includes(false)) {
        fullBoard[nextBoard].finished = true;
    }
    boardReference[nextBoard][aiMove].textContent = player.toUpperCase();
    boardReference[nextBoard][aiMove].removeEventListener('click', clicked);
    let aiWin = checkWin(buildBoardState(fullBoard[nextBoard]), player, nextBoard);

    if (aiWin === true) {
        //updates the full board with player move if they won the local board
        regBoard[nextBoard] = player;
        boardReference[nextBoard].forEach((cell) => {
            cell.removeEventListener('click', clicked);
            cell.style.opacity = '0';
        });
        boards[nextBoard].style.display = 'block';
        boards[nextBoard].textContent = player.toUpperCase();
        boards[nextBoard].style.opacity = '1';
        boards[nextBoard].style.backgroundColor = '#f0f0f0';
        fullBoard[nextBoard].finished = true;
        //checks if player won on global board
        let aiFullWin = checkWin(buildBoardState(regBoard), player, undefined);
        if (aiFullWin === true) {
            return textUpdate.textContent = `${player === 'x' ? playerXName : playerOName} WINS!!!`;
        } else {
            //checks if board being moved to is full
            if ('finished' in fullBoard[nextPlayerBoard]) {
                boards.forEach((board) => {
                    if (!('finished' in fullBoard[boards.indexOf(board)])) {
                        boardReference[boards.indexOf(board)].forEach((cell) => {
                            if (fullBoard[boards.indexOf(board)][boardReference[boards.indexOf(board)].indexOf(cell)] === false)
                                cell.addEventListener('click', clicked)
                        });
                        board.style.opacity = '1';
                        board.style.backgroundColor = '#f0f0f0';
                    }
                })
            } else {
                boardReference[nextPlayerBoard].forEach((cell) => {
                    if (fullBoard[nextPlayerBoard][boardReference[nextPlayerBoard].indexOf(cell)] === false)
                        cell.addEventListener('click', clicked)
                });
                boards[nextPlayerBoard].style.opacity = '1';
                boards[nextPlayerBoard].style.backgroundColor = '#f0f0f0';

                player = player === 'x' ? 'o' : 'x';
                return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
            }
        }
    } else {

        //checks if board being moved to is full
        if ('finished' in fullBoard[nextPlayerBoard]) {
            boards.forEach((board) => {
                if (!('finished' in fullBoard[boards.indexOf(board)])) {
                    boardReference[boards.indexOf(board)].forEach((cell) => {
                        if (fullBoard[boards.indexOf(board)][boardReference[boards.indexOf(board)].indexOf(cell)] === false)
                            cell.addEventListener('click', clicked)
                    });
                    board.style.opacity = '1';
                    board.style.backgroundColor = '#f0f0f0';
                }
            })
            player = player === 'x' ? 'o' : 'x';
            return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
        } else {
            //updates boards for next turn
            boardReference[nextBoard].forEach((cell) => cell.removeEventListener('click', clicked));
            boards[nextBoard].style.opacity = '.25';
            boards[nextBoard].style.backgroundColor = 'lightGray';
            if (postFullBoard === true) {
                cells.forEach((cell) => cell.removeEventListener('click', clicked));
                boards.forEach((board)=>{
                    board.style.opacity = '.25';
                    board.style.backgroundColor = 'lightGray';
                });
                postFullBoard = false;
            }
            if ('finished' in fullBoard[nextBoard]) {
                boards[nextBoard].style.opacity = '1';
                boards[nextBoard].style.backgroundColor = '#f0f0f0';
            }
            boardReference[nextPlayerBoard].forEach((cell) => {
                if (fullBoard[nextPlayerBoard][boardReference[nextPlayerBoard].indexOf(cell)] === false)
                    cell.addEventListener('click', clicked)
            });
            boards[nextPlayerBoard].style.opacity = '1';
            boards[nextPlayerBoard].style.backgroundColor = '#f0f0f0';

            player = player === 'x' ? 'o' : 'x';
            return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
        }
    }
}

//checks if player has a win in current board, or in the global board
function checkWin(boardState, currentPlayer, boardNum) {
    let player = currentPlayer === 'x' ? 'playerX' : 'playerO';
    for (let win of winningArrays) {
        let winCount = 0;
        for (let coordinate of win) {
            if (boardState[player].includes(coordinate)) {
                winCount += 1;
            }
        }
        if (winCount >= 3) {
            if (boardNum !== undefined) {
                for (let coordinate of win) {
                    boardReference[boardNum][coordinate].style.backgroundColor = 'darkgray'
                }
                return true;
            } else {
                for (let coordinate of win) {
                    boards[coordinate].style.backgroundColor = 'darkgray'
                }
                return true;
            }
        }
    }
    return false;
}

function checkDraw() {
    let finishedCount = 0;
    for (let board in fullBoard) {
        if ('finished' in board) {
            finishedCount += 1
        }
    }
    return finishedCount===8?true:false;
}
