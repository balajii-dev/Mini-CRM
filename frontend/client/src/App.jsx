import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Companies from './pages/Companies';
import Tasks from './pages/Tasks';
import Layout from './components/Layout';

export default function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

       
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
}