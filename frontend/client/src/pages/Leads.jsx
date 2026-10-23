import React, { useEffect, useState, useMemo, useCallback } from 'react';
import API from '../api';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    status: 'New', 
    assignedTo: '', 
    company: '' 
  });
  
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const fetchData = async () => {
    try {
      const [leadsRes, companiesRes] = await Promise.all([
        API.get('/leads'),
        API.get('/companies')
      ]);
      
      const leadsData = Array.isArray(leadsRes.data) ? leadsRes.data : (leadsRes.data.leads || leadsRes.data.data || []);
      const companiesData = Array.isArray(companiesRes.data) ? companiesRes.data : (companiesRes.data.companies || companiesRes.data.data || []);
      
      setLeads(leadsData);
      setCompanies(companiesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data', err);
      setLeads([]);
      setCompanies([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    return leads.filter(lead => 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof lead.assignedTo === 'string' && lead.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.company?.name && lead.company.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, leads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        company: form.company === '' ? null : form.company
      };

      if (editingId) {
        await API.put(`/leads/${editingId}`, payload);
        alert('Lead updated successfully!');
      } else {
        await API.post('/leads', payload);
        alert('Lead added successfully!');
      }

      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error saving lead');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: '', email: '', phone: '', status: 'New', assignedTo: '', company: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (lead) => {
    setForm({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'New',
      assignedTo: lead.assignedTo || '',
      company: lead.company?._id || lead.company || ''
    });
    setEditingId(lead._id);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', email: '', phone: '', status: 'New', assignedTo: '', company: '' });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await API.delete(`/leads/${id}`);
        fetchData();
      } catch (err) {
        alert('Error deleting lead');
      }
    }
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = useMemo(() => {
    return Array.isArray(filteredLeads) ? filteredLeads.slice(indexOfFirstLead, indexOfLastLead) : [];
  }, [filteredLeads, indexOfFirstLead, indexOfLastLead]);

  const totalPages = Math.ceil((filteredLeads?.length || 0) / leadsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
        
        <div className="flex items-center gap-4">
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
            />
          </div>
          
          <button 
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm shadow-sm whitespace-nowrap"
          >
            + Add Lead
          </button>
        </div>
      </div>

  
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
            
           
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-white">
              <h2 className="text-base font-bold text-gray-800">
                {editingId ? 'Edit Lead' : 'Add Lead'}
              </h2>
              <button 
                type="button"
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 rounded-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter name" 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Email *</label>
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  value={form.email} 
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Phone *</label>
                <input 
                  type="text" 
                  placeholder="Enter phone number" 
                  value={form.phone} 
                  onChange={(e) => setForm({...form, phone: e.target.value})} 
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Status *</label>
                <select 
                  value={form.status} 
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Assigned To *</label>
                <input 
                  type="text" 
                  placeholder="Assignee name" 
                  value={form.assignedTo} 
                  onChange={(e) => setForm({...form, assignedTo: e.target.value})} 
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Company *</label>
                <select
                  value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Company</option>
                  {companies.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {currentLeads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{lead.name}</td>
                <td className="p-4 text-sm">{lead.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    lead.status === 'Qualified' ? 'bg-green-50 text-green-600' :
                    lead.status === 'Lost' ? 'bg-red-50 text-red-600' :
                    lead.status === 'Contacted' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">{lead.assignedTo || 'Unassigned'}</td>
                <td className="p-4 flex items-center space-x-3">
                  <button onClick={() => handleEdit(lead)} className="text-blue-600 hover:underline text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:underline text-sm font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentLeads.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-white border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}