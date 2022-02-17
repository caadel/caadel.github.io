import { Player } from './player.js';
let players;
let currentPlayer;
let gameHasEnded;
let placementPhaseActive;
function newGame() {
    players = [new Player(1), new Player(2)];
    currentPlayer = players[0];
    gameHasEnded = false;
    placementPhaseActive = true;
}
newGame();
function takeTurn(x, y) {
    swapCurrentPlayer();
    const hitResult = currentPlayer.getsfiredAt(x, y);
    if (!currentPlayer.hasShipsLeft()) {
        gameHasEnded = true;
        swapCurrentPlayer();
    }
    return hitResult;
}
function swapCurrentPlayer() {
    currentPlayer === players[0]
        ? (currentPlayer = players[1])
        : (currentPlayer = players[0]);
}
function placeShipAt(x, y) {
    const shipWasPlaced = currentPlayer.placeNextShipAt(x, y);
    if (shipWasPlaced && !currentPlayer.hasShipsLeftToPlace) {
        swapCurrentPlayer();
        if (players.every((player) => !player.hasShipsLeftToPlace)) {
            placementPhaseActive = false;
        }
    }
    return shipWasPlaced;
}
function canPlaceShipAt(x, y) {
    return currentPlayer.canPlaceNextShipAt(x, y);
}
function getCurrentPlayer() {
    return currentPlayer.id;
}
function getNextShipData() {
    const ship = currentPlayer.nextShipToPlace;
    return {
        name: ship.name,
        length: ship.length,
        isHorizontal: ship.isHorizontal,
    };
}
function rotateNextShip() {
    var _a;
    (_a = currentPlayer.nextShipToPlace) === null || _a === void 0 ? void 0 : _a.changeDirection();
}
function placementFinished() {
    return !placementPhaseActive;
}
function hasEnded() {
    return gameHasEnded;
}
export default {
    newGame,
    getCurrentPlayer,
    takeTurn,
    placeShipAt,
    canPlaceShipAt,
    rotateNextShip,
    hasEnded,
    getNextShipData,
    swapCurrentPlayer,
    placementFinished,
};
