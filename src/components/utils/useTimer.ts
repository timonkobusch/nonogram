import { useEffect, useState } from 'react';

const useTimer = (initialState: boolean) => {
    const [seconds, setSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(initialState);

    useEffect(() => {
        let interval: number | null = null;

        if (timerActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerActive]);

    // Function to reset the timer
    const resetTimer = () => {
        setSeconds(0);
        setTimerActive(false);
        setTimeout(() => {
            setTimerActive(true);
        }, 700); // Delay to simulate a resetting process
    };

    return { seconds, resetTimer };
};

export default useTimer;
