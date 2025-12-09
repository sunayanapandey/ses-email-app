import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
    const [loading, setLoading] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    const login = (accessToken, userEmail) => {
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('user', JSON.stringify({ email: userEmail }));
        setToken(accessToken);
        setUser({ email: userEmail });
        setSessionExpired(false);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const handleSessionExpired = () => {
        console.log('🔴 Session expired! Showing notification...');
        setSessionExpired(true);
        logout();
    };

    const isAuthenticated = () => {
        return !!token;
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        sessionExpired,
        setSessionExpired,
        handleSessionExpired
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
