import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const DomainManager = () => {
    const [domains, setDomains] = useState([]);
    const [newDomain, setNewDomain] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDomains();
    }, []);

    const loadDomains = async () => {
        const data = await api.getDomains();
        setDomains(data);
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        if (!newDomain) return;

        setLoading(true);
        const domain = await api.verifyDomain(newDomain);
        setDomains([...domains, domain]);
        setNewDomain('');
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Domain Management</h1>
                <p className="text-gray-500 mt-2">Verify and manage your sending domains.</p>
            </div>

            {/* Add Domain Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Domain</h2>
                <form onSubmit={handleAddDomain} className="flex gap-4">
                    <input
                        type="text"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="example.com"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus size={20} />
                        {loading ? 'Verifying...' : 'Verify Domain'}
                    </button>
                </form>
            </div>

            {/* Domain List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-semibold text-gray-700">Verified Domains</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {domains.map((domain) => (
                        <div key={domain.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${domain.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {domain.status === 'verified' ? <CheckCircle size={24} /> : <Clock size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{domain.domain}</h3>
                                    <p className="text-sm text-gray-500 capitalize">{domain.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {domain.status === 'pending' && (
                                    <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                        Verification Pending
                                    </span>
                                )}
                                {domain.status === 'verified' && (
                                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                        Active
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {domains.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No domains added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DomainManager;
