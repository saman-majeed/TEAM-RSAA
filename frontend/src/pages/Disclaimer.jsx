import { useLocation, useNavigate } from 'react-router-dom';

export default function Disclaimer() {
    const navigate = useNavigate();
    const location = useLocation();

    // Catch the data passed from the Candidate Form
    const candidateData = location.state?.candidateData;

    const handleStartTest = () => {
        // Pass the data forward, but REPLACE the history so they can't go back
        navigate('/candidate', { state: { candidateData }, replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl border-t-4 border-red-500">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Assessment Rules & Disclaimer</h2>

                <div className="space-y-4 text-gray-700 bg-red-50 p-6 rounded-lg border border-red-100">
                    <p className="font-semibold text-lg border-b pb-2 border-red-200">Please read carefully before proceeding:</p>
                    <ul className="list-disc list-inside space-y-3 mt-4 text-md">
                        <li>You will have exactly <strong>10 minutes</strong> to complete this assessment.</li>
                        <li>Your <strong>webcam will be turned on</strong> and your session will be actively monitored.</li>
                        <li><strong>Tab switching is strictly prohibited.</strong> Navigating away from the test window will result in an immediate warning.</li>
                        <li>Multiple warnings may result in automatic disqualification.</li>
                    </ul>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 font-medium">
                        Go Back
                    </button>
                    <button onClick={handleStartTest} className="bg-red-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-red-700 transition shadow-md">
                        I Agree, Start Test
                    </button>
                </div>
            </div>
        </div>
    );
}