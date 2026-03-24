import { useState, useCallback } from 'react';
import { markExerciseComplete, saveExerciseData } from '../utils/exerciseTracking';

// User Improvement #1: Reusable hook for exercise completion tracking
// Wraps the completion + data saving so all exercises can track progress consistently

interface UseExerciseTrackingOptions {
  exerciseId: string;
  exerciseName: string;
}

export function useExerciseTracking({ exerciseId, exerciseName }: UseExerciseTrackingOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const completeExercise = useCallback(async (data?: Record<string, unknown>, score?: number, notes?: string) => {
    if (isSaving || isSaved) return;
    setIsSaving(true);
    try {
      await markExerciseComplete(exerciseId, score, notes);
      if (data) {
        await saveExerciseData(exerciseId, exerciseName, data);
      }
      setIsSaved(true);
    } catch (error) {
      console.error(`Failed to save ${exerciseName}:`, error);
    } finally {
      setIsSaving(false);
    }
  }, [exerciseId, exerciseName, isSaving, isSaved]);

  return { completeExercise, isSaving, isSaved };
}
