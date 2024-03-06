import 'components/App.scss';
import NonogramGrid from './NonogramGrid/NonogramGrid';
import { Nonogram, Marking } from 'modules/Nonogram';
import { useEffect, useState } from 'react';
import GameController from 'components/GameController/GameController';
import PlayController from 'components/PlayController/PlayController';

const App = () => {
    const [nonogram, setNonogram] = useState(() => new Nonogram(10));
    const [lastGrid, setLastNonogram] = useState<Nonogram | null>(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [marking, setMarking] = useState(Marking.MARKING);
    const [seconds, setSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(true);

    useEffect(() => {
        const handleMouseUp = () => {
            if (mouseDown) {
                setMouseDown(false);
            }
        };
        document.addEventListener('mouseup', handleMouseUp);
    });
    const handleUndo = () => {
        if (lastGrid) {
            setNonogram(lastGrid);
            setLastNonogram(null);
        }
    };

    const handleMouseDown = (x: number, y: number) => {
        setLastNonogram(nonogram);
        const updatedGrid = new Nonogram(nonogram as Nonogram);
        const newMarking = updatedGrid.click(x, y);
        setMarking(newMarking);
        setNonogram(updatedGrid);
        setMouseDown(true);
    };

    const handleMouseOver = (x: number, y: number) => {
        if (mouseDown) {
            const updatedGrid = new Nonogram(nonogram as Nonogram);
            updatedGrid.setCell(x, y, marking);
            setNonogram(updatedGrid);
        }
    };
    const handleGenerate = (size: number) => {
        setTimerActive(false);
        setNonogram(new Nonogram(size));
        setSeconds(0);
        setTimeout(() => {
            setTimerActive(true);
        }, 700);
    };
    const handleReset = () => {
        const newNonogram = new Nonogram(nonogram);
        newNonogram.reset();
        setNonogram(newNonogram);
    };

    useEffect(() => {
        let interval: number | undefined;

        if (timerActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerActive]);

    return (
        <div className="App">
            <div className="App-header">nonogramm</div>
            <div className="App-content">
                <div className="ControlField">
                    <GameController handleGenerate={handleGenerate} handleReset={handleReset} />
                    <PlayController progress={nonogram.progress} seconds={seconds} />
                </div>
                <NonogramGrid nonogram={nonogram} onMouseDownHandler={handleMouseDown} onMouseOverHandler={handleMouseOver} />
            </div>
        </div>
    );
};

export default App;
