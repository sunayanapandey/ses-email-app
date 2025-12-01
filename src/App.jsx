import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import DomainManager from './pages/DomainManager';
import EmailComposer from './pages/EmailComposer';
import ContactManager from './pages/ContactManager';
import CampaignStats from './pages/CampaignStats';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Sidebar */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/domains" element={<DomainManager />} />
                    <Route path="/compose" element={<EmailComposer />} />
                    <Route path="/contacts" element={<ContactManager />} />
                    <Route path="/stats" element={<CampaignStats />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
