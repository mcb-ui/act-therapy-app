import { useState, useCallback, useRef } from 'react';
import { markExerciseComplete, saveExerciseData } from '../utils/exerciseTracking';

// Reviewer Fix #1: Use ref for isSaving/isSaved to avoid stale closure in useCallback
// This prevents the dependency on isSaving/isSaved which caused identity changes

interface UseExerciseTrackingOptions {
  exerciseId: string;
  exerciseName: string;
}

export function useExerciseTracking({ exerciseId, exerciseName }: UseExerciseTrackingOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const calledRef = useRef(false);

  const completeExercise = useCallback(async (data?: Record<string, unknown>, score?: number, notes?: string) => {
    if (calledRef.current) return;
    calledRef.current = true;
    setIsSaving(true);
    try {
      await markExerciseComplete(exerciseId, score, notes);
      if (data) {
        await saveExerciseData(exerciseId, exerciseName, data);
      }
      setIsSaved(true);
    } catch (error) {
      console.error(`Failed to save ${exerciseName}:`, error);
      calledRef.current = false;
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [exerciseId, exerciseName]);

  return { completeExercise, isSaving, isSaved };
}
