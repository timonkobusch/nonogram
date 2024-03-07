import NonogramHumanSolver from 'modules/NonogramHumanSolver';

export enum Marking {
    MARKING = 1,
    CROSSING = 2,
    EMPTY = 0,
}

function createRandomGrid(size: number) {
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            Math.random() > 0.3 ? (grid[i][j] = Marking.MARKING) : (grid[i][j] = Marking.EMPTY);
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

export class Nonogram {
    size: number;
    grid: number[][];
    solution: number[][];
    progress: {
        cellsToBeMarked: number;
        cellsMarked: number;
        isWon: boolean;
    };
    hints: {
        rows: number[][];
        columns: number[][];
    };
    finishedLines: {
        rows: boolean[];
        columns: boolean[];
    };

    constructor(arg: number | Nonogram) {
        if (typeof arg === 'number') {
            this.size = arg as number;
            this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => Marking.EMPTY));
            console.log('creating random grid and trying to solve it...');
            this.solution = createRandomGrid(this.size);
            this.hints = createHints(this.solution);
            let solver = new NonogramHumanSolver(this.size, this.hints, this.solution);
            while (!solver.solve()) {
                console.log('trying again...');
                this.solution = createRandomGrid(this.size);
                this.hints = createHints(this.solution);
                solver = new NonogramHumanSolver(this.size, this.hints, this.solution);
            }
            this.progress = {
                cellsToBeMarked: this.solution.flat().filter((cell) => cell === Marking.MARKING).length,
                cellsMarked: 0,
                isWon: false,
            };
            this.finishedLines = {
                rows: Array.from({ length: this.size }, () => false),
                columns: Array.from({ length: this.size }, () => false),
            };

            return;
        }
        const nonogram = arg as Nonogram;
        this.size = nonogram.size;
        this.grid = nonogram.grid.map((row) => row.slice());
        this.solution = nonogram.solution.map((row) => row.slice());
        this.progress = {
            cellsToBeMarked: nonogram.progress.cellsToBeMarked,
            cellsMarked: nonogram.progress.cellsMarked,
            isWon: nonogram.progress.isWon,
        };
        this.hints = nonogram.hints;
        this.finishedLines = nonogram.finishedLines;
    }
    reset() {
        this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => Marking.EMPTY));
        this.progress = {
            cellsToBeMarked: this.progress.cellsToBeMarked,
            cellsMarked: 0,
            isWon: false,
        };
    }
    click(x: number, y: number, marking: boolean) {
        if (this.grid[x][y] === Marking.EMPTY && marking) {
            this.progress.cellsMarked++;
            this.grid[x][y] = Marking.MARKING;
        } else if (this.grid[x][y] === Marking.EMPTY && !marking) {
            this.grid[x][y] = Marking.CROSSING;
        } else if (this.grid[x][y] === Marking.MARKING && marking) {
            this.progress.cellsMarked--;
            this.grid[x][y] = Marking.EMPTY;
        } else if (this.grid[x][y] === Marking.CROSSING && !marking) {
            this.grid[x][y] = Marking.EMPTY;
        }
        this.checkFinishedLines();
        this.checkWin();
    }

    setCell(x: number, y: number, marking: boolean, clearMode: boolean) {
        if (clearMode) {
            if (marking && this.grid[x][y] === Marking.MARKING) {
                this.progress.cellsMarked--;
                this.grid[x][y] = Marking.EMPTY;
            } else if (!marking && this.grid[x][y] === Marking.CROSSING) {
                this.grid[x][y] = Marking.EMPTY;
            }
            this.checkWin();
            return;
        }
        if (this.grid[x][y] === Marking.EMPTY && marking) {
            this.progress.cellsMarked++;
            this.grid[x][y] = Marking.MARKING;
        } else if (this.grid[x][y] === Marking.EMPTY && !marking) {
            this.grid[x][y] = Marking.CROSSING;
        }
        this.checkFinishedLines();
        this.checkWin();
    }
    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== this.solution[i][j]) {
                    if (this.grid[i][j] === Marking.CROSSING && this.solution[i][j] === Marking.EMPTY) continue;
                    this.progress.isWon = false;
                    return;
                }
            }
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === Marking.EMPTY) {
                    this.grid[i][j] = Marking.CROSSING;
                }
            }
        }

        this.progress.isWon = true;
    }
    checkFinishedLines() {
        function checkEqualArray(array1: number[], array2: number[]) {
            if (array1.length !== array2.length) {
                return false;
            }

            for (let i = 0; i < array1.length; i++) {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }

            return true;
        }

        function countGroups(arr: number[]) {
            const result = [];
            let count = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === 1) {
                    count++;
                }
                if (arr[i] !== 1 || i === arr.length - 1) {
                    if (count > 0) {
                        result.push(count);
                        count = 0;
                    }
                }
            }
            return result.filter((group) => group !== 0);
        }

        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
            const result = checkEqualArray(countGroups(this.grid[rowIndex]), this.hints.rows[rowIndex]);
            this.finishedLines.rows[rowIndex] = result;
        }
        for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
            const result = checkEqualArray(countGroups(this.grid.map((row) => row[columnIndex])), this.hints.columns[columnIndex]);
            this.finishedLines.columns[columnIndex] = result;
        }
    }
}
