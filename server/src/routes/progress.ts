import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { totalTrackableExercises, trackIdToExerciseId } from '../lib/exerciseManifest.js';
import { handleRouteError, optionalInteger, optionalString, requireString } from '../lib/validation.js';

const router = express.Router();
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DEFAULT_TIME_ZONE = 'UTC';
const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();
const weekdayFormatterCache = new Map<string, Intl.DateTimeFormat>();

const getDateFormatter = (timeZone: string) => {
  const cached = dateFormatterCache.get(timeZone);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  dateFormatterCache.set(timeZone, formatter);
  return formatter;
};

const getWeekdayFormatter = (timeZone: string) => {
  const cached = weekdayFormatterCache.get(timeZone);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
  });
  weekdayFormatterCache.set(timeZone, formatter);
  return formatter;
};

const getRequestTimeZone = (req: AuthRequest) => {
  const headerValue = req.header('x-client-timezone');

  if (!headerValue) {
    return DEFAULT_TIME_ZONE;
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: headerValue }).format(new Date());
    return headerValue;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
};

const getDateKey = (date: Date, timeZone: string) => {
  const parts = getDateFormatter(timeZone).formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
};

const shiftDateKey = (dateKey: string, days: number) => {
  const [year, month, day] = dateKey.split('-').map((value) => Number.parseInt(value, 10));
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));
  return date.toISOString().slice(0, 10);
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
    const exerciseId = requireString(req.body.exerciseId, {
      minLength: 2,
      maxLength: 120,
      fieldName: 'exerciseId',
    });
    const score = optionalInteger(req.body.score, {
      min: 0,
      max: 60 * 60 * 12,
      fieldName: 'score',
    });
    const notes = optionalString(req.body.notes, {
      maxLength: 1000,
      fieldName: 'notes',
    });
    const completed = Boolean(req.body.completed);

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
    return handleRouteError(res, error, 'Failed to save progress');
  }
});

// Get completion stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const timeZone = getRequestTimeZone(req);
    const allProgress = await prisma.progress.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    const latestByTrackId = new Map<string, (typeof allProgress)[number]>();
    for (const entry of allProgress) {
      if (!latestByTrackId.has(entry.exerciseId)) {
        latestByTrackId.set(entry.exerciseId, entry);
      }
    }

    const completedExerciseIds = new Set<string>();
    for (const [trackId, entry] of latestByTrackId) {
      if (!entry.completed) {
        continue;
      }

      completedExerciseIds.add(trackIdToExerciseId.get(trackId) ?? trackId);
    }

    const completedCount = completedExerciseIds.size;

    const completionDates = allProgress
      .filter((entry) => entry.completed)
      .map((entry) => getDateKey(entry.createdAt, timeZone));
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

    const today = getDateKey(new Date(), timeZone);
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
    const weekdayFormatter = getWeekdayFormatter(timeZone);
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = getDateKey(date, timeZone);
      const count = completionDates.filter((dayKey) => dayKey === dateStr).length;
      weeklyData.push({
        day: weekdayFormatter.format(date),
        completed: count,
      });
    }

    const completedThisWeek = weeklyData.reduce((sum, day) => sum + day.completed, 0);
    const completionRate = Math.round(
      (completedCount / Math.max(totalTrackableExercises, 1)) * 100
    );
    const lastCompletedAt =
      allProgress.find((entry) => entry.completed)?.createdAt.toISOString() ?? null;

    res.json({
      completedCount,
      currentStreak,
      longestStreak,
      weeklyData,
      totalExercises: totalTrackableExercises,
      completionRate,
      practiceDays: uniqueCompletionDates.length,
      completedThisWeek,
      lastCompletedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
