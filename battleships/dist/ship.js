export class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.isHorizontal = true;
        this.cellsLeft = length;
        this.hasSunk = false;
    }
    changeDirection() {
        this.isHorizontal = !this.isHorizontal;
    }
    hit() {
        this.cellsLeft--;
        this.hasSunk = this.cellsLeft <= 0;
        return this.hasSunk;
    }
}
