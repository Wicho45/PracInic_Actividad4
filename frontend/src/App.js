import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Layout from './pages/layout';
import Profile from './pages/profile';
import Restore from './pages/restore';
import Sign from './pages/sigin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/layout" element={<Layout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/restore" element={<Restore />} />
            <Route path="/sigin" element={<Sign />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;