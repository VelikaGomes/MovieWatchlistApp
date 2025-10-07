// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/apiService';

// 1. Create the Context
const AuthContext = createContext();

// Custom hook to easily use the context
export const useAuth = () => useContext(AuthContext);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    // Initialize state from local storage for persistence
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user and token from storage on app start
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Function to handle login success
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, id, username } = response.data;
            const userData = { id, username, email };

            // Save data to state and local storage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            return false;
        }
    };

    // Function to handle registration success (similar to login)
    const register = async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', { username, email, password });
            // Assumes backend register returns user data and token (as defined in authController)
            const { token, id, username: newUsername } = response.data;
            const userData = { id, username: newUsername, email };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            return false;
        }
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // 3. Define the context value
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
    };

    // Render the children components wrapped by the provider
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};