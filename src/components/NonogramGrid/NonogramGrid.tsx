import 'components/NonogramGrid//NonogramGrid.scss';
import { Nonogram } from 'modules/Nonogram';

interface INonogramGridProps {
    nonogram: Nonogram;
    onMouseDownHandler: (x: number, y: number) => void;
    onMouseOverHandler: (x: number, y: number) => void;
}

const NonogramGrid = ({ nonogram, onMouseDownHandler, onMouseOverHandler }: INonogramGridProps) => {
    return (
        <div className="content">
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
            <table>
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
                <tbody className="table">
                    {Array.from({ length: nonogram.size }).map((_, i) => {
                        return (
                            <tr key={i} className="row">
                                {Array.from({ length: nonogram.size }).map((_, j) => {
                                    const fifthRowBorder = i === 4 ? 'fifth-row' : '';
                                    let colored = 'empty';
                                    switch (nonogram.grid[i][j]) {
                                        case 1:
                                            colored = 'colored';
                                            break;
                                        case 2:
                                            colored = 'crossed';
                                            break;
                                    }
                                    return (
                                        <td
                                            key={j}
                                            className={`cell ${fifthRowBorder}`}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                onMouseDownHandler(i, j);
                                            }}
                                            onMouseOver={(e) => {
                                                e.preventDefault();
                                                onMouseOverHandler(i, j);
                                            }}
                                        >
                                            {i > 0 && i % 5 === 0 && <div className="fifth-row-border"></div>}
                                            {j > 0 && j % 5 === 0 && <div className="fifth-col-border"></div>}
                                            <div id="cell" className={`${colored}`}></div>
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
