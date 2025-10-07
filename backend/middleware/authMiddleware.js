// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
// Import the prisma client created in server.js
const prisma = require('../prismaClient'); 
// Middleware to protect routes and identify the user
const authMiddleware = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header (Bearer Token format)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (removes 'Bearer ' prefix)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user in DB and attach to the request object, EXCLUDING the password
            // This is key for personalized data (CLO4)
            req.user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true, username: true } // Select specific fields
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the controller
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = authMiddleware;