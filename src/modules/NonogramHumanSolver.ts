export default class NonogramHumanSolver {
    readonly size;
    readonly hints;
    readonly solution;

    grid;
    progress;
    solvedColumns;
    solvedRows;

    constructor(size: number, hints: { rows: number[][]; columns: number[][] }, solution: number[][]) {
        this.size = size;
        this.hints = hints;
        this.solution = solution;

        this.grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
        this.progress = true;
        this.solvedColumns = new Array(size).fill(false);
        this.solvedRows = new Array(size).fill(false);
    }

    solve() {
        while (this.progress) {
            this.progress = false;
            this.checkOverlapping();
            this.checkSpreading();
            this.checkNoSpaceCrossing();
            this.checkCompletedLines();
        }
        if (this.checkCorrectness()) {
            console.log('Solved');
            return true;
        } else {
            console.log('Not solved');
        }
        return false;
    }

    checkCorrectness() {
        const { size, grid, solution } = this;
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            for (let colIndex = 0; colIndex < size; colIndex++) {
                if (grid[rowIndex][colIndex] === 1 && (solution[rowIndex][colIndex] === 0 || solution[rowIndex][colIndex] === 2)) {
                    return false;
                } else if ((grid[rowIndex][colIndex] === 0 || grid[rowIndex][colIndex] === 2) && solution[rowIndex][colIndex] === 1) {
                    return false;
                }
            }
        }
        return true;
    }

    checkNoSpaceCrossing() {
        const { size, grid, hints, solvedColumns, solvedRows } = this;
        // check all rows
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            if (solvedRows[rowIndex]) continue;

            const firstHint = hints.rows[rowIndex][0];
            let startIndex = 0;
            for (let colIndex = 0; colIndex < size; colIndex++) {
                if (grid[rowIndex][colIndex] === 1 || grid[rowIndex][colIndex] === 0) {
                    startIndex = colIndex;
                    break;
                }
            }
            for (let colIndex = startIndex; colIndex < size; colIndex++) {
                if (grid[rowIndex][colIndex] === 1 || colIndex + 1 > firstHint + startIndex) {
                    break;
                } else if (grid[rowIndex][colIndex] === 2) {
                    for (let i = startIndex; i < colIndex; i++) {
                        if (grid[rowIndex][i] === 0) {
                            grid[rowIndex][i] = 2;
                            this.progress = true;
                        }
                    }
                    break;
                }
            }

            const lastHint = hints.rows[rowIndex][hints.rows[rowIndex].length - 1];
            let endIndex = size - 1;
            for (let colIndex = size - 1; colIndex >= 0; colIndex--) {
                if (grid[rowIndex][colIndex] === 1 || grid[rowIndex][colIndex] === 0) {
                    endIndex = colIndex;
                    break;
                }
            }
            for (let colIndex = endIndex; colIndex >= 0; colIndex--) {
                if (grid[rowIndex][colIndex] === 1 || endIndex - colIndex + 1 > lastHint) {
                    break;
                } else if (grid[rowIndex][colIndex] === 2) {
                    for (let i = endIndex; i > colIndex; i--) {
                        if (grid[rowIndex][i] === 0) {
                            grid[rowIndex][i] = 2;
                            this.progress = true;
                        }
                    }
                    break;
                }
            }
        }

        // check columns
        for (let colIndex = 0; colIndex < size; colIndex++) {
            if (solvedColumns[colIndex]) continue;

            const firstHint = hints.columns[colIndex][0];
            let startIndex = 0;

            for (let rowIndex = 0; rowIndex < size; rowIndex++) {
                if (grid[rowIndex][colIndex] === 1 || grid[rowIndex][colIndex] === 0) {
                    startIndex = rowIndex;
                    break;
                }
            }
            for (let rowIndex = startIndex; rowIndex < size; rowIndex++) {
                if (grid[rowIndex][colIndex] === 1 || rowIndex + 1 > firstHint + startIndex) {
                    break;
                } else if (grid[rowIndex][colIndex] === 2) {
                    for (let i = startIndex; i < rowIndex; i++) {
                        if (grid[i][colIndex] === 0) {
                            grid[i][colIndex] = 2;
                            this.progress = true;
                        }
                    }
                    break;
                }
            }

            const lastHint = hints.columns[colIndex][hints.columns[colIndex].length - 1];
            let endIndex = size - 1;

            for (let rowIndex = size - 1; rowIndex >= 0; rowIndex--) {
                if (grid[rowIndex][colIndex] === 1 || grid[rowIndex][colIndex] === 0) {
                    endIndex = rowIndex;
                    break;
                }
            }
            for (let rowIndex = endIndex; rowIndex >= 0; rowIndex--) {
                if (grid[rowIndex][colIndex] === 1 || endIndex - rowIndex + 1 > lastHint) {
                    break;
                } else if (grid[rowIndex][colIndex] === 2) {
                    for (let i = endIndex; i > rowIndex; i--) {
                        if (grid[i][colIndex] === 0) {
                            grid[i][colIndex] = 2;
                            this.progress = true;
                        }
                    }
                    break;
                }
            }
        }
    }

    checkCompletedLines() {
        const { size, grid, solvedColumns, solvedRows, hints } = this;

        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            if (solvedRows[rowIndex]) continue;

            const rowSum = grid[rowIndex].reduce((accumulator, currentValue) => accumulator + (currentValue == 1 ? 1 : 0), 0);
            const hintSum = hints.rows[rowIndex].reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            if (rowSum !== hintSum) {
                continue;
            }

            solvedRows[rowIndex] = true;
            for (let colIndex = 0; colIndex < size; colIndex++) {
                if (grid[rowIndex][colIndex] === 0) {
                    this.progress = true;
                    grid[rowIndex][colIndex] = 2;
                }
            }
        }

        for (let colIndex = 0; colIndex < size; colIndex++) {
            if (solvedColumns[colIndex]) continue;

            const columnSum = grid.reduce((accumulator, currentValue) => accumulator + (currentValue[colIndex] == 1 ? 1 : 0), 0);
            const hintSum = hints.columns[colIndex].reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            if (columnSum !== hintSum) {
                continue;
            }

            solvedColumns[colIndex] = true;

            for (let rowIndex = 0; rowIndex < size; rowIndex++) {
                if (grid[rowIndex][colIndex] === 0) {
                    this.progress = true;
                    grid[rowIndex][colIndex] = 2;
                }
            }
        }
    }

    checkSpreading() {
        const { size, hints, grid, solvedRows, solvedColumns } = this;
        // spread rows

        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            if (solvedRows[rowIndex]) continue;

            const hintRow = hints.rows[rowIndex];

            let setMarking = false;
            let hintIndex = 0;
            let lastIndex = 0;
            let markedCells = 0;
            for (let colIndex = 0; colIndex < size; colIndex++) {
                if (setMarking) {
                    if (colIndex - lastIndex + 1 > hintRow[hintIndex]) {
                        if (markedCells < hintRow[hintIndex] || hintIndex == hintRow.length) break;
                        hintIndex++;
                        setMarking = false;
                        lastIndex = colIndex + 1;
                        grid[rowIndex][colIndex] = 2;
                    } else {
                        grid[rowIndex][colIndex] = 1;
                        markedCells++;
                    }
                } else if (colIndex - lastIndex + 1 > hintRow[hintIndex]) {
                    break;
                } else if (grid[rowIndex][colIndex] === 1) {
                    setMarking = true;
                    markedCells = 1;
                }
            }
            setMarking = false;
            hintIndex = hints.rows[rowIndex].length - 1;
            lastIndex = size - 1;
            markedCells = 0;
            for (let colIndex = size - 1; colIndex >= 0; colIndex--) {
                if (setMarking) {
                    if (lastIndex - colIndex + 1 > hintRow[hintIndex]) {
                        if (markedCells < hintRow[hintIndex] || hintIndex == 0) break;
                        hintIndex--;
                        setMarking = false;
                        lastIndex = colIndex - 1;
                        grid[rowIndex][colIndex] = 2;
                    } else {
                        grid[rowIndex][colIndex] = 1;
                        markedCells++;
                    }
                } else if (lastIndex - colIndex + 1 > hintRow[hintIndex]) {
                    break;
                } else if (grid[rowIndex][colIndex] === 1) {
                    setMarking = true;
                    markedCells = 1;
                }
            }
        }
        for (let colIndex = 0; colIndex < size; colIndex++) {
            if (solvedColumns[colIndex]) continue;

            const hintCol = hints.columns[colIndex];

            let setMarking = false;
            let hintIndex = 0;
            let lastIndex = 0;
            let markedCells = 0;

            for (let rowIndex = 0; rowIndex < size; rowIndex++) {
                if (setMarking) {
                    if (rowIndex - lastIndex + 1 > hintCol[hintIndex]) {
                        if (markedCells < hintCol[hintIndex] || hintIndex == hintCol.length) break;
                        hintIndex++;
                        setMarking = false;
                        grid[rowIndex][colIndex] = 2;
                        lastIndex = rowIndex + 1;
                    } else {
                        grid[rowIndex][colIndex] = 1;
                        markedCells++;
                    }
                } else if (rowIndex - lastIndex + 1 > hintCol[hintIndex]) {
                    break;
                } else if (grid[rowIndex][colIndex] === 1) {
                    setMarking = true;
                    markedCells = 1;
                }
            }
            setMarking = false;
            hintIndex = hints.columns[colIndex].length - 1;
            lastIndex = size - 1;
            markedCells = 0;
            for (let rowIndex = size - 1; rowIndex >= 0; rowIndex--) {
                if (setMarking) {
                    if (lastIndex - rowIndex + 1 > hintCol[hintIndex]) {
                        if (markedCells < hintCol[hintIndex] || hintIndex == 0) break;
                        hintIndex--;
                        setMarking = false;
                        grid[rowIndex][colIndex] = 2;
                        lastIndex = rowIndex - 1;
                    } else {
                        grid[rowIndex][colIndex] = 1;
                        markedCells++;
                    }
                } else if (lastIndex - rowIndex + 1 > hintCol[hintIndex]) {
                    break;
                } else if (grid[rowIndex][colIndex] === 1) {
                    setMarking = true;
                    markedCells = 1;
                }
            }
        }
    }

    checkOverlapping() {
        function generatePossibleLines(hints: number[], size: number) {
            const possibleRows: number[][] = [];

            function generateCombinations(startIndex: number, hintIndex: number, currentRow: number[]) {
                if (hintIndex === hints.length) {
                    possibleRows.push(currentRow.slice());
                    return;
                }
                if (startIndex >= size) return;

                const hint = hints[hintIndex];
                if (size - startIndex < hint) return;

                for (let i = startIndex; i <= size - hint; i++) {
                    for (let j = i; j < i + hint; j++) {
                        currentRow[j] = 1;
                    }
                    generateCombinations(i + hint + 1, hintIndex + 1, currentRow.slice());
                    for (let j = i; j < i + hint; j++) {
                        currentRow[j] = 2;
                    }
                }
            }

            generateCombinations(0, 0, new Array(size).fill(2));

            return possibleRows;
        }

        const { size, hints, grid, solvedColumns, solvedRows } = this;
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            // Skip rows that are already solved
            if (solvedRows[rowIndex]) continue;

            const rowHints = hints.rows[rowIndex];

            let possibleRows: number[][] = generatePossibleLines(rowHints, size);

            // filter every row that does not fit to current row
            possibleRows = possibleRows.filter((row) => {
                for (let j = 0; j < size; j++) {
                    if (grid[rowIndex][j] !== 0 && grid[rowIndex][j] !== row[j]) {
                        return false;
                    }
                }
                return true;
            });
            if (possibleRows.length === 0) continue;
            // Determine the final row configuration by overlapping tiles from possible rows
            const finalRowConfiguration = possibleRows[0].map((_, index) => {
                return possibleRows.every((row) => row[index] === 1) ? 1 : 0;
            });
            if (possibleRows.length === 0) continue;
            // Update the grid with the final row configuration
            for (let colIndex = 0; colIndex < size; colIndex++) {
                if (solvedColumns[colIndex]) continue; // skip already solved columns
                if (finalRowConfiguration[colIndex] === 1 && grid[rowIndex][colIndex] === 0) {
                    this.progress = true;
                    grid[rowIndex][colIndex] = 1;
                }
            }
        }
        for (let colIndex = 0; colIndex < size; colIndex++) {
            if (solvedColumns[colIndex]) continue; // skip already solved columns

            const columnHints = hints.columns[colIndex];

            // Generate possible column configurations based on hints
            let possibleColumns: number[][] = generatePossibleLines(columnHints, size);

            // filter every column that does not fit to current column
            possibleColumns = possibleColumns.filter((column) => {
                for (let i = 0; i < size; i++) {
                    if (grid[i][colIndex] !== 0 && grid[i][colIndex] !== column[i]) {
                        return false;
                    }
                }
                return true;
            });
            if (possibleColumns.length === 0) {
                continue;
            }
            // Determine the final column configuration by overlapping tiles from possible columns
            const finalColumnConfiguration = possibleColumns[0].map((_, index) => {
                return possibleColumns.every((column) => column[index] === 1) ? 1 : 0;
            });

            // Update the grid with the final column configuration
            for (let rowIndex = 0; rowIndex < size; rowIndex++) {
                if (solvedRows[rowIndex]) continue; // skip already solved rows
                if (finalColumnConfiguration[rowIndex] === 1 && grid[rowIndex][colIndex] === 0) {
                    this.progress = true;
                    grid[rowIndex][colIndex] = 1;
                }
            }
        }
    }
}
