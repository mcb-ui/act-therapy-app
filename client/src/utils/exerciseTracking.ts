import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Mark exercise as complete
export const markExerciseComplete = async (exerciseId: string, score?: number, notes?: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_BASE}/progress`,
      {
        exerciseId,
        completed: true,
        score,
        notes,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error('Failed to mark exercise complete:', error);
  }
};

// Save exercise data (responses)
export const saveExerciseData = async (exerciseId: string, exerciseName: string, data: any) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_BASE}/exercise-data`,
      {
        exerciseId,
        exerciseName,
        data,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error('Failed to save exercise data:', error);
  }
};

// Get exercise data
export const getExerciseData = async (exerciseId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/exercise-data/${exerciseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get exercise data:', error);
    return null;
  }
};

// Get all progress
export const getProgress = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get progress:', error);
    return [];
  }
};

// Get progress stats
export const getProgressStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/progress/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get progress stats:', error);
    return null;
  }
};

// Toggle favorite
export const toggleFavorite = async (exerciseId: string, exerciseName: string, isFavorite: boolean) => {
  try {
    const token = localStorage.getItem('token');
    if (isFavorite) {
      // Remove favorite
      await axios.delete(`${API_BASE}/favorites/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Add favorite
      await axios.post(
        `${API_BASE}/favorites`,
        {
          exerciseId,
          exerciseName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};

// Get favorites
export const getFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
};
