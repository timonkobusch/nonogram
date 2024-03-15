import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { ImSpinner } from "react-icons/im";
import "./GameController.scss";
interface IGameControllerProps {
    handleGenerate: (size: number) => void;
    handleReset: () => void;
    gameWon: boolean;
    loading: boolean;
    gamePaused: boolean;
}
const GameController = ({
    handleGenerate,
    handleReset,
    gameWon,
    loading,
    gamePaused,
}: IGameControllerProps) => {
    const gridOptions = [
        { value: 5, label: "5x5" },
        { value: 10, label: "10x10" },
        { value: 15, label: "15x15" },
        { value: 20, label: "20x20" },
        { value: 25, label: "25x25" },
    ];
    const gridOptionsExpert = [
        { value: 30, label: "30x30" },
        { value: 35, label: "35x35" },
        { value: 40, label: "40x40" },
    ];

    const [gridSize, setGridSize] = useState(gridOptions[1]);
    const [activateExperimental, setActivateExperimental] = useState(false);
    const combinedGridOptions = activateExperimental
        ? [...gridOptions, ...gridOptionsExpert]
        : gridOptions;

    const handleGridSizeChange = (
        selectedOption: SingleValue<{ value: number; label: string }>
    ) => {
        if (selectedOption) {
            setGridSize(selectedOption);
        }
    };
    return (
        <div className="gameController container">
            Generate Random Puzzle:
            <div className="generateContainer">
                <div style={{ width: "120px" }}>
                    <Select
                        defaultValue={gridOptions[1]}
                        options={combinedGridOptions}
                        onChange={handleGridSizeChange}
                    />
                </div>
                <button
                    onClick={() => handleGenerate(gridSize.value)}
                    disabled={loading || (!gamePaused && !gameWon)}
                >
                    generate
                </button>
            </div>
            <div className="experimentalContainer">
                <input
                    type="checkbox"
                    id="expert-sizes-toggle"
                    onChange={() =>
                        setActivateExperimental(!activateExperimental)
                    }
                />
                <label htmlFor="expert-sizes-toggle">Expert Sizes</label>
                {activateExperimental && (
                    <p>
                        Please note: Loading the grid might take some time and
                        could affect performance.
                    </p>
                )}
            </div>
            {!loading && (
                <button
                    className="reset"
                    onClick={handleReset}
                    disabled={gameWon}
                >
                    reset
                </button>
            )}
            {loading && (
                <div className="container">
                    <div className="loading">
                        Loading{" "}
                        <ImSpinner className="loading-spinner" size="20px" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameController;
