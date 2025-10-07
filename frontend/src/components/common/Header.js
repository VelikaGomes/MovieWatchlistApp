// frontend/src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css'; // Add this import

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <nav>
                <Link to="/" className="logo">🎬 Movie Tracker</Link>
                <div className="nav-links">
                    <Link to="/movies">Browse Movies</Link>
                    
                    {isAuthenticated ? (
                        <>
                            <Link to="/watchlist">My Watchlist</Link>
                            <Link to="/add-movie">Add Movie</Link>
                            
                            <span className="user-info">
                                Hello, {user.username}
                            </span>
                            <button onClick={handleLogout} className="btn-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/register" className="btn-register">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;

