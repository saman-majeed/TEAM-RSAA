import { useState, useEffect } from 'react';
import Timer from '../components/Timer';
import ProctorCamera from '../components/ProctorCamera';

export default function CandidateDashboard() {
    const [warnings, setWarnings] = useState(0);
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings(prev => prev + 1);
                alert("Warning: Tab switching is strictly prohibited!");
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "Test User",
                    role: "Frontend Developer",
                    answers: answer,
                    warnings: warnings
                })
            });
            const data = await response.json();
            alert(`Assessment submitted! AI Score: ${data.generatedScore}`);

            // Clear the text area after successful submission
            setAnswer("");
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit assessment. Make sure the backend server is running.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold">Role-Specific Challenge</h2>
                    <Timer initialSeconds={600} onTimeUp={() => alert("Time is up!")} />
                </div>
                <p className="text-gray-700 mb-4">Explain the concept of React Hooks and provide a brief example.</p>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Write your solution here..."
                ></textarea>
                <div className="mt-4 flex justify-end">
                    <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                        Submit Assessment
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 h-fit border-t-4 border-indigo-600">
                <h3 className="font-bold text-gray-800 mb-4">Live Monitoring</h3>
                <ProctorCamera />
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="text-gray-700 font-medium">Tab Warnings:</span>
                        <span className={`font-bold text-lg ${warnings > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {warnings}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}