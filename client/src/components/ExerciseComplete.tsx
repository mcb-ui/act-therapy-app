import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useExerciseTracking } from '../hooks/useExerciseTracking';

// Reviewer Fix #1: Prevent double-fire in StrictMode via ref guard
// Reviewer Fix #7: Show error feedback when save fails

interface ExerciseCompleteProps {
  exerciseId: string;
  exerciseName: string;
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
  nextExercise?: { path: string; name: string };
  children?: React.ReactNode;
}

export default function ExerciseComplete({
  exerciseId,
  exerciseName,
  icon,
  title = 'Exercise Complete!',
  message,
  data,
  nextExercise,
  children,
}: ExerciseCompleteProps) {
  const { completeExercise, isSaved, isSaving } = useExerciseTracking({ exerciseId, exerciseName });
  const hasCalledRef = useRef(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;
    completeExercise(data).catch(() => setSaveError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card bg-lime-green text-white text-center py-12">
        {icon || <CheckCircle size={80} className="mx-auto mb-6 animate-bounce-subtle" />}
        <h1 className="text-4xl font-header mb-4">{title}</h1>
        {message && <p className="text-xl opacity-90 font-body max-w-2xl mx-auto">{message}</p>}
        {isSaving && (
          <p className="text-sm opacity-75 font-body mt-4">Saving progress...</p>
        )}
        {isSaved && (
          <p className="text-sm opacity-75 font-body mt-4">Progress saved</p>
        )}
        {saveError && (
          <p className="text-sm opacity-90 font-body mt-4 flex items-center justify-center space-x-1">
            <AlertCircle size={14} />
            <span>Could not save — your progress may not be recorded</span>
          </p>
        )}
      </div>

      {children}

      <div className="flex flex-col sm:flex-row gap-3">
        {nextExercise && (
          <Link
            to={nextExercise.path}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <span>Next: {nextExercise.name}</span>
            <ArrowRight size={18} />
          </Link>
        )}
        <Link
          to="/"
          className="btn-secondary flex-1 flex items-center justify-center space-x-2"
        >
          <Home size={18} />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
