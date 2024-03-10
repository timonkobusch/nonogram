import { describe, it, expect } from 'vitest';
import { Nonogram } from '../../src/modules/Nonogram';

describe('Nonogram', () => {
    it('Create random and solve 5x5', () => {
        const size = 5;
        const nonogram = new Nonogram(size);
        expect(nonogram.size).toBe(size);
        expect(nonogram.grid.length).toBe(size);
        expect(nonogram.grid[0].length).toBe(size);
        expect(nonogram.solution.length).toBe(size);
        expect(nonogram.solution[0].length).toBe(size);
        expect(nonogram.hints.rows.length).toBe(size);
        expect(nonogram.hints.columns.length).toBe(size);
        expect(nonogram.finishedLines.rows.length).toBe(size);
        expect(nonogram.finishedLines.columns.length).toBe(size);
        expect(nonogram.finishedLines.rows.every((row) => row === false)).toBe(true);
        expect(nonogram.finishedLines.columns.every((column) => column === false)).toBe(true);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                expect(nonogram.grid[i][j]).toBe(0);
                expect(nonogram.solution[i][j]).toBeGreaterThan(-1);
                if (nonogram.solution[i][j] === 1) {
                    nonogram.click(i, j, true);
                }
            }
        }
        expect(nonogram.progress.isWon).toBe(true);
        expect(nonogram.progress.cellsMarked).toBe(nonogram.progress.cellsToBeMarked);
    });
    it('Create random and solve 10x10', () => {
        const size = 10;
        const nonogram = new Nonogram(size);
        expect(nonogram.size).toBe(size);
        expect(nonogram.grid.length).toBe(size);
        expect(nonogram.grid[0].length).toBe(size);
        expect(nonogram.solution.length).toBe(size);
        expect(nonogram.solution[0].length).toBe(size);
        expect(nonogram.hints.rows.length).toBe(size);
        expect(nonogram.hints.columns.length).toBe(size);
        expect(nonogram.finishedLines.rows.length).toBe(size);
        expect(nonogram.finishedLines.columns.length).toBe(size);
        expect(nonogram.finishedLines.rows.every((row) => row === false)).toBe(true);
        expect(nonogram.finishedLines.columns.every((column) => column === false)).toBe(true);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                expect(nonogram.grid[i][j]).toBe(0);
                expect(nonogram.solution[i][j]).toBeGreaterThan(-1);
                if (nonogram.solution[i][j] === 1) {
                    nonogram.click(i, j, true);
                }
            }
        }
        expect(nonogram.progress.isWon).toBe(true);
        expect(nonogram.progress.cellsMarked).toBe(nonogram.progress.cellsToBeMarked);
    });
});
