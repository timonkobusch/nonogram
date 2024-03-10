import NonogramHumanSolver from './NonogramHumanSolver';

export enum Marking {
    MARKING = 1,
    CROSSING = 2,
    EMPTY = 0,
}
export class Nonogram {
    size!: number;
    grid!: number[][];
    solution!: number[][];
    progress!: {
        cellsToBeMarked: number;
        cellsMarked: number;
        isWon: boolean;
    };
    hints!: {
        rows: number[][];
        columns: number[][];
    };
    finishedLines!: {
        rows: boolean[];
        columns: boolean[];
    };

    constructor(arg: number | Nonogram) {
        if (typeof arg === 'number') {
            this.initializeNewNonogram(arg);
        } else {
            this.copyNonogram(arg);
        }
    }

    private static createRandomGrid(size: number) {
        const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                Math.random() > 0.3 ? (grid[i][j] = Marking.MARKING) : (grid[i][j] = Marking.CROSSING);
            }
        }

        return grid;
    }

    private static createHints(grid: number[][]): { rows: number[][]; columns: number[][] } {
        const rows = grid.map((row) => Nonogram.extractHintsFromLine(row));
        const columns = Array.from({ length: grid.length }, (_, i) => Nonogram.extractHintsFromLine(grid.map((row) => row[i])));
        return { rows, columns };
    }

    private static extractHintsFromLine(line: number[]): number[] {
        const hints = line.reduce(
            (acc, mark, i, src) => {
                if (mark === Marking.MARKING) {
                    acc[acc.length - 1] = (acc[acc.length - 1] || 0) + 1;
                } else if (i > 0 && src[i - 1] === Marking.MARKING) {
                    acc.push(0);
                }
                return acc;
            },
            [0]
        );
        return hints.length > 1 || hints[0] !== 0 ? hints.filter((hint) => hint !== 0) : [0];
    }

    private initializeNewNonogram(size: number): void {
        this.size = size;
        this.grid = Nonogram.createEmptyGrid(this.size);
        this.solution = Nonogram.createRandomGrid(this.size);
        this.hints = Nonogram.createHints(this.solution);

        let solver = new NonogramHumanSolver(this.size, this.hints, this.solution);
        while (!solver.solve()) {
            this.solution = Nonogram.createRandomGrid(this.size);
            this.hints = Nonogram.createHints(this.solution);
            solver = new NonogramHumanSolver(this.size, this.hints, this.solution);
            break;
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
    }

    private copyNonogram(nonogram: Nonogram): void {
        this.size = nonogram.size;
        this.grid = nonogram.grid.map((row) => [...row]);
        this.solution = nonogram.solution.map((row) => [...row]);
        this.progress = { ...nonogram.progress };
        this.hints = nonogram.hints;
        this.finishedLines = { ...nonogram.finishedLines };
    }

    private static createEmptyGrid(size: number): Marking[][] {
        return Array.from({ length: size }, () => Array.from({ length: size }, () => Marking.EMPTY));
    }

    public reset(): void {
        this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => Marking.EMPTY));
        this.progress = {
            cellsToBeMarked: this.progress.cellsToBeMarked,
            cellsMarked: 0,
            isWon: false,
        };
        this.checkFinishedLines();
    }

    private checkWin(): void {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== this.solution[i][j]) {
                    if (this.grid[i][j] === Marking.EMPTY && this.solution[i][j] === Marking.CROSSING) continue;
                    this.progress.isWon = false;
                    return;
                }
            }
        }

        this.progress.isWon = true;
    }

    private checkFinishedLines(): void {
        this.finishedLines.rows = this.grid.map((row, rowIndex) =>
            Nonogram.areHintsMatching(Nonogram.extractHintsFromLine(row), this.hints.rows[rowIndex])
        );
        this.finishedLines.columns = this.grid[0].map((_, columnIndex) => {
            const column = this.grid.map((row) => row[columnIndex]);
            return Nonogram.areHintsMatching(Nonogram.extractHintsFromLine(column), this.hints.columns[columnIndex]);
        });
    }

    private static areHintsMatching(lineHints: number[], hintArray: number[]): boolean {
        if (lineHints.length !== hintArray.length) return false;
        for (let i = 0; i < lineHints.length; i++) {
            if (lineHints[i] !== hintArray[i]) return false;
        }
        return true;
    }

    public click(x: number, y: number, marking: boolean): void {
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

    public setCell(x: number, y: number, marking: boolean, clearMode: boolean): void {
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

    public forceWin(): void {
        this.progress.isWon = true;
    }
}
