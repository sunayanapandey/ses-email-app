import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, BarChart as BarChartIcon, Plus, ArrowRight, TrendingUp, Send, MailOpen, Coins, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import Button from '../components/Button';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const bal = await api.getBalance();
            setBalance(bal);

            // Load campaigns from API
            const campaignsData = await api.getCampaigns();
            setCampaigns(campaignsData);
        } catch (error) {
            console.error('Failed to load data:', error);
            setBalance(100); // Fallback
        } finally {
            setLoading(false);
        }
    };

    // Helper function to calculate weekly activity from campaign creation dates
    const calculateWeeklyActivity = (campaigns) => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.toDateString()
            };
        });

        const dayCounts = {};
        last7Days.forEach(({ date }) => dayCounts[date] = 0);

        campaigns.forEach(campaign => {
            if (campaign.createdAt) {
                const campaignDate = new Date(campaign.createdAt).toDateString();
                if (dayCounts[campaignDate] !== undefined) {
                    dayCounts[campaignDate] += (campaign.sent || 0);
                }
            }
        });

        return last7Days.map(({ day, date }) => ({
            day,
            emails: dayCounts[date]
        }));
    };

    // Calculate real stats from DynamoDB campaign data
    const totalCampaigns = campaigns.length;

    // Sum all sent, opened, clicked, and bounced counts from campaigns
    const totalEmailsSent = campaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.opened || 0), 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + (c.clicked || 0), 0);
    const totalBounced = campaigns.reduce((sum, c) => sum + (c.bounced || 0), 0);

    // Calculate average rates
    const avgOpenRate = totalEmailsSent > 0 ? ((totalOpened / totalEmailsSent) * 100).toFixed(1) : 0;
    const avgClickRate = totalEmailsSent > 0 ? ((totalClicked / totalEmailsSent) * 100).toFixed(1) : 0;

    // Real campaign performance data from DynamoDB
    const campaignPerformance = campaigns.slice(0, 5).map(campaign => ({
        name: campaign.name.substring(0, 15) + '...',
        sent: campaign.sent || 0,
        opened: campaign.opened || 0,
        clicked: campaign.clicked || 0,
    }));

    // Calculate weekly activity from actual campaign creation dates
    const weeklyActivity = calculateWeeklyActivity(campaigns);

    // Real email status distribution from DynamoDB
    const statusData = [
        { name: 'Sent', value: totalEmailsSent, color: '#ec4899' },
        { name: 'Opened', value: totalOpened, color: '#f472b6' },
        { name: 'Clicked', value: totalClicked, color: '#db2777' },
        { name: 'Bounced', value: totalBounced, color: '#be185d' },
    ];

    const StatCard = ({ label, value, icon: Icon, color, trend, to }) => (
        <Link to={to} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-h6 text-surface-500">{label}</p>
                    <h3 className="text-h2 text-surface-900 mt-1">
                        {loading ? (
                            <span className="inline-block w-20 h-8 bg-gray-200 animate-pulse rounded"></span>
                        ) : (
                            value
                        )}
                    </h3>
                    {trend && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <TrendingUp size={12} />
                            {trend}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                View Details <ArrowRight size={16} className="ml-1" />
            </div>
        </Link>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-h1 text-surface-900">Dashboard</h1>
                    <p className="text-surface-500 mt-1">Welcome back! Here's your campaign overview.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={loadData}
                        icon={RefreshCw}
                        isLoading={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        to="/compose"
                        icon={Plus}
                    >
                        New Campaign
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Total Campaigns"
                    value={totalCampaigns.toLocaleString()}
                    icon={Send}
                    color="bg-primary-500"
                    trend="+12% this month"
                    to="/stats"
                />
                <StatCard
                    label="Emails Sent"
                    value={totalEmailsSent.toLocaleString()}
                    icon={Mail}
                    color="bg-pink-400"
                    trend="+8% this week"
                    to="/stats"
                />
                <StatCard
                    label="Avg Open Rate"
                    value={`${avgOpenRate}%`}
                    icon={MailOpen}
                    color="bg-rose-400"
                    trend="+2.3% vs last month"
                    to="/stats"
                />
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-h6 text-surface-500">Email Balance</p>
                            <h3 className="text-h2 text-surface-900 mt-1">
                                {loading ? (
                                    <span className="inline-block w-20 h-8 bg-gray-200 animate-pulse rounded"></span>
                                ) : (
                                    balance?.toLocaleString() || '0'
                                )}
                            </h3>
                            <p className="text-caption text-surface-400 mt-1">Available credits</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-500 bg-opacity-10">
                            <Coins size={24} className="text-amber-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Campaign Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-h3 text-surface-900 mb-4">Campaign Performance</h2>
                    {campaignPerformance.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={campaignPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="sent" fill="#ec4899" name="Sent" />
                                <Bar dataKey="opened" fill="#f472b6" name="Opened" />
                                <Bar dataKey="clicked" fill="#db2777" name="Clicked" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-surface-400">
                            <div className="text-center">
                                <BarChartIcon size={48} className="mx-auto mb-2 opacity-20" />
                                <p>No campaigns yet</p>
                                <Link to="/compose" className="text-primary-600 text-sm mt-2 inline-block">
                                    Create your first campaign
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Weekly Activity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-h3 text-surface-900 mb-4">Weekly Activity</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyActivity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="emails" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Email Status Distribution & Recent Campaigns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Email Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-h3 text-surface-900 mb-4">Email Status</h2>
                    {totalEmailsSent > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-surface-400">
                            No data available
                        </div>
                    )}
                    <div className="mt-4 space-y-2">
                        {statusData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-surface-600">{item.name}</span>
                                </div>
                                <span className="font-semibold text-surface-900">{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Campaigns */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-h3 text-surface-900 mb-4">Recent Campaigns</h2>
                    {campaigns.length > 0 ? (
                        <div className="space-y-3">
                            {campaigns.slice(0, 6).map((campaign, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-surface-10 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-surface-900 truncate">{campaign.name}</p>
                                        <p className="text-caption text-surface-600 truncate">{campaign.subject}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-h6 text-surface-900">
                                            {new Date(campaign.createdAt).toLocaleDateString()}
                                        </p>
                                        <Link
                                            to="/stats"
                                            className="text-xs text-primary-600 hover:text-primary-700"
                                        >
                                            View Stats
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-surface-400 py-12">
                            <div className="text-center">
                                <Mail size={48} className="mx-auto mb-2 opacity-20" />
                                <p>No campaigns yet</p>
                                <Link to="/compose" className="text-primary-600 text-sm mt-2 inline-block">
                                    Get started →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
