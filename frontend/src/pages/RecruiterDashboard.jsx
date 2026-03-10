import { useState, useEffect } from 'react';

export default function RecruiterDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/candidates');
                const data = await response.json();
                setCandidates(data);
            } catch (error) {
                console.error("Failed to fetch candidates", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Recruiter Dashboard</h2>

                {loading ? (
                    <p className="text-gray-500">Loading candidate data...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                                    <th className="p-4 border-b">Name</th>
                                    <th className="p-4 border-b">Role</th>
                                    <th className="p-4 border-b">Total Score</th>
                                    <th className="p-4 border-b">Warnings</th>
                                    <th className="p-4 border-b">Recording</th>
                                    <th className="p-4 border-b">AI Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {candidates.map((candidate) => (
                                    <tr key={candidate.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-900">{candidate.name}</td>
                                        <td className="p-4 text-gray-600">{candidate.role}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                                                {candidate.score} Pts
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`${candidate.warnings > 0 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                                {candidate.warnings}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {/* THIS CREATES THE LINK TO WATCH THE VIDEO */}
                                            {candidate.videoUrl ? (
                                                <a href={candidate.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                                                    Watch Video
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm font-medium">No Video</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {candidate.score >= 10 && candidate.warnings < 3 ? (
                                                <span className="text-green-600 font-semibold">Shortlist</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Reject</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}