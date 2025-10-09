// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient'); // Prisma client

// Middleware to authenticate user
const auth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB including role
            req.user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true, username: true, role: true } // include role
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // proceed
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to allow only admin users
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
};

module.exports = { auth, adminOnly };
