// backend/server.js

// 1. Load Environment Variables
require('dotenv').config();

// 2. Core Dependencies
const express = require('express');
const cors = require('cors');

// 3. Import Modular Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

// 4. Import the central Prisma Client
const prisma = require('./prismaClient'); 

// 5. Initialization
const PORT = process.env.PORT || 5000;
const app = express();

// --- Global Middleware ---

// Enable CORS for frontend communication
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Body Parser: Allows Express to read JSON data from the body of requests
app.use(express.json());

// --- Routes ---

// Test Route
app.get('/', (req, res) => {
    res.status(200).send('Movie App API is running smoothly.');
});

// Modular Routes (Defining the base paths for your API)
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// --- Server Start Logic ---

async function main() {
    try {
        // Use the imported client to check connection
        await prisma.$connect(); 
        console.log('Database connected successfully.');

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
            console.log(`Open: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server or connect to database:', error);
        // Exit process if DB connection fails
        process.exit(1); 
    }
}

// 6. Call the main function to start the app!
main();