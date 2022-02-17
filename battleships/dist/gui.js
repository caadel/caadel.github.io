const currentPlayerDisplay = document.body.appendChild(createElement('h1', 'info-display'));
const infoDisplay = document.body.appendChild(createElement('h3', 'info-display'));
const interactables = {
    player1Board: HTMLElement.prototype,
    player1SetupBoard: HTMLElement.prototype,
    player2Board: HTMLElement.prototype,
    player2SetupBoard: HTMLElement.prototype,
};
function init() {
    const gameArea = document.body.appendChild(createElement('main', 'game-area'));
    interactables.player1Board = gameArea.appendChild(createElement('div', 'board'));
    interactables.player2Board = gameArea.appendChild(createElement('div', 'board'));
    const setupArea = gameArea.appendChild(createElement('div', 'setup-area'));
    interactables.player1SetupBoard = setupArea.appendChild(createElement('div', 'setup-board'));
    interactables.player2SetupBoard = setupArea.appendChild(createElement('div', 'setup-board'));
    populateBoard(interactables.player1SetupBoard);
    populateBoard(interactables.player1Board);
    populateBoard(interactables.player2Board);
    populateBoard(interactables.player2SetupBoard);
    const instructionTitle = createElement('h2', 'info-display');
    instructionTitle.innerText = 'Instructions';
    const instructions1 = createElement('div', 'info-display', 'instructions');
    instructions1.innerHTML = `<strong>When placing:</strong> right-click to rotate the ship, click to place it`;
    const instructions2 = createElement('div', 'info-display', 'instructions');
    instructions2.innerHTML = `<strong>During firing:</strong> click to fire!`;
    const shipsTitle = createElement('h3', 'info-display');
    shipsTitle.innerText = 'Ship lengths';
    const shipsInstructions = createElement('div', 'info-display', 'instructions');
    shipsInstructions.innerHTML = `Carrier: 5, Battleship: 4, Cruiser: 3, Submarine: 3, Destroyer: 2`;
    document.body.append(instructionTitle, instructions1, instructions2, shipsTitle, shipsInstructions);
    return {
        interactables,
    };
}
function updateInfoDisplay(text) {
    infoDisplay.innerText = text;
}
function updatePlayerDisplay(id) {
    currentPlayerDisplay.innerText = `Player ${id}'s turn`;
}
function markCell(cell, state) {
    cell.classList.add(state);
}
function clearCell(cell) {
    cell.classList.remove('placed');
}
function showPlayerBoard(isSetupPhase, playerID) {
    let boardToHide = interactables.player2Board;
    let boardToShow = interactables.player1Board;
    if (playerID === 1) {
        if (!isSetupPhase) {
            boardToHide = interactables.player1Board;
            boardToShow = interactables.player2Board;
        }
        else {
            boardToHide = interactables.player2SetupBoard;
            boardToShow = interactables.player1SetupBoard;
        }
    }
    else if (isSetupPhase) {
        boardToHide = interactables.player1SetupBoard;
        boardToShow = interactables.player2SetupBoard;
        for (const cell of interactables.player1SetupBoard.children) {
            clearCell(cell);
        }
    }
    boardToHide.classList.add('disabled');
    boardToShow.classList.remove('disabled');
}
function showGameOver(winner) {
    interactables.player1Board.classList.add('disabled');
    interactables.player2Board.classList.add('disabled');
    infoDisplay.innerText = 'Congratulations!';
    currentPlayerDisplay.innerText = `Player ${winner} is the winner!`;
}
function hideSetupArea() {
    var _a;
    (_a = interactables.player1SetupBoard.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
}
function populateBoard(board) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const element = createElement('div');
            element.dataset.x = x.toString();
            element.dataset.y = y.toString();
            board.appendChild(element);
        }
    }
}
function createElement(tagname, ...classes) {
    const element = document.createElement(tagname);
    element.classList.add(...classes);
    return element;
}
export default {
    init,
    showPlayerBoard,
    updateInfoDisplay,
    updatePlayerDisplay,
    markCell,
    clearCell,
    hideSetupArea,
    showGameOver,
};
