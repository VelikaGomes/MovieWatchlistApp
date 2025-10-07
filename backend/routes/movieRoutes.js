// backend/routes/movieRoutes.js

const express = require('express');
const router = express.Router(); 
const authMiddleware = require('../middleware/authMiddleware'); // For protected routes
const movieController = require('../controllers/movieController'); // Contains the logic

router.get('/', movieController.getAllMovies);

// POST /api/movies - Add a new custom movie
router.post('/', authMiddleware, movieController.addCustomMovie);

// GET /api/movies/watchlist - Get user's personal watchlist
router.get('/watchlist', authMiddleware, movieController.getUserWatchlist);

// POST /api/movies/watchlist - Add or update a movie in the user's list (watched/to_watch)
router.post('/watchlist', authMiddleware, movieController.updateWatchlistItem);

module.exports = router;