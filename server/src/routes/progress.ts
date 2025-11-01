import express from 'express';
import { PrismaClient } from '@prisma/client';

import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user progress
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Create or update progress
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, completed, score, notes } = req.body;

    const progress = await prisma.progress.create({
      data: {
        userId: req.userId!,
        exerciseId,
        completed,
        score,
        notes,
      },
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

export default router;
