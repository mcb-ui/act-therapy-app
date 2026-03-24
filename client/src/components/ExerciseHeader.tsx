import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

// User Improvement #2: Consistent exercise header with back nav, icon, title, FavoriteButton
// Replaces ad-hoc headers across all 12+ exercises

interface ExerciseHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  exerciseId: string;
  exerciseName: string;
  backTo?: string;
  backLabel?: string;
}

export default function ExerciseHeader({
  icon,
  title,
  subtitle,
  exerciseId,
  exerciseName,
  backTo = '/',
  backLabel = 'Dashboard',
}: ExerciseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center shadow-lg">
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">{title}</h1>
          <p className="text-gray-600 font-body">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <FavoriteButton exerciseId={exerciseId} exerciseName={exerciseName} />
        <Link
          to={backTo}
          className="flex items-center space-x-1 text-gray-500 hover:text-midnight-purple transition-colors text-sm font-body"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
      </div>
    </div>
  );
}
