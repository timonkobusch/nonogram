import "components/App.scss";
import NonogramGrid from "./NonogramGrid/NonogramGrid";
import { Nonogram } from "modules/Nonogram";
import { useEffect, useMemo, useState } from "react";
import GameController from "components/GameController/GameController";
import PlayController from "components/PlayController/PlayController";
import useTimer from "components/utils/useTimer";
import AppHeader from "components/AppHeader/AppHeader";
import About from "components/About/About";
import workerURL from "./utils/createClassWorker?worker&url";

const enum MarkLock {
    UNSET = 0,
    ROW = 1,
    COL = 2,
}

const initialNonogramState = new Nonogram(10)

const App = () => {
    const [nonogram, setNonogram] = useState(initialNonogramState);
    const [nonogramHistory, setNonogramHistory] = useState<Nonogram[]>([]);
    const [mouseDown, setMouseDown] = useState(false);
    const [marking, setMarking] = useState(true);
    const [loading, setLoading] = useState(false);
    const [clearMode, setClearMode] = useState(false);
    const { seconds, resetTimer, startTimer, pauseTimer } = useTimer();
    const [gameRunning, setgameRunning] = useState(false);

    const [clickCoords, setClickCoords] = useState({ row: 0, column: 0 });
    const [markLock, setMarkLock] = useState(MarkLock.UNSET);

    useEffect(() => {
        const handleMouseUp = () => {
            if (mouseDown) {
                setMouseDown(false);
            }
        };
        const handleFKeyPress = (e: KeyboardEvent) => {
            if (e.key === "f") {
                setMarking(!marking);
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
            updatedGrid.click(x, y, marking);
            setNonogram(updatedGrid);
    
            // Set mouse state
            setMouseDown(true);
            setClickCoords({ row: y, column: x });
            setMarkLock(MarkLock.UNSET);
            if (nonogram.grid[x][y] === 0) {
                setClearMode(false);
            } else {
                setClearMode(true);
            }
            if (updatedGrid.progress.isWon) {
                pauseTimer();
            }
        };
    }, [nonogram, marking, nonogramHistory, pauseTimer])

    const handleMouseOver = useMemo(() => {
        return (x: number, y: number) => {
            if (mouseDown) {
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
                updatedGrid.setCell(x, y, marking, clearMode);
                setNonogram(updatedGrid);
                if (updatedGrid.progress.isWon) {
                    pauseTimer();
                }
            }
        };
    }, [clearMode, clickCoords.column, clickCoords.row, markLock, nonogram, mouseDown, marking, pauseTimer])

    const handleGenerate = (size: number) => {
        if (size <= 25) {
            setNonogram(new Nonogram(size));
            resetTimer();
            setMarking(true);
            setgameRunning(false);
            return;
        }
        setLoading(true);
        const tempNonogram = new Nonogram(10);
        tempNonogram.forceWin();
        setNonogram(tempNonogram);

        const worker = new Worker(workerURL, { type: "module" });

        worker.onmessage = (e) => {
            setNonogram(e.data);
            resetTimer();
            setMarking(true);
            setgameRunning(false);
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
        if (gameRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
        setgameRunning(!gameRunning);
    };

    const memoizedNonogramGrid = useMemo(() => {
        console.log("rerender the grid")
        return (
            <NonogramGrid
                nonogram={nonogram}
                onMouseDownHandler={handleMouseDown}
                onMouseOverHandler={handleMouseOver}
                gameRunning={gameRunning}
            />
        )
    }, [gameRunning, handleMouseDown, handleMouseOver, nonogram])
    // TODO - Loading spinner and telling puzzle tries
    // TODO - Performance
    // TODO - Stop timer while loading
    // TODO - Add a win message/animation
    // TODO - Refactor app.tsx
    // TODO - Challenges
    // TODO - Help
    // TODO - define behavior for app header
    return (
        <div className="App">
            <AppHeader />
            <div className="App-content">
                <div className="ControlField">
                    <GameController
                        handleGenerate={handleGenerate}
                        handleReset={handleReset}
                        gameWon={nonogram.progress.isWon}
                        loading={loading}
                    />
                    <PlayController
                        progress={nonogram.progress}
                        seconds={seconds}
                        handlePause={handlePause}
                        gameRunning={gameRunning}
                        handleUndo={handleUndo}
                        undoActive={nonogramHistory.length > 0}
                        marking={marking}
                        toggleMarking={() => setMarking(!marking)}
                    />
                    <About />
                </div>
                {memoizedNonogramGrid}
            </div>
        </div>
    );
};

export default App;
