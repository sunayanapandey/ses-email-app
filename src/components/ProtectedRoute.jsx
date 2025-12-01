import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessFeature } from '../utils/permissions';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Save the location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access if roles are specified
    if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(role =>
            canAccessFeature(user.role, role)
        );

        if (!hasPermission) {
            return (
                <div className="flex items-center justify-center h-screen bg-gray-50">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-4">
                            You don't have permission to access this page.
                        </p>
                        <p className="text-sm text-gray-500">
                            Your role: <span className="font-semibold">{user.role}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Required: <span className="font-semibold">{allowedRoles.join(' or ')}</span>
                        </p>
                    </div>
                </div>
            );
        }
    }

    return children;
};

export default ProtectedRoute;
