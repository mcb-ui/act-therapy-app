import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = express.Router();
const TOTAL_EXERCISES = 28;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getDateKey = (date: Date) => date.toISOString().split('T')[0];

const shiftDateKey = (dateKey: string, days: number) => {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return getDateKey(date);
};

const diffInDays = (earlierDateKey: string, laterDateKey: string) => {
  const earlier = new Date(`${earlierDateKey}T00:00:00.000Z`);
  const later = new Date(`${laterDateKey}T00:00:00.000Z`);
  return Math.round((later.getTime() - earlier.getTime()) / MS_PER_DAY);
};

// Get user progress
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const progressHistory = await prisma.progress.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    const latestByExercise = new Map<string, (typeof progressHistory)[number]>();
    for (const entry of progressHistory) {
      if (!latestByExercise.has(entry.exerciseId)) {
        latestByExercise.set(entry.exerciseId, entry);
      }
    }

    res.json([...latestByExercise.values()]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Record progress events so stats can retain completion history.
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, completed, score, notes } = req.body;
    if (!exerciseId) {
      return res.status(400).json({ error: 'exerciseId is required' });
    }

    const progress = await prisma.progress.create({
      data: {
        userId: req.userId!,
        exerciseId,
        completed: Boolean(completed),
        score,
        notes,
      },
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get completion stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const allProgress = await prisma.progress.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });
    const latestByExercise = new Map<string, (typeof allProgress)[number]>();
    for (const entry of allProgress) {
      if (!latestByExercise.has(entry.exerciseId)) {
        latestByExercise.set(entry.exerciseId, entry);
      }
    }

    const completedCount = [...latestByExercise.values()].filter((entry) => entry.completed).length;

    const completionDates = allProgress
      .filter((entry) => entry.completed)
      .map((entry) => getDateKey(entry.createdAt));
    const uniqueCompletionDates = [...new Set(completionDates)].sort();
    const completionDateSet = new Set(uniqueCompletionDates);
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let previousDate: string | null = null;

    for (const date of uniqueCompletionDates) {
      if (previousDate && diffInDays(previousDate, date) === 1) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      previousDate = date;
    }

    const today = getDateKey(new Date());
    const yesterday = shiftDateKey(today, -1);
    let streakCursor: string | null = completionDateSet.has(today)
      ? today
      : completionDateSet.has(yesterday)
      ? yesterday
      : null;

    while (streakCursor && completionDateSet.has(streakCursor)) {
      currentStreak += 1;
      streakCursor = shiftDateKey(streakCursor, -1);
    }

    // Get weekly data (last 7 days)
    const weeklyData: Array<{ day: string; completed: number }> = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = getDateKey(date);
      const count = completionDates.filter((dayKey) => dayKey === dateStr).length;
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
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
