import { useState, useEffect } from 'react';

export default function RecruiterDashboard() {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/candidates')
            .then(res => res.json())
            .then(data => setCandidates(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Recruiter Dashboard</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm tracking-wider">
                            <th className="p-4 rounded-tl-lg">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Score</th>
                            <th className="p-4">Warnings</th>
                            <th className="p-4 rounded-tr-lg">AI Decision</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {candidates.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm text-gray-500">{c.id}</td>
                                <td className="p-4 font-semibold text-gray-800">{c.name}</td>
                                <td className="p-4 text-gray-600">{c.role}</td>
                                <td className="p-4 font-bold text-indigo-600">{c.score}%</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.warnings > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {c.warnings}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-700">{c.aiStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}