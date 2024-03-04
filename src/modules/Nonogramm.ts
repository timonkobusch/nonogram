export enum Marking {
    MARKING = 1,
    CROSSING = 2,
    EMPTY = 0,
}

function createRandomGrid(size: number) {
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            Math.random() > 0.5 ? (grid[i][j] = Marking.MARKING) : (grid[i][j] = Marking.EMPTY);
        }
    }
    return grid;
}

function createHints(grid: number[][]) {
    const rows = grid.map((row) => {
        const hints = [];
        let count = 0;
        for (let i = 0; i < row.length; i++) {
            if (row[i] === Marking.MARKING) {
                count++;
            } else if (count > 0) {
                hints.push(count);
                count = 0;
            }
        }
        if (count > 0) {
            hints.push(count);
        }
        if (hints.length === 0) {
            hints.push(0);
        }
        return hints;
    });
    const columns = Array.from({ length: grid.length }, () => []);
    for (let i = 0; i < grid.length; i++) {
        let count = 0;
        for (let j = 0; j < grid.length; j++) {
            if (grid[j][i] === Marking.MARKING) {
                count++;
            } else if (count > 0) {
                (columns[i] as number[]).push(count);
                count = 0;
            }
        }
        if (count > 0) {
            (columns[i] as number[]).push(count);
        }
        if (columns[i].length === 0) {
            (columns[i] as number[]).push(0);
        }
    }
    return { rows, columns };
}

export class Nonogramm {
    size: number;
    grid: number[][];
    solution: number[][];
    isWon: boolean;
    hints: {
        rows: number[][];
        columns: number[][];
    };

    constructor(arg: number | Nonogramm) {
        if (typeof arg === 'number') {
            this.size = arg as number;
            this.isWon = false;
            this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => Marking.EMPTY));
            this.solution = createRandomGrid(this.size);
            this.hints = createHints(this.solution);
            console.log(this.hints);
            return;
        }
        const nonogram = arg as Nonogramm;
        this.size = nonogram.size;
        this.grid = nonogram.grid.map((row) => row.slice());
        this.solution = nonogram.solution.map((row) => row.slice());
        this.isWon = nonogram.isWon;
        this.hints = nonogram.hints;
    }

    click(x: number, y: number) {
        let marking: Marking;
        if (this.grid[x][y] === Marking.MARKING) {
            this.grid[x][y] = Marking.CROSSING;
            marking = Marking.CROSSING;
        } else if (this.grid[x][y] === Marking.CROSSING) {
            this.grid[x][y] = Marking.EMPTY;
            marking = Marking.EMPTY;
        } else {
            this.grid[x][y] = Marking.MARKING;
            marking = Marking.MARKING;
        }
        this.checkWin();
        return marking;
    }
    setCell(x: number, y: number, marking: Marking) {
        this.grid[x][y] = marking;
        this.checkWin();
    }
    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== this.solution[i][j]) {
                    if (this.grid[i][j] === Marking.CROSSING && this.solution[i][j] === Marking.EMPTY) continue;
                    this.isWon = false;
                    return;
                }
            }
        }
        this.isWon = true;
    }
}
