import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, BarChart as BarChartIcon, Plus, ArrowRight, TrendingUp, Send, MailOpen, Coins, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import Button from '../components/Button';
import { COLOR_SCHEMES } from '../utils/chartColors';

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

    // Helper functions for trend calculations
    const calculateMonthlyGrowth = (campaigns) => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const thisMonthCount = campaigns.filter(c => {
            const d = new Date(c.createdAt);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;

        const lastMonthCount = campaigns.filter(c => {
            const d = new Date(c.createdAt);
            return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        }).length;

        if (lastMonthCount === 0) return thisMonthCount > 0 ? "+100% this month" : "0% this month";
        const growth = ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
        return `${growth > 0 ? '+' : ''}${growth.toFixed(0)}% this month`;
    };

    const calculateWeeklyEmailGrowth = (campaigns) => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const thisWeekCount = campaigns
            .filter(c => new Date(c.createdAt) >= oneWeekAgo)
            .reduce((sum, c) => sum + (c.sent || 0), 0);

        const lastWeekCount = campaigns
            .filter(c => {
                const d = new Date(c.createdAt);
                return d >= twoWeeksAgo && d < oneWeekAgo;
            })
            .reduce((sum, c) => sum + (c.sent || 0), 0);

        if (lastWeekCount === 0) return thisWeekCount > 0 ? "+100% this week" : "0% this week";
        const growth = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
        return `${growth > 0 ? '+' : ''}${growth.toFixed(0)}% this week`;
    };

    const calculateOpenRateGrowth = (campaigns) => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const getAvgRate = (month, year) => {
            const monthCampaigns = campaigns.filter(c => {
                const d = new Date(c.createdAt);
                return d.getMonth() === month && d.getFullYear() === year;
            });
            const totalSent = monthCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
            const totalOpened = monthCampaigns.reduce((sum, c) => sum + (c.opened || 0), 0);
            return totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
        };

        const thisMonthRate = getAvgRate(thisMonth, thisYear);
        const lastMonthRate = getAvgRate(lastMonth, lastMonthYear);

        if (lastMonthRate === 0) return thisMonthRate > 0 ? `+${thisMonthRate.toFixed(1)}% vs last month` : "0% vs last month";
        const growth = thisMonthRate - lastMonthRate;
        return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}% vs last month`;
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

    // Calculate Trends
    const campaignTrend = calculateMonthlyGrowth(campaigns);
    const emailTrend = calculateWeeklyEmailGrowth(campaigns);
    const openRateTrend = calculateOpenRateGrowth(campaigns);

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
        { name: 'Sent', value: totalEmailsSent, color: COLOR_SCHEMES.emailStatus[0] },
        { name: 'Opened', value: totalOpened, color: COLOR_SCHEMES.emailStatus[1] },
        { name: 'Clicked', value: totalClicked, color: COLOR_SCHEMES.emailStatus[2] },
        { name: 'Bounced', value: totalBounced, color: COLOR_SCHEMES.emailStatus[3] },
    ];

    const StatCard = ({ label, value, icon: Icon, color, trend, to }) => {
        const isPositive = trend && (trend.startsWith('+') || trend.startsWith('0%'));
        const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
        const TrendIcon = isPositive ? TrendingUp : TrendingUp; // Could use TrendingDown for negative if imported

        return (
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
                            <p className={`text-xs ${trendColor} mt-1 flex items-center gap-1`}>
                                <TrendIcon size={12} className={!isPositive ? "rotate-180" : ""} />
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
    };

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
                    trend={campaignTrend}
                    to="/stats"
                />
                <StatCard
                    label="Emails Sent"
                    value={totalEmailsSent.toLocaleString()}
                    icon={Mail}
                    color="bg-secondary-500"
                    trend={emailTrend}
                    to="/stats"
                />
                <StatCard
                    label="Avg Open Rate"
                    value={`${avgOpenRate}%`}
                    icon={MailOpen}
                    color="bg-success-500"
                    trend={openRateTrend}
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
                        <div className="p-3 rounded-lg bg-warning-500 bg-opacity-10">
                            <Coins size={24} className="text-warning-500" />
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
                                <Bar dataKey="sent" fill={COLOR_SCHEMES.campaignPerformance[0]} name="Sent" />
                                <Bar dataKey="opened" fill={COLOR_SCHEMES.campaignPerformance[1]} name="Opened" />
                                <Bar dataKey="clicked" fill={COLOR_SCHEMES.campaignPerformance[2]} name="Clicked" />
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
                            <Line type="monotone" dataKey="emails" stroke={COLOR_SCHEMES.lineChart[0]} strokeWidth={2} dot={{ r: 4 }} />
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
