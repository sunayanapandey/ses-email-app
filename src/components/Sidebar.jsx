import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, LayoutDashboard, Globe, Users, BarChart, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/domains', icon: Globe, label: 'Domains' },
        { to: '/compose', icon: Mail, label: 'Compose' },
        { to: '/contacts', icon: Users, label: 'Contacts' },
        { to: '/stats', icon: BarChart, label: 'Analytics' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    SES Sender
                </h1>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <User className="text-white" size={20} />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const active = isActive(item.to);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${active
                                ? 'bg-primary-500 text-white'
                                : 'text-gray-700 hover:bg-white hover:text-primary-600'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-white hover:text-red-600 rounded-lg transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
