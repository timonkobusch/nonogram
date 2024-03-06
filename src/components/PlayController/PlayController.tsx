import { FaPause } from 'react-icons/fa';
import { IoIosUndo } from 'react-icons/io';
import './PlayController.scss';
interface IPlayControllerProps {
    progress: {
        isWon: boolean;
        cellsToBeMarked: number;
        cellsMarked: number;
    };
    seconds: number;
    handleUndo: () => void;
    undoActive: boolean;
}

const PlayController = ({ progress, seconds, handleUndo, undoActive }: IPlayControllerProps) => {
    const { isWon, cellsToBeMarked, cellsMarked } = progress;
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (
        <div className="playController container">
            <div className="timeContainer">
                <button>
                    <FaPause />
                    pause
                </button>
                <div>{formatTime(seconds)}</div>
            </div>
            <div className="progressContainer">
                <progress value={cellsMarked} max={cellsToBeMarked}></progress>
                <div>
                    <span className={cellsMarked > cellsToBeMarked ? 'warning' : ' '}>{cellsMarked}</span> /{cellsToBeMarked}{' '}
                    {isWon ? 'won' : 'marked'}
                </div>
            </div>
            <div className="undoContainer">
                <button className="undoButton" onClick={handleUndo} disabled={!undoActive}>
                    <IoIosUndo />
                    undo
                </button>
            </div>
        </div>
    );
};

export default PlayController;
