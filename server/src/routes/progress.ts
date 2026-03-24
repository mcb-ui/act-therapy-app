import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

// Improvement #3: Fix totalExercises from 25 → 33
// Improvement #33: Input validation for progress routes
// Improvement #34: Use shared Prisma instance

const router = express.Router();

const TOTAL_EXERCISES = 33;

// Get user progress
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });
    res.json(progress);
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Create or update progress
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, completed, score, notes } = req.body;

    // Improvement #33: Validate exerciseId
    if (!exerciseId || typeof exerciseId !== 'string') {
      return res.status(400).json({ error: 'exerciseId is required' });
    }

    // Check if progress already exists
    const existing = await prisma.progress.findFirst({
      where: {
        userId: req.userId!,
        exerciseId,
      },
    });

    let progress;
    if (existing) {
      progress = await prisma.progress.update({
        where: { id: existing.id },
        data: {
          completed,
          score,
          notes,
        },
      });
    } else {
      progress = await prisma.progress.create({
        data: {
          userId: req.userId!,
          exerciseId,
          completed,
          score,
          notes,
        },
      });
    }

    res.json(progress);
  } catch (error) {
    console.error('Failed to save progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get completion stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const completedCount = await prisma.progress.count({
      where: {
        userId: req.userId!,
        completed: true,
      },
    });

    const allProgress = await prisma.progress.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate streak (days in a row with completion)
    const dates = allProgress
      .filter(p => p.completed)
      .map(p => p.createdAt.toISOString().split('T')[0]);

    const uniqueDates = [...new Set(dates)].sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    let lastDate = today;

    for (const date of uniqueDates) {
      const diffDays = Math.floor(
        (new Date(lastDate).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        tempStreak++;
        if (date === today || (tempStreak === 1 && diffDays === 1)) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = date;
    }

    // Get weekly data (last 7 days)
    const weeklyData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = dates.filter(d => d === dateStr).length;
      weeklyData.push({
        day: dayNames[date.getDay()],
        completed: count,
      });
    }

    res.json({
      completedCount,
      currentStreak,
      longestStreak,
      weeklyData,
      totalExercises: TOTAL_EXERCISES,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
