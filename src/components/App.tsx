import '../css/App.scss';
import NonogramGrid from './NonogramGrid';
import { Nonogramm, Marking } from '../modules/Nonogramm';
import { useEffect, useState } from 'react';

const App = () => {
    const [nonogram, setNonogram] = useState(() => new Nonogramm(15));
    const [lastGrid, setLastNonogram] = useState<Nonogramm | null>(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [marking, setMarking] = useState(Marking.MARKING);

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
        const updatedGrid = new Nonogramm(nonogram as Nonogramm);
        const newMarking = updatedGrid.click(x, y);
        setMarking(newMarking);
        setNonogram(updatedGrid);
        setMouseDown(true);
    };

    const handleMouseOver = (x: number, y: number) => {
        if (mouseDown) {
            const updatedGrid = new Nonogramm(nonogram as Nonogramm);
            updatedGrid.setCell(x, y, marking);
            setNonogram(updatedGrid);
        }
    };

    return (
        <div className="App">
            <div className="App-header">nonogramm</div>
            <NonogramGrid nonogram={nonogram} onMouseDownHandler={handleMouseDown} onMouseOverHandler={handleMouseOver} />
            <button onClick={handleUndo}>back</button>
            {(nonogram.isWon && <div className="win">You won!</div>) || <div>Test</div>}
        </div>
    );
};

export default App;
