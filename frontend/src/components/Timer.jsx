import { useState, useEffect } from 'react';

export default function Timer({ initialSeconds, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-xl font-mono font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            Time Left: {minutes}:{seconds < 10 ? '0' : ''}{seconds}
        </div>
    );
}