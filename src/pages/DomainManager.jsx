import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, CheckCircle, Clock, Trash2, Mail } from 'lucide-react';
import Button from '../components/Button';

const DomainManager = () => {
    const [senders, setSenders] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSenders();
    }, []);

    const loadSenders = async () => {
        const data = await api.getSenders();
        setSenders(data);
    };

    const handleAddEmail = async (e) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await api.addSender(newEmail);
            alert('Verification email sent! Please check your inbox and click the verification link.');
            await loadSenders();
            setNewEmail('');
        } catch (error) {
            alert('Failed to add sender email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmail = async (email) => {
        if (!confirm(`Delete sender email: ${email}?`)) return;

        try {
            await api.deleteSender(email);
            await loadSenders();
        } catch (error) {
            alert('Failed to delete sender email.');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-h1 text-surface-900">Sender Email Verification</h1>
                <p className="text-surface-500 mt-2">Verify email addresses to send campaigns from.</p>
            </div>

            {/* Add Email Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-100 mb-8">
                <h2 className="text-lg font-semibold mb-4">Verify New Sender Email</h2>
                <form onSubmit={handleAddEmail} className="flex gap-4">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="sender@example.com"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        loading={loading}
                        icon={Plus}
                    >
                        {loading ? 'Sending...' : 'Verify Email'}
                    </Button>
                </form>
                <p className="text-body text-surface-500 mt-3">
                    📧 AWS will send a verification email to this address. Click the link to verify.
                </p>
            </div>

            {/* Senders List */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-100 bg-surface-10">
                    <h2 className="font-semibold text-surface-700">Verified Sender Emails</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {senders.map((sender, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between hover:bg-surface-10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${sender.status === 'Success' ? 'bg-green-100 text-green-600' :
                                    sender.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-gray-100 text-surface-600'
                                    }`}>
                                    {sender.status === 'Success' ? <CheckCircle size={24} /> :
                                        sender.status === 'Pending' ? <Clock size={24} /> :
                                            <Mail size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-surface-900">{sender.email}</h3>
                                    <p className="text-body text-surface-500 capitalize">{sender.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {sender.status === 'Pending' && (
                                    <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                        Verification Pending
                                    </span>
                                )}
                                {sender.status === 'Success' && (
                                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                        Verified ✓
                                    </span>
                                )}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteEmail(sender.email)}
                                    icon={Trash2}
                                />
                            </div>
                        </div>
                    ))}
                    {senders.length === 0 && (
                        <div className="p-8 text-center text-surface-500">
                            No sender emails added yet. Add one above to start sending campaigns.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DomainManager;
