import { FaPause, FaPlay } from "react-icons/fa";
import { IoIosUndo } from "react-icons/io";
import "./PlayController.scss";
import { MdSquare, MdClose } from "react-icons/md";
interface IPlayControllerProps {
    progress: {
        isWon: boolean;
        cellsToBeMarked: number;
        cellsMarked: number;
    };
    seconds: number;
    handleUndo: () => void;
    undoActive: boolean;
    handlePause: () => void;
    gamePaused: boolean;
    fillModeEnabled: boolean;
    toggleMarking: () => void;
}

const PlayController = ({
    progress,
    seconds,
    handleUndo,
    handlePause,
    undoActive,
    gamePaused,
    fillModeEnabled,
    toggleMarking,
}: IPlayControllerProps) => {
    const { isWon, cellsToBeMarked, cellsMarked } = progress;
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`;
    };
    return (
        <div className="playController container">
            <div className="timeContainer">
                <button onClick={handlePause} disabled={isWon}>
                    {gamePaused ? <FaPlay /> : <FaPause />}
                </button>
                <div className="timeDisplay">{formatTime(seconds)}</div>
            </div>
            <div className="progressContainer">
                <progress value={cellsMarked} max={cellsToBeMarked}></progress>
                <div>
                    <span
                        className={
                            cellsMarked > cellsToBeMarked ? "warning" : " "
                        }
                    >
                        {cellsMarked}
                    </span>{" "}
                    / {cellsToBeMarked} {isWon ? "won" : "marked"}
                </div>
            </div>
            <div className="controlContainer">
                <button
                    className="undoButton"
                    onClick={handleUndo}
                    disabled={!undoActive || isWon}
                >
                    <IoIosUndo />
                </button>
                <div className="toggle-container" onClick={toggleMarking}>
                    <div
                        className={`slider ${fillModeEnabled ? "active" : ""}`}
                    >
                        <div
                            className={`icon ${
                                !fillModeEnabled ? "icon-inactive" : ""
                            }`}
                        >
                            <MdSquare />
                        </div>
                        <div
                            className={`icon ${
                                fillModeEnabled ? "icon-inactive" : ""
                            }`}
                        >
                            <MdClose />
                        </div>
                    </div>
                </div>
                <div className="text">'F' to toggle</div>
            </div>
        </div>
    );
};

export default PlayController;
