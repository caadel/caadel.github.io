import { Ship } from './ship.js';
export class Player {
    constructor(id) {
        this.id = id;
        this.grid = this.generateGrid();
        this.ships = [];
        const shipTypes = {
            carrier: 5,
            battleship: 4,
            cruiser: 3,
            submarine: 3,
            destroyer: 2,
        };
        for (const [key, value] of Object.entries(shipTypes)) {
            this.ships.push(new Ship(key, value));
        }
        this.nextShipToPlace = this.ships[0];
        this.hasShipsLeftToPlace = true;
    }
    generateGrid() {
        const matrix = [];
        for (let y = 0; y < 10; y++) {
            const row = [];
            for (let x = 0; x < 10; x++) {
                row.push(null);
            }
            matrix.push(row);
        }
        return matrix;
    }
    getsfiredAt(x, y) {
        const cellToHit = this.grid[y][x];
        if (cellToHit === null) {
            return false;
        }
        else {
            this.grid[y][x] = null;
            return { name: cellToHit.name, hasSunk: cellToHit.hit() };
        }
    }
    hasShipsLeft() {
        return this.ships.some((ship) => !ship.hasSunk);
    }
    placeNextShipAt(x, y) {
        const isLegalPlacement = this.canPlaceNextShipAt(x, y);
        if (isLegalPlacement) {
            for (let i = 0; i < this.nextShipToPlace.length; i++) {
                if (this.nextShipToPlace.isHorizontal) {
                    this.grid[y][x + i] = this.nextShipToPlace;
                }
                else {
                    this.grid[y + i][x] = this.nextShipToPlace;
                }
            }
            const nextShipIndex = this.ships.indexOf(this.nextShipToPlace) + 1;
            if (nextShipIndex !== this.ships.length) {
                this.nextShipToPlace = this.ships[nextShipIndex];
            }
            else {
                this.hasShipsLeftToPlace = false;
            }
        }
        return isLegalPlacement;
    }
    canPlaceNextShipAt(x, y) {
        if (!this.hasShipsLeftToPlace)
            return false;
        for (let i = 0; i < this.nextShipToPlace.length; i++) {
            let xToCheck = x;
            let yToCheck = y;
            this.nextShipToPlace.isHorizontal
                ? (xToCheck = x + i)
                : (yToCheck = y + i);
            if (xToCheck >= 10 || yToCheck >= 10)
                return false;
            if (this.grid[yToCheck][xToCheck]) {
                return false;
            }
        }
        return true;
    }
}
