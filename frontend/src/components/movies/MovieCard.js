// frontend/src/components/movies/MovieCard.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/apiService';

const MovieCard = ({ movie, watchlistStatus, onUpdateWatchlist }) => {
    const { isAuthenticated } = useAuth();
    const [status, setStatus] = useState(watchlistStatus?.status || 'TO_WATCH');
    const [rating, setRating] = useState(watchlistStatus?.rating || '');
    const [review, setReview] = useState(watchlistStatus?.review || '');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdate = async (newStatus) => {
        if (!isAuthenticated) return alert('Please log in to update your watchlist.');

        setLoading(true);
        setMessage('');

        try {
            const payload = {
                movieId: movie.id,
                status: newStatus,
                rating: rating || null,
                review: review || null,
            };

            await api.post('/movies/watchlist', payload);
            setStatus(newStatus);
            setMessage(`Movie marked as ${newStatus}!`);
            onUpdateWatchlist(); // Notify parent to refresh list

        } catch (error) {
            console.error("Watchlist update failed:", error);
            setMessage('Failed to update watchlist.');
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    return (
        <div className="movie-card">
            <img src={movie.posterUrl || 'https://via.placeholder.com/150'} alt={movie.title} />
            <div className="card-info">
                <h3>{movie.title} ({movie.year})</h3>
                <p>Genre: {movie.genre || 'N/A'}</p>
                <p>Status: <span className={`status-${status.toLowerCase()}`}>{status.replace('_', ' ')}</span></p>

                {isAuthenticated && (
                    <div className="card-actions">
                        {status !== 'WATCHED' ? (
                            <button 
                                onClick={() => handleUpdate('WATCHED')} 
                                disabled={loading}
                                className="btn btn-small btn-watched"
                            >
                                {loading ? 'Updating...' : 'Mark as Watched'}
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="btn btn-small btn-edit"
                            >
                                Edit Rating/Review
                            </button>
                        )}
                        
                        {status !== 'TO_WATCH' && status !== 'WATCHED' && (
                            <button 
                                onClick={() => handleUpdate('TO_WATCH')}
                                disabled={loading}
                                className="btn btn-small btn-towatch"
                            >
                                To Watch
                            </button>
                        )}
                    </div>
                )}
                
                {isEditing && (
                    <div className="edit-form">
                        <h4>Update Details</h4>
                        <select value={rating} onChange={handleRatingChange} className="form-input">
                            <option value="">Rate (1-5)</option>
                            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Star</option>)}
                        </select>
                        <textarea 
                            value={review} 
                            onChange={(e) => setReview(e.target.value)} 
                            placeholder="Add a short review..."
                            className="form-input"
                        />
                        <button onClick={() => handleUpdate('WATCHED')} className="btn btn-small btn-save">
                            Save Changes
                        </button>
                    </div>
                )}
                
                {watchlistStatus && watchlistStatus.rating && <p className="rating">Rating: {watchlistStatus.rating}/5</p>}
                {watchlistStatus && watchlistStatus.review && <p className="review">Review: {watchlistStatus.review}</p>}
                
                {message && <p className="success-message">{message}</p>}
            </div>
        </div>
    );
};

export default MovieCard;