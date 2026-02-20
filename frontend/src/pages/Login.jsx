import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-full mt-20">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to TEAM</h2>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/candidate')}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                    >
                        Candidate Portal
                    </button>
                    <button
                        onClick={() => navigate('/recruiter')}
                        className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition"
                    >
                        Recruiter Portal
                    </button>
                </div>
            </div>
        </div>
    );
}