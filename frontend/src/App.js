// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';

// Import all page components (create these next!)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieList from './pages/MovieList';
import Watchlist from './pages/Watchlist';
import AddMovie from './pages/AddMovie'; // Placeholder

// Custom wrapper for protected routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>; // Simple loading state
    }

    // Redirect to login if not authenticated
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <div className="App">
            <Header /> {/* Header component for navigation */}
            <main className="container">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movies" element={<MovieList />} />

                    {/* Protected Routes (CLO1, CLO4, CLO5) */}
                    <Route 
                        path="/watchlist" 
                        element={<ProtectedRoute><Watchlist /></ProtectedRoute>} 
                    />
                    <Route 
                        path="/add-movie" 
                        element={<ProtectedRoute><AddMovie /></ProtectedRoute>} 
                    />

                    {/* Fallback route */}
                    <Route path="*" element={<h1>404: Not Found</h1>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;