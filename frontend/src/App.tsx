import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Cashier } from '@/pages/Cashier';
import { Inventory } from '@/pages/Inventory';
import { Layout } from '@/components/Layout';
import '@/styles/globals.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {token ? (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
