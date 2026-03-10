import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecruiterLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Strict check for the credentials you requested
        if (username === 'admin' && password === 'admin786') {
            // Save a temporary session so the user stays logged in for this visit
            sessionStorage.setItem('isAdmin', 'true');
            navigate('/recruiter');
        } else {
            alert('Invalid Admin Credentials!');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md border-t-4 border-gray-800">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Recruiter Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-md focus:ring-gray-500 focus:border-gray-500"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-md focus:ring-gray-500 focus:border-gray-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-md font-bold hover:bg-gray-900 transition mt-4">
                        Login as Admin
                    </button>
                </form>
            </div>
        </div>
    );
}