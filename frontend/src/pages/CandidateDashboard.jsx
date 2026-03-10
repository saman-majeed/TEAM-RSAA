import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import ProctorCamera from '../components/ProctorCamera';

export default function CandidateDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const candidateData = location.state?.candidateData || { name: "Anonymous Candidate", role: "Frontend Developer" };

    const [warnings, setWarnings] = useState(0);
    const [difficulty, setDifficulty] = useState("easy");
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingAI, setIsLoadingAI] = useState(true);
    const [askedQuestions, setAskedQuestions] = useState([]);

    // NEW: Video Recording State
    const [stopRecord, setStopRecord] = useState(false);

    useEffect(() => {
        loadNextQuestion("easy", []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadNextQuestion = async (targetDifficulty, currentAskedList = askedQuestions) => {
        setIsLoadingAI(true);
        setCurrentQuestion(null);
        setSelectedOption("");

        try {
            const response = await fetch('http://localhost:5000/api/generate-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: candidateData.role, difficulty: targetDifficulty, askedTopics: currentAskedList })
            });
            const aiQuestion = await response.json();
            setCurrentQuestion(aiQuestion);
            setDifficulty(targetDifficulty);
            setQuestionStartTime(Date.now());
            setAskedQuestions(prev => [...prev, aiQuestion.q]);
        } catch (error) {
            alert("Connection to AI lost.");
        } finally {
            setIsLoadingAI(false);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !isSubmitting) {
                setWarnings(prev => prev + 1);
                alert("Warning: Tab switching is strictly prohibited!");
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isSubmitting]);

    useEffect(() => {
        window.history.pushState(null, null, window.location.href);
        const handleBackButton = () => {
            window.history.pushState(null, null, window.location.href);
            alert("Security Warning: You cannot leave this page during an active assessment!");
        };
        window.addEventListener('popstate', handleBackButton);
        return () => window.removeEventListener('popstate', handleBackButton);
    }, []);

    const handleNextQuestion = () => {
        if (!selectedOption) return;
        const timeTakenSeconds = (Date.now() - questionStartTime) / 1000;
        const isCorrect = selectedOption === currentQuestion.a;

        const points = difficulty === "hard" ? 15 : difficulty === "medium" ? 10 : 5;
        if (isCorrect) setScore(score + points);
        setQuestionsAnswered(questionsAnswered + 1);

        let nextDifficulty = difficulty;
        if (isCorrect && timeTakenSeconds < 15) {
            if (difficulty === "easy") nextDifficulty = "medium";
            else if (difficulty === "medium") nextDifficulty = "hard";
        } else if (!isCorrect) {
            if (difficulty === "hard") nextDifficulty = "medium";
            else if (difficulty === "medium") nextDifficulty = "easy";
        }

        loadNextQuestion(nextDifficulty, [...askedQuestions, currentQuestion.q]);
    };

    // 1. Triggered when timer runs out or "End Test" is clicked
    const triggerSubmit = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setStopRecord(true); // Tells the camera to stop and process the video
    };

    // 2. The camera finishes processing the video and sends it here
    const handleVideoReady = async (videoBase64) => {
        try {
            await fetch('http://localhost:5000/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: candidateData.name,
                    role: candidateData.role,
                    answers: `Attempted ${questionsAnswered} questions. Score calculated internally.`,
                    warnings: warnings,
                    actualScore: score,
                    videoBase64: videoBase64 // Send the video!
                })
            });
            alert(`Assessment submitted successfully! You may now close this page.`);
            navigate('/');
        } catch (error) {
            alert("Failed to save final score.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-8 relative">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">AI {candidateData.role} Challenge</h2>
                        <p className="text-indigo-600 font-semibold mt-1">Candidate: {candidateData.name}</p>
                    </div>
                    <Timer initialSeconds={600} onTimeUp={triggerSubmit} />
                </div>

                {isLoadingAI || isSubmitting ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium animate-pulse">
                            {isSubmitting ? "Uploading video and submitting test..." : "AI is generating your next question..."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-xl text-gray-800 font-medium">{currentQuestion?.q}</p>
                        </div>
                        <div className="space-y-3 mb-8">
                            {currentQuestion?.options.map((option, index) => (
                                <label key={index} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedOption === option ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="mcq" value={option} checked={selectedOption === option} onChange={(e) => setSelectedOption(e.target.value)} className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                                    <span className="ml-3 text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleNextQuestion} disabled={!selectedOption} className={`px-8 py-3 rounded-lg font-bold transition shadow-md ${!selectedOption ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                Next Question
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white rounded-xl shadow p-6 h-fit border-t-4 border-indigo-600">
                <h3 className="font-bold text-gray-800 mb-4">Live Proctoring</h3>
                {/* Notice the new props! */}
                <ProctorCamera stopRecording={stopRecord} onVideoReady={handleVideoReady} />

                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span className="text-gray-700 font-medium">Tab Warnings:</span>
                        <span className={`font-bold text-lg ${warnings > 0 ? 'text-red-500' : 'text-green-500'}`}>{warnings}</span>
                    </div>
                    {/* POINTS ARE NOW HIDDEN FROM THE CANDIDATE! */}
                </div>

                <button onClick={triggerSubmit} disabled={isSubmitting} className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50">
                    {isSubmitting ? "Submitting..." : "End Test Early"}
                </button>
            </div>
        </div>
    );
}