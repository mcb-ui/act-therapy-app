import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useEffect } from 'react';
import { useExerciseTracking } from '../hooks/useExerciseTracking';

// User Improvement #3: Unified exercise completion screen
// Provides celebration, stats, save-to-server, and next exercise suggestion

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
  const { completeExercise, isSaved } = useExerciseTracking({ exerciseId, exerciseName });

  useEffect(() => {
    completeExercise(data);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card bg-lime-green text-white text-center py-12">
        {icon || <CheckCircle size={80} className="mx-auto mb-6 animate-bounce-subtle" />}
        <h1 className="text-4xl font-header mb-4">{title}</h1>
        {message && <p className="text-xl opacity-90 font-body max-w-2xl mx-auto">{message}</p>}
        {isSaved && (
          <p className="text-sm opacity-75 font-body mt-4">Progress saved</p>
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
