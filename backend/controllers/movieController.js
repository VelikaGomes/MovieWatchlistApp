// backend/controllers/movieController.js
const prisma = require('../prismaClient'); // Use the dedicated file
// ----------------------
// GET /api/movies
// ----------------------
const getAllMovies = async (req, res) => {
    try {
        // Fetch all movies from the DB
        const movies = await prisma.movie.findMany({
            orderBy: { title: 'asc' },
        });
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
};

// ----------------------
// POST /api/movies (Protected: Requires authMiddleware)
// ----------------------
const addCustomMovie = async (req, res) => {
    const { title, genre, year, plot, posterUrl } = req.body;
    
    if (!title) {
        return res.status(400).json({ message: 'Movie title is required' });
    }

    try {
        // Create the new movie
        const newMovie = await prisma.movie.create({
            data: {
                title,
                genre,
                year: year ? parseInt(year) : null,
                plot,
                posterUrl,
            },
        });
        res.status(201).json({ message: 'Custom movie added successfully', movie: newMovie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add custom movie' });
    }
};

// ----------------------
// GET /api/movies/watchlist (Protected: Requires authMiddleware)
// ----------------------
const getUserWatchlist = async (req, res) => {
    const userId = req.user.id; // User ID comes from authMiddleware

    try {
        // Fetch watchlist items for the current user
        const watchlist = await prisma.watchlistItem.findMany({
            where: { userId: userId },
            // Include the related movie data using Prisma's 'include'
            include: {
                movie: true, // Fetch the details of the associated movie
            },
            orderBy: { createdAt: 'desc' },
        });
        
        // Return a list that contains the movie details and the user's status/rating
        res.status(200).json(watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
};

// ----------------------
// POST /api/movies/watchlist (Protected: Requires authMiddleware)
// ----------------------
const updateWatchlistItem = async (req, res) => {
    const userId = req.user.id;
    const { movieId, status, rating, review } = req.body;

    if (!movieId || !status) {
        return res.status(400).json({ message: 'Movie ID and status are required' });
    }

    try {
        // Use upsert: update the item if it exists, otherwise create it
        const watchlistItem = await prisma.watchlistItem.upsert({
            where: {
                userId_movieId: { userId, movieId: parseInt(movieId) }
            },
            update: {
                status,
                rating: rating ? parseInt(rating) : null,
                review,
            },
            create: {
                userId,
                movieId: parseInt(movieId),
                status,
                rating: rating ? parseInt(rating) : null,
                review,
            },
            include: { movie: true },
        });

        res.status(200).json({ 
            message: `Movie status updated to ${status}`, 
            item: watchlistItem 
        });
    } catch (error) {
        // Handle database errors (e.g., if movieId does not exist)
        console.error(error);
        res.status(500).json({ message: 'Failed to update watchlist item' });
    }
};

module.exports = {
    getAllMovies,
    addCustomMovie,
    getUserWatchlist,
    updateWatchlistItem,
};