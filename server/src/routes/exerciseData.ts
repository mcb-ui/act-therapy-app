import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

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
    res.status(500).json({ error: 'Failed to fetch exercise data' });
  }
});

// Save exercise data
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, exerciseName, data } = req.body;

    const exerciseData = await prisma.exerciseData.create({
      data: {
        userId: req.userId!,
        exerciseId,
        exerciseName,
        data: JSON.stringify(data),
      },
    });

    res.json(exerciseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save exercise data' });
  }
});

// Get all exercise data for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = await prisma.exerciseData.findMany({
      where: { userId: req.userId! },
      orderBy: { completedAt: 'desc' },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise data' });
  }
});

export default router;
