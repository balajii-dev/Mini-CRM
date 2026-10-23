import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    totalLeads: 0, 
    qualifiedLeads: 0, 
    totalCompanies: 0,
    tasksDueToday: 0, 
    completedTasks: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        setStats({
          totalLeads: res.data.totalLeads ?? 0,
          qualifiedLeads: res.data.qualifiedLeads ?? 0,
          totalCompanies: res.data.totalCompanies ?? 0,
          tasksDueToday: res.data.tasksDueToday ?? 0,
          completedTasks: res.data.completedTasks ?? 0
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
        setError('Failed to load dashboard statistics.');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/leads')}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalLeads}</p>
        </div>

        <div 
          onClick={() => navigate('/leads')}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-sm font-medium text-gray-500">Qualified Leads</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.qualifiedLeads}</p>
        </div>

        <div 
          onClick={() => navigate('/companies')}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Companies</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalCompanies}</p>
        </div>

        <div 
          onClick={() => navigate('/tasks')}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-sm font-medium text-gray-500">Tasks Due Today</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.tasksDueToday}</p>
        </div>

        <div 
          onClick={() => navigate('/tasks')}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedTasks}</p>
        </div>
      </div>
    </div>
  );
}