// backend/prismaClient.js

const { PrismaClient } = require('@prisma/client');

// Initialize and export the Prisma client directly
const prisma = new PrismaClient();

module.exports = prisma;