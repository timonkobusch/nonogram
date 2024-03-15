import useTimer from "components/utils/useTimer";
import { useState, useEffect, useMemo } from "react";
import { Nonogram } from "modules/Nonogram.ts";
import { insertRecord } from "components/utils/recordHandler";

import workerURL from "./createClassWorker?worker&url";
const enum MarkLock {
    UNSET = 0,
    ROW = 1,
    COL = 2,
}

const initialNonogramState = new Nonogram(10);
export const useNonogramController = () => {
    // Nonogram state
    const [nonogram, setNonogram] = useState(initialNonogramState);
    const [nonogramHistory, setNonogramHistory] = useState<Nonogram[]>([]);
    // Game state
    const [gamePaused, setGamePaused] = useState(true);
    const [loading, setLoading] = useState(false);
    const { seconds, resetTimer, startTimer, pauseTimer } = useTimer();
    // Mouse state
    const [mouseButtonDown, setMouseButtonDown] = useState(false);
    const [fillModeEnabled, setFillModeEnabled] = useState(true);
    const [clearMode, setClearMode] = useState(false);
    const [clickCoords, setClickCoords] = useState({ row: 0, column: 0 });
    const [markLock, setMarkLock] = useState(MarkLock.UNSET);

    useEffect(() => {
        const handleMouseUp = () => {
            if (mouseButtonDown) {
                setMouseButtonDown(false);
            }
        };
        const handleFKeyPress = (e: KeyboardEvent) => {
            if (e.key === "f") {
                setFillModeEnabled(!fillModeEnabled);
            }
        };
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("keypress", handleFKeyPress);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("keypress", handleFKeyPress);
        };
    });

    const handleUndo = () => {
        if (nonogramHistory.length > 0) {
            const previousNonogram = nonogramHistory.pop();
            if (previousNonogram) {
                setNonogram(previousNonogram);
                setNonogramHistory([...nonogramHistory]); // Update the history state
            }
        }
    };
    const handleMouseDown = useMemo(() => {
        return (x: number, y: number) => {
            setNonogramHistory([...nonogramHistory, new Nonogram(nonogram)]);

            const updatedGrid = new Nonogram(nonogram);
            updatedGrid.click(x, y, fillModeEnabled);
            setNonogram(updatedGrid);

            // Set mouse state
            setMouseButtonDown(true);
            setClickCoords({ row: y, column: x });
            setMarkLock(MarkLock.UNSET);
            if (nonogram.grid[x][y] === 0) {
                setClearMode(false);
            } else {
                setClearMode(true);
            }
            if (updatedGrid.progress.isWon) {
                pauseTimer();

                insertRecord(`${nonogram.size}x${nonogram.size}`, seconds);
            }
        };
    }, [nonogram, fillModeEnabled, nonogramHistory, pauseTimer, seconds]);

    const handleMouseOver = useMemo(() => {
        return (x: number, y: number) => {
            if (mouseButtonDown) {
                if (x === clickCoords.column && y === clickCoords.row) {
                    return;
                }
                if (markLock === MarkLock.UNSET) {
                    if (x === clickCoords.column) {
                        setMarkLock(MarkLock.COL);
                    } else if (y === clickCoords.row) {
                        setMarkLock(MarkLock.ROW);
                    }
                }
                if (markLock === MarkLock.COL) {
                    x = clickCoords.column;
                } else if (markLock === MarkLock.ROW) {
                    y = clickCoords.row;
                }

                const updatedGrid = new Nonogram(nonogram as Nonogram);
                updatedGrid.setCell(x, y, fillModeEnabled, clearMode);
                setNonogram(updatedGrid);
                if (updatedGrid.progress.isWon) {
                    pauseTimer();
                    insertRecord(`${nonogram.size}x${nonogram.size}`, seconds);
                }
            }
        };
    }, [
        clearMode,
        clickCoords.column,
        clickCoords.row,
        markLock,
        nonogram,
        mouseButtonDown,
        fillModeEnabled,
        pauseTimer,
        seconds,
    ]);

    const handleGenerate = (size: number) => {
        if (loading) {
            console.log("loading of new nonogram in progress");
            return;
        }
        setNonogramHistory([]);
        if (size <= 25) {
            setNonogram(new Nonogram(size));
            resetTimer();
            setFillModeEnabled(true);
            setGamePaused(true);
            return;
        }
        setLoading(true);
        resetTimer();
        const tempNonogram = new Nonogram(10);
        tempNonogram.forceWin();
        setNonogram(tempNonogram);

        const worker = new Worker(workerURL, { type: "module" });

        worker.onmessage = (e) => {
            setNonogram(e.data);
            resetTimer();
            setFillModeEnabled(true);
            setGamePaused(true);
            worker.terminate();
            setLoading(false);
        };
        worker.postMessage(size);
    };

    const handleReset = () => {
        const newNonogram = new Nonogram(nonogram);
        newNonogram.reset();
        setNonogram(newNonogram);
    };

    const handlePause = () => {
        if (gamePaused) {
            startTimer();
        } else {
            pauseTimer();
        }
        setGamePaused(!gamePaused);
    };

    const handleToggleMarking = () => {
        setFillModeEnabled(!fillModeEnabled);
    };

    return {
        nonogram,
        nonogramHistory,
        gamePaused,
        fillModeEnabled,
        loading,
        seconds,
        handleGenerate,
        handleReset,
        handleUndo,
        handleMouseDown,
        handleMouseOver,
        handlePause,
        handleToggleMarking,
    };
};
