import React, { useEffect, useState, useMemo, useCallback } from 'react';
import API from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ 
    title: '', 
    lead: '', 
    assignedTo: '', 
    dueDate: '',
    status: 'Pending'
  });
  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const fetchData = async () => {
    try {
      const [tasksRes, leadsRes, usersRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/leads'),
        API.get('/auth/users').catch(() => ({ data: [] }))
      ]);
      
      const tasksData = Array.isArray(tasksRes.data) ? tasksRes.data : (tasksRes.data.tasks || []);
      const leadsData = Array.isArray(leadsRes.data) ? leadsRes.data : (leadsRes.data.leads || []);
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
      
      setTasks(tasksData);
      setLeads(leadsData);
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data', err);
      setTasks([]);
      setLeads([]);
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter(task => 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.lead?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, tasks]);

  const handleToggleStatus = async (task) => {
    const assignedUserId = task.assignedTo?._id || task.assignedTo;

    // Strict frontend validation
    if (!assignedUserId || String(assignedUserId) !== String(loggedInUser.id)) {
      alert('Permission Denied! Only the assigned user can update this task status.');
      return;
    }

    const newStatus = task.status === 'Done' ? 'Pending' : 'Done';

    try {
      await API.put(`/tasks/${task._id}`, {
        ...task,
        lead: task.lead?._id || task.lead,
        assignedTo: assignedUserId,
        status: newStatus
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        lead: form.lead === '' ? null : form.lead,
        assignedTo: form.assignedTo === '' ? null : form.assignedTo
      };

      if (editingId) {
        await API.put(`/tasks/${editingId}`, payload);
        alert('Task updated successfully!');
      } else {
        await API.post('/tasks', payload);
        alert('Task added successfully!');
      }

      closeModal();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving task');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ 
      title: '', 
      lead: '', 
      assignedTo: '', 
      dueDate: '', 
      status: 'Pending' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    setForm({
      title: task.title || '',
      lead: task.lead?._id || task.lead || '',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
      dueDate: formattedDate,
      status: task.status || 'Pending'
    });
    setEditingId(task._id);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ title: '', lead: '', assignedTo: '', dueDate: '', status: 'Pending' });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchData();
      } catch (err) {
        alert('Error deleting task');
      }
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = useMemo(() => {
    return Array.isArray(filteredTasks) ? filteredTasks.slice(indexOfFirstTask, indexOfLastTask) : [];
  }, [filteredTasks, indexOfFirstTask, indexOfLastTask]);

  const totalPages = Math.ceil((filteredTasks?.length || 0) / tasksPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        
        <div className="flex items-center gap-4">
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search tasks..."
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
            + Add Task
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-white">
              <h2 className="text-base font-bold text-gray-800">
                {editingId ? 'Edit Task' : 'Add Task'}
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
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Title *</label>
                <input 
                  type="text" 
                  placeholder="Task Title" 
                  value={form.title} 
                  onChange={(e) => setForm({...form, title: e.target.value})} 
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Lead *</label>
                <select
                  value={form.lead}
                  onChange={(e) => setForm({...form, lead: e.target.value})}
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Lead</option>
                  {leads.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Assign To *</label>
                <select
                  value={form.assignedTo}
                  onChange={(e) => setForm({...form, assignedTo: e.target.value})}
                  required
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Due Date *</label>
                <input 
                  type="date" 
                  value={form.dueDate} 
                  onChange={(e) => setForm({...form, dueDate: e.target.value})} 
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
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
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
              <th className="p-4">Title</th>
              <th className="p-4">Lead</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {currentTasks.map((task) => {
              return (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{task.title}</td>
                  <td className="p-4 text-sm font-semibold text-gray-700">
                    {task.lead?.name || 'N/A'}
                  </td>
                  <td className="p-4 text-sm">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition flex items-center gap-1 ${
                        task.status === 'Done' 
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                      }`}
                    >
                      {task.status || 'Pending'}
                    </button>
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    <button onClick={() => handleEdit(task)} className="text-blue-600 hover:underline text-sm font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:underline text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {currentTasks.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">No tasks found.</td>
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