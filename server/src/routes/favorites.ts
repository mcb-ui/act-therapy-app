import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

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
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add favorite
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, exerciseName } = req.body;

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_exerciseId: {
          userId: req.userId!,
          exerciseId,
        },
      },
      update: {
        exerciseName,
      },
      create: {
        userId: req.userId!,
        exerciseId,
        exerciseName,
      },
    });

    res.json(favorite);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;
