import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', industry: '', location: '' });
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [associatedLeads, setAssociatedLeads] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await API.get('/companies');
      const data = Array.isArray(res.data) ? res.data : (res.data.companies || res.data.data || []);
      setCompanies(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching companies', err);
      setCompanies([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await API.post('/companies', form);
      setForm({ name: '', industry: '', location: '' });
      fetchCompanies();
      alert('Company added successfully!');
    } catch (err) {
      alert('Error adding company');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering row click detail view
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await API.delete(`/companies/${id}`);
        fetchCompanies();
      } catch (err) {
        alert('Error deleting company');
      }
    }
  };

  const handleRowClick = async (id) => {
    try {
      const res = await API.get(`/companies/${id}`);
      setSelectedCompany(res.data.company);
      setAssociatedLeads(res.data.leads || []);
    } catch (err) {
      console.error('Error fetching company details', err);
      alert('Error loading company details');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium">Loading companies...</p>
      </div>
    );
  }

  if (selectedCompany) {
    return (
      <div className="space-y-6">
        <div>
          <button 
            onClick={() => setSelectedCompany(null)}
            className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            &larr; Back to Companies
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{selectedCompany.name}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div><span className="font-semibold">Industry:</span> {selectedCompany.industry}</div>
            <div><span className="font-semibold">Location:</span> {selectedCompany.location || 'N/A'}</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Associated Leads</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {associatedLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4 text-sm">{lead.email}</td>
                    <td className="p-4 text-sm text-gray-600">{lead.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{lead.assignedTo || 'Unassigned'}</td>
                  </tr>
                ))}
                {associatedLeads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-400">No leads associated with this company.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Companies Management</h1>

      
      <form onSubmit={handleCreateCompany} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <input 
          type="text" 
          placeholder="Company Name" 
          value={form.name} 
          onChange={(e) => setForm({...form, name: e.target.value})} 
          required
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <input 
          type="text" 
          placeholder="Industry" 
          value={form.industry} 
          onChange={(e) => setForm({...form, industry: e.target.value})} 
          required
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <input 
          type="text" 
          placeholder="Location" 
          value={form.location} 
          onChange={(e) => setForm({...form, location: e.target.value})} 
          required
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm">
          Add Company
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium">
              <th className="p-4">Company Name</th>
              <th className="p-4">Industry</th>
              <th className="p-4">Location</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {companies.map((company) => (
              <tr 
                key={company._id} 
                onClick={() => handleRowClick(company._id)}
                className="hover:bg-blue-50 cursor-pointer transition"
              >
                <td className="p-4 font-medium text-blue-600">{company.name}</td>
                <td className="p-4 text-sm">{company.industry}</td>
                <td className="p-4 text-sm text-gray-600">{company.location || 'N/A'}</td>
                <td className="p-4">
                  <button 
                    onClick={(e) => handleDelete(e, company._id)} 
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">No companies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}