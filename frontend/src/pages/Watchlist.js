// frontend/src/pages/Watchlist.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/apiService';
import MovieCard from '../components/movies/MovieCard';
import { useAuth } from '../context/AuthContext';

const Watchlist = () => {
    const { user } = useAuth();
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWatchlist = async () => {
        setLoading(true);
        setError(null);
        try {
            // Protected endpoint: GET /api/movies/watchlist
            const response = await api.get('/movies/watchlist');
            setWatchlistItems(response.data);
        } catch (err) {
            console.error("Failed to fetch watchlist:", err);
            setError("Could not load your watchlist. Please ensure you are logged in.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    if (loading) return <p>Loading your watchlist...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (watchlistItems.length === 0) return <p>Your watchlist is empty! Browse movies to add some.</p>;

    return (
        <div className="watchlist-page">
            <h2>{user.username}'s Watchlist ({watchlistItems.length})</h2>
            <div className="movie-grid">
                {watchlistItems.map(item => (
                    <MovieCard 
                        key={item.movie.id} 
                        movie={item.movie} 
                        // Pass the status details directly
                        watchlistStatus={{ status: item.status, rating: item.rating, review: item.review }}
                        onUpdateWatchlist={fetchWatchlist} // Callback to refresh this specific list
                    />
                ))}
            </div>
        </div>
    );
};

export default Watchlist;