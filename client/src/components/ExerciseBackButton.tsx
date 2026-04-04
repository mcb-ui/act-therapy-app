import { useNavigate } from 'react-router-dom';

interface ExerciseBackButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary';
  fallbackPath?: string;
  className?: string;
}

export default function ExerciseBackButton({
  label = 'Back to Modules',
  variant = 'secondary',
  fallbackPath = '/modules',
  className = 'w-full',
}: ExerciseBackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const historyIndex =
      typeof window !== 'undefined' && typeof window.history.state?.idx === 'number'
        ? window.history.state.idx
        : 0;

    if (historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`}
    >
      {label}
    </button>
  );
}
