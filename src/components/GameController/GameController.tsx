import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import './GameController.scss';

interface IGameControllerProps {
    handleGenerate: (size: number) => void;
    handleReset: () => void;
    progress: {
        isWon: boolean;
        cellsToBeMarked: number;
        cellsMarked: number;
    };
}
const GameController = ({ handleGenerate, handleReset, progress }: IGameControllerProps) => {
    const gridOptions = [
        { value: 5, label: '5x5' },
        { value: 10, label: '10x10' },
        { value: 15, label: '15x15' },
        { value: 20, label: '20x20' },
        { value: 25, label: '25x25' },
        { value: 30, label: '30x30 !hard' },
    ];
    const [gridSize, setGridSize] = useState(gridOptions[1]);
    const handleGridSizeChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            setGridSize(selectedOption);
        }
    };
    return (
        <div className="gameController container">
            Generate Random Puzzle:
            <div className="generateContainer">
                <div style={{ width: '110px' }}>
                    <Select defaultValue={gridOptions[1]} options={gridOptions} onChange={handleGridSizeChange} />
                </div>
                <button onClick={() => handleGenerate(gridSize.value)}>generate</button>
            </div>
            <div className="challengesContainer">
                {' '}
                Challenges <span>coming soon...</span>
            </div>
            <div className="buttonContainer">
                <button className="reset" onClick={handleReset} disabled={progress.isWon}>
                    reset
                </button>
                <button className="check" disabled>
                    check
                </button>
            </div>
        </div>
    );
};

export default GameController;
