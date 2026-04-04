import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAppToast } from '../contexts/ToastContext';
import { toggleFavorite, getFavorites } from '../utils/exerciseTracking';

interface FavoriteButtonProps {
  exerciseId: string;
  exerciseName: string;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ exerciseId, exerciseName, className = '' }) => {
  const { success, error } = useAppToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [exerciseId]);

  const checkFavoriteStatus = async () => {
    const favorites = await getFavorites();
    const isFav = favorites.some((favorite) => favorite.exerciseId === exerciseId);
    setIsFavorite(isFav);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      await toggleFavorite(exerciseId, exerciseName, isFavorite);
      setIsFavorite(!isFavorite);
      success(isFavorite ? 'Removed from favorites.' : 'Added to favorites.');
    } catch {
      error('Could not update favorites.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`transition-all duration-200 ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={20}
        className={`transition-all ${
          isFavorite
            ? 'fill-inferno-red stroke-inferno-red'
            : 'stroke-current hover:stroke-inferno-red hover:scale-110'
        }`}
      />
    </button>
  );
};

export default FavoriteButton;
