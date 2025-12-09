import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import Button from '../components/Button';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-h1 text-surface-900">Profile</h1>
                <p className="text-surface-500 mt-2">Manage your account settings and preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-100 overflow-hidden">
                {/* Header Section with Avatar */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-32"></div>

                <div className="px-8 pb-8">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center">
                                <User className="text-primary-600" size={48} />
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-h2 text-surface-900 mb-1">
                                {user?.name || user?.email?.split('@')[0] || 'User'}
                            </h2>
                            <p className="text-surface-500">Account Member</p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="flex items-start gap-3 p-4 bg-surface-10 rounded-lg">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <Mail size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-caption text-surface-500">Email Address</p>
                                    <p className="text-body text-surface-900 font-medium mt-1">
                                        {user?.email || 'Not available'}
                                    </p>
                                </div>
                            </div>

                            {/* Account Type */}
                            <div className="flex items-start gap-3 p-4 bg-surface-10 rounded-lg">
                                <div className="p-2 bg-success-100 rounded-lg">
                                    <User size={20} className="text-success-600" />
                                </div>
                                <div>
                                    <p className="text-caption text-surface-500">Account Type</p>
                                    <p className="text-body text-surface-900 font-medium mt-1">
                                        {user?.role || 'Standard User'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-surface-200">
                            <div className="flex gap-3">
                                <Button
                                    variant="destructive"
                                    onClick={logout}
                                    icon={LogOut}
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Note:</strong> This is your account profile. Contact your administrator to update account settings.
                </p>
            </div>
        </div>
    );
};

export default Profile;
