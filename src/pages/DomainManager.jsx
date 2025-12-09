import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, CheckCircle, Clock, Trash2, Mail } from 'lucide-react';
import Button from '../components/Button';
import Tag from '../components/Tag';

const DomainManager = () => {
    const [senders, setSenders] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [deleteModal, setDeleteModal] = useState({ show: false, email: '' });

    useEffect(() => {
        loadSenders();
    }, []);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const loadSenders = async () => {
        const data = await api.getSenders();
        setSenders(data);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    const handleAddEmail = async (e) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes('@')) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        setLoading(true);
        try {
            await api.addSender(newEmail);
            showNotification('Verification email sent! Please check your inbox and click the verification link.', 'success');
            await loadSenders();
            setNewEmail('');
        } catch (error) {
            showNotification('Failed to add sender email. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmail = async (email) => {
        setDeleteModal({ show: true, email });
    };

    const confirmDelete = async () => {
        try {
            await api.deleteSender(deleteModal.email);
            showNotification(`Successfully deleted ${deleteModal.email}`, 'success');
            await loadSenders();
        } catch (error) {
            showNotification('Failed to delete sender email.', 'error');
        } finally {
            setDeleteModal({ show: false, email: '' });
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Notification Banner */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border-l-4 animate-slide-in ${notification.type === 'success'
                    ? 'bg-green-50 border-green-500 text-green-900'
                    : 'bg-red-50 border-red-500 text-red-900'
                    }`}>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            {notification.type === 'success' ? (
                                <CheckCircle className="text-green-500" size={20} />
                            ) : (
                                <Clock className="text-red-500" size={20} />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification({ show: false, message: '', type: '' })}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

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
                                    <Tag variant="pending">Pending</Tag>
                                )}
                                {sender.status === 'Success' && (
                                    <Tag variant="verified">Verified</Tag>
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

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-h4 text-surface-900 mb-2">Delete Sender Email</h3>
                        <p className="text-surface-600 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{deleteModal.email}</span>?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setDeleteModal({ show: false, email: '' })}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DomainManager;
