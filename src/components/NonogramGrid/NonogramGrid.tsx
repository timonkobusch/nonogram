import 'components/NonogramGrid//NonogramGrid.scss';
import { Nonogram } from 'modules/Nonogram';
import { useState } from 'react';

interface INonogramGridProps {
    nonogram: Nonogram;
    onMouseDownHandler: (x: number, y: number) => void;
    onMouseOverHandler: (x: number, y: number) => void;
    gameRunning: boolean;
}

const TopHints = ({ nonogram }: { nonogram: Nonogram }) => {
    return (
        <thead>
            <tr className="top-hints">
                {Array.from({ length: nonogram.size }).map((_, i) => {
                    return (
                        <th key={i} className="header-cell">
                            {nonogram.hints.columns[i].length === 0 ? (
                                <div>0</div>
                            ) : (
                                nonogram.hints.columns[i].map((hint: number, index: number) => <div key={index}>{hint}</div>)
                            )}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
};

const LeftHints = ({ nonogram }: { nonogram: Nonogram }) => {
    return (
        <div className="left-hints">
            {Array.from({ length: nonogram.size }).map((_, i) => {
                return (
                    <div key={i}>
                        {nonogram.hints.rows[i].length === 0 ? (
                            <div>0</div>
                        ) : (
                            nonogram.hints.rows[i].map((hint: number, index: number) => <div key={index}>{hint}</div>)
                        )}
                    </div>
                );
            })}
        </div>
    );
};
const NonogramGrid = ({ nonogram, onMouseDownHandler, onMouseOverHandler, gameRunning }: INonogramGridProps) => {
    const [selectedCell, setSelectedCell] = useState<{ row: number; column: number }>({ row: -1, column: -1 });
    const onMouseEnter = (x: number, y: number) => {
        setSelectedCell({ row: x, column: y });
    };
    const onMouseLeave = () => {
        setSelectedCell({ row: -1, column: -1 });
    };

    return (
        <div className="content">
            <LeftHints nonogram={nonogram} />
            <table>
                <TopHints nonogram={nonogram} />
                <tbody className="table">
                    {Array.from({ length: nonogram.size }).map((_, row) => {
                        return (
                            <tr key={row} className="row">
                                {Array.from({ length: nonogram.size }).map((_, col) => {
                                    const fifthRowBorder = row === 4 ? 'fifth-row' : '';
                                    const highlighted = selectedCell.row === row || selectedCell.column === col ? 'highlighted' : '';
                                    const hideCell = gameRunning ? '' : 'hide-cell';
                                    let colored = 'empty';
                                    switch (nonogram.grid[row][col]) {
                                        case 1:
                                            colored = 'colored';
                                            break;
                                        case 2:
                                            colored = 'crossed';
                                            break;
                                        case 3:
                                            colored = 'wrongColored';
                                            break;
                                        case 4:
                                            colored = 'wrongCrossed';
                                            break;
                                    }
                                    return (
                                        <td
                                            key={col}
                                            className={`cell ${fifthRowBorder}`}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                if (!gameRunning) return;
                                                onMouseDownHandler(row, col);
                                            }}
                                            onMouseOver={(e) => {
                                                e.preventDefault();
                                                if (!gameRunning) return;
                                                onMouseEnter(row, col);
                                                onMouseOverHandler(row, col);
                                            }}
                                            onMouseLeave={() => onMouseLeave()}
                                        >
                                            {row > 0 && row % 5 === 0 && <div className="fifth-row-border"></div>}
                                            {col > 0 && col % 5 === 0 && <div className="fifth-col-border"></div>}
                                            <div id="cell" className={`${colored} ${highlighted} ${hideCell}`}></div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default NonogramGrid;
