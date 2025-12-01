import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock user database
const MOCK_USERS = [
    {
        id: 1,
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'Admin'
    },
    {
        id: 2,
        email: 'manager@example.com',
        password: 'manager123',
        name: 'Manager User',
        role: 'Manager'
    },
    {
        id: 3,
        email: 'viewer@example.com',
        password: 'viewer123',
        name: 'Viewer User',
        role: 'Viewer'
    }
];

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error loading auth state:', error);
                localStorage.removeItem('authUser');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Find user in mock database
        const foundUser = MOCK_USERS.find(
            u => u.email === email && u.password === password
        );

        if (foundUser) {
            // Remove password from user object
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('authUser', JSON.stringify(userWithoutPassword));
            return { success: true };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const register = (email, password, name, role = 'Viewer') => {
        // Check if user already exists
        const existingUser = MOCK_USERS.find(u => u.email === email);
        if (existingUser) {
            return { success: false, error: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: MOCK_USERS.length + 1,
            email,
            name,
            role
        };

        // In a real app, this would be saved to a database
        MOCK_USERS.push({ ...newUser, password });

        // Auto-login after registration
        setUser(newUser);
        localStorage.setItem('authUser', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authUser');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
