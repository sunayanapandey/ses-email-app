import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Mail,
    BarChart2,
    Users,
    Globe,
    LogOut,
    User,
    Compass,
    Cloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label, isDashboard = false }) => {
        const active = isActive(to);
        return (
            <Link
                to={to}
                className={`flex items-center gap-3 px-6 py-3 transition-all text-sm font-medium relative group ${active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                    }`}
            >
                {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                )}
                <Icon size={isDashboard ? 20 : 18} className={active ? 'text-primary-500' : 'text-surface-400 group-hover:text-surface-600'} />
                <span>{label}</span>
            </Link>
        );
    };

    const SectionHeader = ({ label }) => (
        <div className="px-6 mt-6 mb-2">
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">
                {label}
            </p>
        </div>
    );

    return (
        <aside className="w-64 bg-white border-r border-surface-200 flex flex-col h-screen font-['Lexend_Deca']">
            {/* Logo Area */}
            <div className="p-6 mb-2">
                <div className="flex items-center gap-2 text-surface-900">
                    <Cloud className="h-8 w-8 text-primary-500 fill-current" />
                    <div>
                        <h1 className="text-lg font-bold leading-none">SES Sender</h1>
                        <p className="text-xs text-surface-500">cloud</p>
                    </div>
                </div>
            </div>

            {/* Scrollable Navigation */}
            <nav className="flex-1 overflow-y-auto py-2">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" isDashboard />
                <NavItem to="/compose" icon={Mail} label="Campaigns" />
                <NavItem to="/stats" icon={BarChart2} label="Analytics" />
                <NavItem to="/contacts" icon={Users} label="Contacts" />
                <NavItem to="/domains" icon={Globe} label="Domains" />
            </nav>

            {/* Bottom Profile Section */}
            <div className="border-t border-surface-200 p-4 mt-auto">
                <div className="flex flex-col gap-1">
                    <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors w-full text-left">
                        <User size={18} className="text-surface-400" />
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-surface-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors w-full text-left"
                    >
                        <LogOut size={18} className="text-surface-400" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* User Info Mini */}
                <div className="mt-4 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-surface-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-surface-500 truncate">{user.email}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
