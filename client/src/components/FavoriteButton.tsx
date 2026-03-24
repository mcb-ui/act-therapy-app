import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite, getFavorites } from '../utils/exerciseTracking';

// Improvement #29: Replace `any` types

interface FavoriteRecord {
  exerciseId: string;
}

interface FavoriteButtonProps {
  exerciseId: string;
  exerciseName: string;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ exerciseId, exerciseName, className = '' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [exerciseId]);

  const checkFavoriteStatus = async () => {
    const favorites = await getFavorites();
    const isFav = favorites.some((f: FavoriteRecord) => f.exerciseId === exerciseId);
    setIsFavorite(isFav);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    // Improvement #38b: Optimistic update
    setIsFavorite(!isFavorite);
    try {
      await toggleFavorite(exerciseId, exerciseName, isFavorite);
    } catch {
      // Revert on failure
      setIsFavorite(isFavorite);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`transition-all duration-200 ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isFavorite ? `Remove ${exerciseName} from favorites` : `Add ${exerciseName} to favorites`}
      aria-pressed={isFavorite}
    >
      <Heart
        size={20}
        className={`transition-all ${
          isFavorite
            ? 'fill-inferno-red stroke-inferno-red scale-110'
            : 'stroke-current hover:stroke-inferno-red hover:scale-110'
        }`}
      />
    </button>
  );
};

export default FavoriteButton;
