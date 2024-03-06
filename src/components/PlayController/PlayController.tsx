interface IPlayControllerProps {
    progress: {
        isWon: boolean;
        cellsToBeMarked: number;
        cellsMarked: number;
    };
    seconds: number;
}

const PlayController = ({ progress, seconds }: IPlayControllerProps) => {
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (
        <div className="playController container">
            <div>{formatTime(seconds)}</div>
            <div>
                {progress.cellsMarked} /{progress.cellsToBeMarked} {progress.isWon ? 'won' : 'marked'}
            </div>
            <div>
                <button>back</button>
                <button>forward</button>
            </div>
        </div>
    );
};

export default PlayController;
