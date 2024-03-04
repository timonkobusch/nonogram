import 'components/App.scss';
import NonogramGrid from './NonogramGrid/NonogramGrid';
import { Nonogram, Marking } from 'modules/Nonogram';
import { useEffect, useState } from 'react';

const App = () => {
    const [nonogram, setNonogram] = useState(() => new Nonogram(10));
    const [lastGrid, setLastNonogram] = useState<Nonogram | null>(null);
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
