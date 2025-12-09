import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, LayoutDashboard, Globe, Users, BarChart, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

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
        <aside className="w-64 bg-surface-25 border-r border-surface-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-surface-200">
                <h1 className="text-h4 text-primary-500 flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    SES Sender
                </h1>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-surface-200">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-surface-200">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <User className="text-white" size={20} />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-body font-medium text-surface-900 truncate">
                            {user.name}
                        </p>
                        <p className="text-caption text-surface-600">
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
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-h5 ${active
                                ? 'bg-primary-500 text-white'
                                : 'text-surface-700 hover:bg-white hover:text-primary-600'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-surface-200">
                <Button
                    variant="ghost"
                    fullWidth
                    onClick={logout}
                    icon={LogOut}
                    className="justify-start text-surface-700 hover:text-error-600"
                >
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
