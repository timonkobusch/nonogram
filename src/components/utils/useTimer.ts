import { useEffect, useMemo, useState } from 'react';

const useTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined = undefined;
        if (active) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else if (!active) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [active]);

    // Function to reset the timer
    const resetTimer = (startAt?: number) => {
        setActive(false);
        setSeconds(startAt || 0);
    };

    const pauseTimer = useMemo(() => {
        return () => {
            setActive(false);
        };
    }, [])

    const startTimer = () => {
        setActive(true);
    };
    return { seconds, resetTimer, pauseTimer, startTimer };
};

export default useTimer;
