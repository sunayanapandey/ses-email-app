import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import { Send, MailOpen, MousePointer, XCircle, RefreshCw, Search, Clock } from 'lucide-react';
import Button from '../components/Button';

const CampaignStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [campaignFileName, setCampaignFileName] = useState('');
    const [error, setError] = useState(null);
    const [savedCampaigns, setSavedCampaigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        // Load campaigns from API instead of localStorage
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            const campaigns = await api.getCampaigns();
            // Sort by newest first
            const sortedCampaigns = campaigns.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setSavedCampaigns(sortedCampaigns);
        } catch (error) {
            console.error('Failed to load campaigns:', error);
            setSavedCampaigns([]);
        }
    };

    const loadStats = async (fileName = campaignFileName) => {
        if (!fileName.trim()) {
            alert('Please select or enter a campaign name');
            return;
        }

        setLoading(true);
        setError(null);
        console.log('Loading stats for:', fileName);

        try {
            const data = await api.getCampaign(fileName);
            console.log('Campaign received:', data);

            if (!data || !data.campaignId) {
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

    const filteredCampaigns = savedCampaigns.filter(campaign => {
        const searchLower = searchTerm.toLowerCase();
        const name = (campaign.name || campaign.campaignId || '').toLowerCase();
        const subject = (campaign.subject || '').toLowerCase();
        return name.includes(searchLower) || subject.includes(searchLower);
    });

    if (!stats && !loading && !error) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-h1 text-surface-900">Campaign Analytics</h1>
                    <p className="text-surface-500 mt-2">Real-time performance metrics for your campaigns.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Saved Campaigns List */}
                    {savedCampaigns.length > 0 && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-6">
                                <h3 className="text-h4 text-surface-900 mb-4 flex items-center gap-2">
                                    <Clock size={18} className="text-primary-500" />
                                    Recent Campaigns
                                </h3>

                                {/* Search Input */}
                                <div className="mb-4 relative">
                                    <input
                                        type="text"
                                        placeholder="Search campaigns..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-surface-200 rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                    <Search size={16} className="absolute left-3 top-2.5 text-surface-400" />
                                </div>

                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredCampaigns.length > 0 ? (
                                        filteredCampaigns.map((campaign, idx) => (
                                            <button
                                                key={campaign.campaignId || idx}
                                                onClick={() => selectCampaign(campaign.campaignId)}
                                                className="w-full text-left p-3 border border-surface-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                                            >
                                                <p className="text-h6 text-surface-900">
                                                    {campaign.name || campaign.campaignId || 'Unnamed Campaign'}
                                                </p>
                                                <p className="text-caption text-surface-500 truncate mt-1">
                                                    {campaign.subject || 'No subject'}
                                                </p>
                                                <div className="flex gap-3 mt-1 text-caption text-surface-400">
                                                    <span>Sent: {campaign.sent || 0}</span>
                                                    <span>Open: {campaign.opened || 0}</span>
                                                </div>
                                                <p className="text-caption text-surface-400 mt-1">
                                                    {campaign.createdAt
                                                        ? new Date(campaign.createdAt).toLocaleDateString()
                                                        : 'N/A'}
                                                </p>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-body text-surface-500">
                                            No campaigns found matching "{searchTerm}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manual Entry */}
                    <div className={savedCampaigns.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <div className="bg-white rounded-xl shadow-sm border border-surface-100 p-8">
                            <div className="max-w-md mx-auto text-center">
                                <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Search size={32} className="text-primary-500" />
                                </div>
                                <h3 className="text-h3 text-surface-900 mb-2">
                                    {savedCampaigns.length > 0 ? 'Or Enter Campaign Name' : 'Enter Campaign Name'}
                                </h3>
                                <p className="text-body text-surface-600 mb-6">
                                    {savedCampaigns.length > 0
                                        ? 'Select from the list or enter a campaign file name manually'
                                        : 'Enter the campaign file name to view statistics'
                                    }
                                </p>
                                <div className="flex gap-3 relative">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={campaignFileName}
                                            onChange={(e) => {
                                                setCampaignFileName(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            onKeyPress={(e) => e.key === 'Enter' && loadStats()}
                                            placeholder="e.g., Newsletter_Jan_2024..."
                                            className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-body"
                                        />

                                        {/* Autocomplete Dropdown */}
                                        {showSuggestions && campaignFileName.trim() && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-surface-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {savedCampaigns
                                                    .filter(c =>
                                                        (c.name || c.campaignId || '').toLowerCase().includes(campaignFileName.toLowerCase()) ||
                                                        (c.subject || '').toLowerCase().includes(campaignFileName.toLowerCase())
                                                    )
                                                    .slice(0, 5)
                                                    .map((campaign, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setCampaignFileName(campaign.campaignId);
                                                                loadStats(campaign.campaignId);
                                                                setShowSuggestions(false);
                                                            }}
                                                            className="w-full text-left px-4 py-3 hover:bg-surface-10 border-b border-surface-100 last:border-0 transition-colors"
                                                        >
                                                            <p className="text-h6 text-surface-900 truncate">
                                                                {campaign.name || campaign.campaignId}
                                                            </p>
                                                            <p className="text-caption text-surface-500 truncate">
                                                                {campaign.subject}
                                                            </p>
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => loadStats()}
                                        icon={Search}
                                    >
                                        Load
                                    </Button>
                                </div>
                                {savedCampaigns.length === 0 && (
                                    <p className="text-caption text-surface-400 mt-4">
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
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    <p className="mt-4 text-body text-surface-600">Loading campaign analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-h1 text-surface-900">Campaign Analytics</h1>
                    <p className="text-body text-surface-600 mt-2">Real-time performance metrics for your campaigns.</p>
                </div>
                <div className="bg-error-50 border border-error-300 rounded-lg p-6 text-center">
                    <XCircle className="text-error-500 mx-auto mb-3" size={48} />
                    <h3 className="text-h3 text-error-700 mb-2">Error Loading Stats</h3>
                    <p className="text-body text-error-600 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setStats(null);
                        }}
                        className="px-4 py-2 bg-error-500 text-white rounded-lg hover:bg-error-700 transition-colors text-h6"
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

    const COLORS = ['#E6509B', '#91C36A', '#E3C166', '#FF155A'];

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-100 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-body text-surface-500">{title}</p>
                <h3 className="text-h2 text-surface-900">{value.toLocaleString()}</h3>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-h1 text-surface-900">Campaign Analytics</h1>
                    <p className="text-body text-surface-600 mt-2">Real-time performance metrics for your campaigns.</p>
                    {stats.fileName && (
                        <p className="text-caption text-primary-500 mt-1 font-mono">Campaign: {stats.fileName}</p>
                    )}
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 border border-surface-300 rounded-lg hover:bg-surface-10 transition-colors text-h6"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Sent" value={stats.sent} icon={Send} color="bg-primary-500" />
                <StatCard title="Opened" value={stats.opened} icon={MailOpen} color="bg-success-500" />
                <StatCard title="Clicked" value={stats.clicked} icon={MousePointer} color="bg-warning-500" />
                <StatCard title="Bounced" value={stats.bounced} icon={XCircle} color="bg-error-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-100">
                    <h3 className="text-h3 text-surface-800 mb-6">Engagement Overview</h3>
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-100">
                    <h3 className="text-h3 text-surface-800 mb-6">Delivery Distribution</h3>
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
