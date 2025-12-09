import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { setSessionExpiredCallback } from './services/api';
import { AlertCircle } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import DomainManager from './pages/DomainManager';
import EmailComposer from './pages/EmailComposer';
import ContactManager from './pages/ContactManager';
import CampaignStats from './pages/CampaignStats';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Components
import Sidebar from './components/Sidebar';
import ButtonExamples from './components/ButtonExamples';

function SessionExpiredNotification() {
  const { sessionExpired, setSessionExpired } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (sessionExpired) {
      // Auto-clear the notification after 5 seconds
      const timer = setTimeout(() => {
        setSessionExpired(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sessionExpired, setSessionExpired]);

  if (!sessionExpired) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg animate-slide-down">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">Session Expired</h3>
            <p className="text-sm text-red-700 mt-1">
              Your session has expired. Please log in again.
            </p>
          </div>
          <button
            onClick={() => setSessionExpired(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { handleSessionExpired } = useAuth();

  useEffect(() => {
    // Set the session expiration callback for the API
    console.log('✅ Registering session expiration callback');
    setSessionExpiredCallback(handleSessionExpired);
  }, [handleSessionExpired]);

  return (
    <>
      <SessionExpiredNotification />
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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/buttons" element={<ButtonExamples />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
