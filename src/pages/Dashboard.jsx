import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, BarChart, Plus, ArrowRight, Activity, Coins, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentActivity] = useState([
        { id: 1, action: 'Send campaigns via Email Composer', time: 'Get started' },
        { id: 2, action: 'Track campaign performance in Analytics', time: 'Real-time stats' },
        { id: 3, action: 'Upload and preview contact lists', time: 'CSV format' },
    ]);

    useEffect(() => {
        loadBalance();
    }, []);

    const loadBalance = async () => {
        setLoading(true);
        try {
            const bal = await api.getBalance();
            setBalance(bal);
        } catch (error) {
            console.error('Failed to load balance:', error);
            setBalance(100); // Fallback
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ label, value, icon: Icon, color, to, loading }) => (
        <Link to={to} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {loading ? (
                            <span className="inline-block w-20 h-8 bg-gray-200 animate-pulse rounded"></span>
                        ) : (
                            value
                        )}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
                View Details <ArrowRight size={16} className="ml-1" />
            </div>
        </Link>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadBalance}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        title="Refresh balance"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <Link
                        to="/compose"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={20} />
                        New Campaign
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email Balance</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {loading ? (
                                    <span className="inline-block w-20 h-8 bg-gray-200 animate-pulse rounded"></span>
                                ) : (
                                    balance?.toLocaleString() || '0'
                                )}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Available credits</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-500 bg-opacity-10">
                            <Coins size={24} className="text-amber-500" />
                        </div>
                    </div>
                </div>

                <StatCard
                    label="Active Campaigns"
                    value="Track in Analytics"
                    icon={Mail}
                    color="bg-blue-500"
                    to="/stats"
                />
                <StatCard
                    label="Contact Lists"
                    value="Manage Contacts"
                    icon={Users}
                    color="bg-emerald-500"
                    to="/contacts"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/compose" className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-full text-indigo-600"><Mail size={20} /></div>
                            <span className="font-medium text-gray-700">Create Campaign</span>
                        </Link>
                        <Link to="/stats" className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-full text-purple-600"><BarChart size={20} /></div>
                            <span className="font-medium text-gray-700">View Analytics</span>
                        </Link>
                        <Link to="/domains" className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Activity size={20} /></div>
                            <span className="font-medium text-gray-700">Verify Domain</span>
                        </Link>
                        <Link to="/contacts" className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600"><Users size={20} /></div>
                            <span className="font-medium text-gray-700">Import Contacts</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Getting Started</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
