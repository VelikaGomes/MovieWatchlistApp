// frontend/src/pages/Home.jsx

import './Home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="home-container">
            <h1>Welcome to the Ultimate Movie Tracker! 🎬</h1>
            <p>Your personalized platform to track movies you've watched, rate them, and manage your watchlist.</p>
            
            <div className="action-buttons">
                <Link to="/movies" className="btn btn-large btn-browse">Browse All Movies</Link>
                
                {isAuthenticated ? (
                    <Link to="/watchlist" className="btn btn-large btn-secondary">
                        Go to My Watchlist, {user.username}!
                    </Link>
                ) : (
                    <Link to="/login" className="btn btn-large btn-secondary">
                        Login to Start Tracking
                    </Link>
                )}
            </div>

            <div className="info-section">
                <h2>Features Include:</h2>
                <ul>
                    <li>Personalized Watchlist: Mark movies as 'Watched' or 'To Watch'.</li>
                    <li>Rating & Reviews: Add your own star rating and review.</li>
                    <li>Add Custom Movies: Contribute to the database with your own entries.</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;