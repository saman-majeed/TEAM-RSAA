import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Welcome to TEAM</h1>

                <div className="flex flex-col space-y-4">
                    {/* Notice this now points to /candidate-form instead of /candidate */}
                    <Link
                        to="/candidate-form"
                        className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
                    >
                        Candidate Portal
                    </Link>

                    <Link
                        to="/recruiter"
                        className="bg-gray-800 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-900 transition shadow-md"
                    >
                        Recruiter Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}