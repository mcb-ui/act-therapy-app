import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

// Improvement #34: Use shared Prisma instance

const router = express.Router();

// Get user favorites
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add favorite
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, exerciseName } = req.body;

    if (!exerciseId || !exerciseName) {
      return res.status(400).json({ error: 'exerciseId and exerciseName are required' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.userId!,
        exerciseId,
        exerciseName,
      },
    });

    res.json(favorite);
  } catch (error) {
    console.error('Failed to add favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove favorite
router.delete('/:exerciseId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        userId: req.userId!,
        exerciseId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;
