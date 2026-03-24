import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

// Improvement #34: Use shared Prisma instance

const router = express.Router();

// Get all exercise data for user (must come before /:exerciseId to avoid route conflicts)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = await prisma.exerciseData.findMany({
      where: { userId: req.userId! },
      orderBy: { completedAt: 'desc' },
    });

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch exercise data:', error);
    res.status(500).json({ error: 'Failed to fetch exercise data' });
  }
});

// Get exercise data for a specific exercise
router.get('/:exerciseId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId } = req.params;

    const data = await prisma.exerciseData.findMany({
      where: {
        userId: req.userId!,
        exerciseId,
      },
      orderBy: { completedAt: 'desc' },
      take: 1,
    });

    res.json(data[0] || null);
  } catch (error) {
    console.error('Failed to fetch exercise data:', error);
    res.status(500).json({ error: 'Failed to fetch exercise data' });
  }
});

// Save exercise data
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, exerciseName, data } = req.body;

    if (!exerciseId || !exerciseName) {
      return res.status(400).json({ error: 'exerciseId and exerciseName are required' });
    }

    const exerciseData = await prisma.exerciseData.create({
      data: {
        userId: req.userId!,
        exerciseId,
        exerciseName,
        data: typeof data === 'string' ? data : JSON.stringify(data),
      },
    });

    res.json(exerciseData);
  } catch (error) {
    console.error('Failed to save exercise data:', error);
    res.status(500).json({ error: 'Failed to save exercise data' });
  }
});

export default router;
