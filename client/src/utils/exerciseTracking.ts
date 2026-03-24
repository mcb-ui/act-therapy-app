import api from './api';

// Improvement #1, #6, #7: Use centralized API client with relative URLs (fixes port 5000 bug)

// Improvement #26: TypeScript interfaces for API responses
interface ProgressRecord {
  id: string;
  userId: string;
  exerciseId: string;
  completed: boolean;
  score: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FavoriteRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  createdAt: string;
}

interface ExerciseDataRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  data: string;
  completedAt: string;
  updatedAt: string;
}

interface ProgressStats {
  completedCount: number;
  currentStreak: number;
  longestStreak: number;
  weeklyData: { day: string; completed: number }[];
  totalExercises: number;
}

// Mark exercise as complete
export const markExerciseComplete = async (exerciseId: string, score?: number, notes?: string) => {
  try {
    await api.post('/progress', { exerciseId, completed: true, score, notes });
  } catch (error) {
    console.error('Failed to mark exercise complete:', error);
  }
};

// Save exercise data (responses)
export const saveExerciseData = async (exerciseId: string, exerciseName: string, data: Record<string, unknown>) => {
  try {
    await api.post('/exercise-data', { exerciseId, exerciseName, data });
  } catch (error) {
    console.error('Failed to save exercise data:', error);
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
export const getProgress = async (): Promise<ProgressRecord[]> => {
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
      await api.delete(`/favorites/${exerciseId}`);
    } else {
      await api.post('/favorites', { exerciseId, exerciseName });
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};

// Get favorites
export const getFavorites = async (): Promise<FavoriteRecord[]> => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
};
