import { PrismaClient } from '@prisma/client';

// Improvement #34: Shared single PrismaClient instance across all routes
const prisma = new PrismaClient();

export default prisma;
