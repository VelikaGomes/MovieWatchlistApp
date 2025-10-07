// frontend/src/pages/MovieList.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/apiService';
import MovieCard from '../components/movies/MovieCard';
import { useAuth } from '../context/AuthContext';

const MovieList = () => {
    const { isAuthenticated } = useAuth();
    const [movies, setMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch all movies (public endpoint)
            const movieRes = await api.get('/movies');
            setMovies(movieRes.data);

            // 2. If authenticated, fetch user's watchlist
            if (isAuthenticated) {
                const watchlistRes = await api.get('/movies/watchlist');
                setWatchlist(watchlistRes.data);
            } else {
                setWatchlist([]);
            }

        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load movies or watchlist data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [isAuthenticated]); // Rerun when auth status changes

    // Helper to map watchlist items to the movie ID for easy lookup
    const getWatchlistStatus = (movieId) => {
        const item = watchlist.find(item => item.movieId === movieId);
        // Only return the status and details, not the movie object
        return item ? { status: item.status, rating: item.rating, review: item.review } : null;
    };

    if (loading) return <p>Loading movies...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="movie-list-page">
            <h2>Browse All Movies ({movies.length})</h2>
            <div className="movie-grid">
                {movies.map(movie => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        watchlistStatus={getWatchlistStatus(movie.id)}
                        onUpdateWatchlist={fetchAllData} // Pass callback to refresh on update
                    />
                ))}
            </div>
        </div>
    );
};

export default MovieList;