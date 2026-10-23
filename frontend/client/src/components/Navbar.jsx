import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-600 tracking-wide">
            Mini CRM
          </span>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <span className="text-sm sm:text-base text-gray-700 font-medium">
            Welcome, <span className="font-semibold text-gray-900">{user.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}