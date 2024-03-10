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
    loading: boolean;
}
const GameController = ({ handleGenerate, handleReset, progress, loading }: IGameControllerProps) => {
    const gridOptions = [
        { value: 5, label: '5x5' },
        { value: 10, label: '10x10' },
        { value: 15, label: '15x15' },
        { value: 20, label: '20x20' },
        { value: 25, label: '25x25' },
    ];
    const gridOptionsExpert = [
        { value: 30, label: '30x30' },
        { value: 35, label: '35x35' },
        { value: 40, label: '40x40' },
    ];

    const [gridSize, setGridSize] = useState(gridOptions[1]);
    const [activateExperimental, setActivateExperimental] = useState(false);
    const combinedGridOptions = activateExperimental ? [...gridOptions, ...gridOptionsExpert] : gridOptions;

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
                    <Select defaultValue={gridOptions[1]} options={combinedGridOptions} onChange={handleGridSizeChange} />
                </div>
                <button onClick={() => handleGenerate(gridSize.value)} disabled={loading}>
                    generate
                </button>
            </div>
            <div className="experimentalContainer">
                <input type="checkbox" onChange={() => setActivateExperimental(!activateExperimental)} />
                <label>Expert Sizes</label>
                {activateExperimental && <p>Warning: Grid loading may take a while and have poor performance</p>}
            </div>
            <div className="buttonContainer">
                <button className="reset" onClick={handleReset} disabled={progress.isWon}>
                    reset
                </button>
            </div>
        </div>
    );
};

export default GameController;
