import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/candidate" element={<CandidateDashboard />} />
                        <Route path="/recruiter" element={<RecruiterDashboard />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}