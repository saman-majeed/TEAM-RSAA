import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CandidateForm from './pages/CandidateForm';
import Disclaimer from './pages/Disclaimer';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterLogin from './pages/RecruiterLogin'; // New Import
import Navbar from './components/Navbar';

// Helper component to check if the admin is logged in
const ProtectedRoute = ({ children }) => {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    return isAdmin ? children : <Navigate to="/recruiter-login" />;
};

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-1 w-full max-w-7xl mx-auto py-8">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/candidate-form" element={<CandidateForm />} />
                        <Route path="/disclaimer" element={<Disclaimer />} />
                        <Route path="/candidate" element={<CandidateDashboard />} />

                        {/* Recruiter Routes */}
                        <Route path="/recruiter-login" element={<RecruiterLogin />} />
                        <Route
                            path="/recruiter"
                            element={
                                <ProtectedRoute>
                                    <RecruiterDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}