import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CandidateForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        degree: '',
        date: new Date().toISOString().split('T')[0], // Defaults to today's date
        role: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        // Send the data to the next screen (Disclaimer)
        navigate('/disclaimer', { state: { candidateData: formData } });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border-t-4 border-indigo-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Candidate Details</h2>
                <form onSubmit={handleNext} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" required onChange={handleChange} value={formData.name} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" required onChange={handleChange} value={formData.email} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" required onChange={handleChange} value={formData.phone} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Degree/Qualification</label>
                        <input type="text" name="degree" required onChange={handleChange} value={formData.degree} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" required onChange={handleChange} value={formData.date} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Applying For</label>
                        <select name="role" required onChange={handleChange} value={formData.role} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="" disabled>Select a position...</option>
                            <option value="Software Development">Software Development</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="MERN Stack Developer">MERN Stack Developer</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 transition">
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}