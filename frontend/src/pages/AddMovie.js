// frontend/src/pages/AddMovie.jsx

import React, { useState } from 'react';
import api from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        genre: '',
        plot: '',
        posterUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Protected endpoint: POST /api/movies
            const response = await api.post('/movies', formData);
            setMessage(response.data.message || 'Movie added successfully!');
            
            // Clear form after successful submission
            setFormData({ title: '', year: '', genre: '', plot: '', posterUrl: '' });

            // Optionally navigate after a short delay
            setTimeout(() => navigate('/movies'), 1500);
            
        } catch (error) {
            console.error("Failed to add movie:", error.response?.data);
            setMessage(`Error: ${error.response?.data?.message || 'Could not add movie.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-movie-container">
            <h2>Add a Custom Movie</h2>
            <form onSubmit={handleSubmit} className="movie-form">
                
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input type="text" id="title" value={formData.title} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <input type="number" id="year" value={formData.year} onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="genre">Genre</label>
                    <input type="text" id="genre" value={formData.genre} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="posterUrl">Poster URL</label>
                    <input type="url" id="posterUrl" value={formData.posterUrl} onChange={handleChange} placeholder="e.g., https://example.com/poster.jpg" />
                </div>

                <div className="form-group">
                    <label htmlFor="plot">Plot / Summary</label>
                    <textarea id="plot" value={formData.plot} onChange={handleChange} />
                </div>
                
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Adding...' : 'Submit Movie'}
                </button>
            </form>
            {message && <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</p>}
        </div>
    );
};

export default AddMovie;