import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Globe, Mail, Users, BarChart } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import DomainManager from './pages/DomainManager';
import EmailComposer from './pages/EmailComposer';
import ContactManager from './pages/ContactManager';
import CampaignStats from './pages/CampaignStats';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <Mail className="h-6 w-6" />
              SES Sender
            </h1>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink to="/domains" icon={<Globe size={20} />} label="Domains" />
            <NavLink to="/compose" icon={<Mail size={20} />} label="Compose" />
            <NavLink to="/contacts" icon={<Users size={20} />} label="Contacts" />
            <NavLink to="/stats" icon={<BarChart size={20} />} label="Analytics" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/domains" element={<DomainManager />} />
            <Route path="/compose" element={<EmailComposer />} />
            <Route path="/contacts" element={<ContactManager />} />
            <Route path="/stats" element={<CampaignStats />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export default App;
