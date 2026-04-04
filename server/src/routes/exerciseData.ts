import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { handleRouteError, requireString } from '../lib/validation.js';

const router = express.Router();

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
    const exerciseId = requireString(req.body.exerciseId, {
      minLength: 2,
      maxLength: 120,
      fieldName: 'exerciseId',
    });
    const exerciseName = requireString(req.body.exerciseName, {
      minLength: 2,
      maxLength: 120,
      fieldName: 'exerciseName',
    });

    if (typeof req.body.data === 'undefined') {
      return res.status(400).json({ error: 'data is required' });
    }

    const exerciseData = await prisma.exerciseData.create({
      data: {
        userId: req.userId!,
        exerciseId,
        exerciseName,
        data: JSON.stringify(req.body.data),
      },
    });

    res.json(exerciseData);
  } catch (error) {
    return handleRouteError(res, error, 'Failed to save exercise data');
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
