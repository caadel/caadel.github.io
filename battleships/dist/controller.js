import GUI from './gui.js';
import Game from './game.js';
const UIElements = GUI.init().interactables;
GUI.showPlayerBoard(true, 1);
GUI.updatePlayerDisplay(1);
promptNextPlacement();
createBoardEvents(UIElements.player1Board, UIElements.player2Board);
createSetupBoardEvents(UIElements.player1SetupBoard, UIElements.player2SetupBoard);
function createBoardEvents(...boards) {
    for (const board of boards) {
        board.addEventListener('click', (e) => {
            const target = e.target;
            if (target === board)
                return;
            const x = parseInt(target.dataset.x || '0');
            const y = parseInt(target.dataset.y || '0');
            const response = Game.takeTurn(x, y);
            if (response) {
                GUI.markCell(target, 'hit');
                let hitMsg = 'hit';
                if (response.hasSunk)
                    hitMsg = 'sunk';
                GUI.updateInfoDisplay(`A ${response.name} was ${hitMsg}!`);
                if (Game.hasEnded()) {
                    GUI.showGameOver(Game.getCurrentPlayer());
                    return;
                }
            }
            else {
                GUI.markCell(target, 'miss');
                GUI.updateInfoDisplay("It's a miss!");
            }
            GUI.updatePlayerDisplay(Game.getCurrentPlayer());
            GUI.showPlayerBoard(false, Game.getCurrentPlayer());
        });
    }
}
function createSetupBoardEvents(...boards) {
    let previousPlacingPlayer = 1;
    for (const board of boards) {
        let lastMarkedCells;
        board.addEventListener('mouseover', (e) => {
            lastMarkedCells = setupHoverHandler(board, e.target, true);
        });
        board.addEventListener('mouseout', (e) => {
            lastMarkedCells = setupHoverHandler(board, e.target, false);
        });
        board.addEventListener('click', (e) => {
            const target = e.target;
            if (target === board)
                return;
            const x = parseInt(target.dataset.x || '0');
            const y = parseInt(target.dataset.y || '0');
            if (!Game.placeShipAt(x, y))
                return;
            if (Game.placementFinished()) {
                GUI.showPlayerBoard(false, 1);
                GUI.hideSetupArea();
                GUI.updatePlayerDisplay(1);
                GUI.updateInfoDisplay('');
            }
            else {
                const currentPlayer = Game.getCurrentPlayer();
                if (currentPlayer !== previousPlacingPlayer) {
                    previousPlacingPlayer = currentPlayer;
                    GUI.showPlayerBoard(true, 2);
                    GUI.updatePlayerDisplay(2);
                }
                promptNextPlacement();
            }
        });
        board.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            Game.rotateNextShip();
            for (const item of lastMarkedCells) {
                GUI.clearCell(item);
            }
            lastMarkedCells = setupHoverHandler(board, e.target, true);
        });
    }
}
function setupHoverHandler(board, target, enteredCell) {
    if (target === board)
        return [];
    const targetCell = target;
    const x = parseInt(targetCell.dataset.x || '0');
    const y = parseInt(targetCell.dataset.y || '0');
    const canPlaceShip = Game.canPlaceShipAt(x, y);
    if (!canPlaceShip)
        return [];
    const shipData = Game.getNextShipData();
    const affectedCells = [];
    for (let i = 0; i < shipData.length; i++) {
        let index = 10 * y + x + i;
        if (!shipData.isHorizontal)
            index = 10 * y + i * 10 + x;
        const currentCell = board.children[index];
        if (enteredCell) {
            GUI.markCell(currentCell, 'placed');
            affectedCells.push(currentCell);
        }
        else
            GUI.clearCell(currentCell);
    }
    return affectedCells;
}
function promptNextPlacement() {
    GUI.updateInfoDisplay(`Place your ${Game.getNextShipData().name}`);
}
