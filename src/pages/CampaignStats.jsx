import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import { Send, MailOpen, MousePointer, XCircle, RefreshCw, Search, Clock } from 'lucide-react';

const CampaignStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [campaignFileName, setCampaignFileName] = useState('');
    const [error, setError] = useState(null);
    const [savedCampaigns, setSavedCampaigns] = useState([]);

    useEffect(() => {
        // Load saved campaigns from localStorage
        const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        setSavedCampaigns(campaigns);
    }, []);

    const loadStats = async (fileName = campaignFileName) => {
        if (!fileName.trim()) {
            alert('Please select or enter a campaign file name');
            return;
        }

        setLoading(true);
        setError(null);
        console.log('Loading stats for:', fileName);

        try {
            const data = await api.getStats(fileName);
            console.log('Stats received:', data);

            if (!data || !data.fileName) {
                throw new Error('Campaign not found or no data available');
            }

            setStats(data);
        } catch (err) {
            console.error('Stats error:', err);
            setError(err.message || 'Failed to load campaign stats. The campaign may not exist or stats may not be available yet.');
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        if (campaignFileName.trim()) {
            loadStats();
        }
    };

    const selectCampaign = (fileName) => {
        setCampaignFileName(fileName);
        loadStats(fileName);
    };

    if (!stats && !loading && !error) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics</h1>
                    <p className="text-gray-500 mt-2">Real-time performance metrics for your campaigns.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Saved Campaigns List */}
                    {savedCampaigns.length > 0 && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock size={18} className="text-indigo-600" />
                                    Recent Campaigns
                                </h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {savedCampaigns.map((campaign, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => selectCampaign(campaign.fileName)}
                                            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                                        >
                                            <p className="font-medium text-gray-900 text-sm">{campaign.name}</p>
                                            <p className="text-xs text-gray-500 truncate mt-1">{campaign.subject}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(campaign.createdAt).toLocaleDateString()}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manual Entry */}
                    <div className={savedCampaigns.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="max-w-md mx-auto text-center">
                                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Search size={32} className="text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {savedCampaigns.length > 0 ? 'Or Enter Campaign Name' : 'Enter Campaign Name'}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {savedCampaigns.length > 0
                                        ? 'Select from the list or enter a campaign file name manually'
                                        : 'Enter the campaign file name to view statistics'
                                    }
                                </p>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={campaignFileName}
                                        onChange={(e) => setCampaignFileName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && loadStats()}
                                        placeholder="e.g., Newsletter_Jan_2024_1234567890.csv"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    <button
                                        onClick={() => loadStats()}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                                    >
                                        <Search size={18} />
                                        Load
                                    </button>
                                </div>
                                {savedCampaigns.length === 0 && (
                                    <p className="text-xs text-gray-400 mt-4">
                                        💡 Create a campaign in Email Composer to get started
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-500">Loading campaign analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics</h1>
                    <p className="text-gray-500 mt-2">Real-time performance metrics for your campaigns.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="text-red-600 mx-auto mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Stats</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setStats(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const data = [
        { name: 'Sent', value: stats.sent },
        { name: 'Opened', value: stats.opened },
        { name: 'Clicked', value: stats.clicked },
        { name: 'Bounced', value: stats.bounced },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics</h1>
                    <p className="text-gray-500 mt-2">Real-time performance metrics for your campaigns.</p>
                    {stats.fileName && (
                        <p className="text-sm text-indigo-600 mt-1 font-mono">Campaign: {stats.fileName}</p>
                    )}
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Sent" value={stats.sent} icon={Send} color="bg-indigo-500" />
                <StatCard title="Opened" value={stats.opened} icon={MailOpen} color="bg-emerald-500" />
                <StatCard title="Clicked" value={stats.clicked} icon={MousePointer} color="bg-amber-500" />
                <StatCard title="Bounced" value={stats.bounced} icon={XCircle} color="bg-red-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Engagement Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Delivery Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignStats;
