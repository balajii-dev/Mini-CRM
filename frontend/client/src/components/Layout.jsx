import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <Navbar />

      <div className="flex flex-1 relative">
        
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block shrink-0 p-4 space-y-2 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            <a 
              href="/dashboard" 
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Dashboard
            </a>
            <a 
              href="/leads" 
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive('/leads') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Leads
            </a>
            <a 
              href="/companies" 
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive('/companies') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Companies
            </a>
            <a 
              href="/tasks" 
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive('/tasks') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Tasks
            </a>
          </nav>
        </aside>

       
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}