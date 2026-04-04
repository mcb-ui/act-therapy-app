import { api } from '../lib/api';

export interface ProgressEntry {
  id: string;
  exerciseId: string;
  completed: boolean;
  score: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseDataRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  data: string;
  completedAt: string;
  updatedAt: string;
}

export interface ProgressStats {
  completedCount: number;
  currentStreak: number;
  longestStreak: number;
  weeklyData: Array<{ day: string; completed: number }>;
  totalExercises: number;
  completionRate: number;
  practiceDays: number;
  completedThisWeek: number;
  lastCompletedAt: string | null;
}

export interface Favorite {
  id: string;
  exerciseId: string;
  exerciseName: string;
  createdAt: string;
}

// Mark exercise as complete
export const markExerciseComplete = async (exerciseId: string, score?: number, notes?: string) => {
  try {
    await api.post('/progress', {
      exerciseId,
      completed: true,
      score,
      notes,
    });
  } catch (error) {
    console.error('Failed to mark exercise complete:', error);
    throw error;
  }
};

// Save exercise data (responses)
export const saveExerciseData = async (exerciseId: string, exerciseName: string, data: unknown) => {
  try {
    await api.post('/exercise-data', {
      exerciseId,
      exerciseName,
      data,
    });
  } catch (error) {
    console.error('Failed to save exercise data:', error);
    throw error;
  }
};

// Get exercise data
export const getExerciseData = async (exerciseId: string): Promise<ExerciseDataRecord | null> => {
  try {
    const response = await api.get(`/exercise-data/${exerciseId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get exercise data:', error);
    return null;
  }
};

// Get all progress
export const getProgress = async (): Promise<ProgressEntry[]> => {
  try {
    const response = await api.get('/progress');
    return response.data;
  } catch (error) {
    console.error('Failed to get progress:', error);
    return [];
  }
};

// Get progress stats
export const getProgressStats = async (): Promise<ProgressStats | null> => {
  try {
    const response = await api.get('/progress/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to get progress stats:', error);
    return null;
  }
};

// Toggle favorite
export const toggleFavorite = async (exerciseId: string, exerciseName: string, isFavorite: boolean) => {
  try {
    if (isFavorite) {
      // Remove favorite
      await api.delete(`/favorites/${exerciseId}`);
    } else {
      // Add favorite
      await api.post('/favorites', {
        exerciseId,
        exerciseName,
      });
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    throw error;
  }
};

// Get favorites
export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
};
