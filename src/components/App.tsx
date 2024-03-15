import "components/App.scss";
import NonogramGrid from "./NonogramGrid/NonogramGrid";
import { useMemo } from "react";
import GameController from "components/GameController/GameController";
import PlayController from "components/PlayController/PlayController";
import AppHeader from "components/AppHeader/AppHeader";
import About from "components/About/About";
import { useNonogramController } from "components/utils/useNonogramHandlers";

const App = () => {
    const {
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
    } = useNonogramController();

    const memoizedNonogramGrid = useMemo(() => {
        return (
            <NonogramGrid
                nonogram={nonogram}
                onMouseDownHandler={handleMouseDown}
                onMouseOverHandler={handleMouseOver}
                gamePaused={gamePaused}
            />
        );
    }, [gamePaused, handleMouseDown, handleMouseOver, nonogram]);
    // TODO - Hide single hints when solved
    // TODO - Use Context for state
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
                        gamePaused={gamePaused}
                    />
                    <PlayController
                        progress={nonogram.progress}
                        seconds={seconds}
                        handlePause={handlePause}
                        gamePaused={gamePaused}
                        handleUndo={handleUndo}
                        undoActive={nonogramHistory.length > 0}
                        fillModeEnabled={fillModeEnabled}
                        toggleMarking={handleToggleMarking}
                    />
                    <About />
                </div>
                {memoizedNonogramGrid}
            </div>
        </div>
    );
};

export default App;
