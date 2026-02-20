import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="p-4 bg-white shadow-md flex justify-between items-center">
            <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
                TEAM-RSAA
            </Link>
            <div className="text-sm font-medium text-gray-500">
                Role Specific Adaptive Assessments
            </div>
        </nav>
    );
}