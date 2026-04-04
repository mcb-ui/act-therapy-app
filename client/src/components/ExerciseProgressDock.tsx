import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppToast } from '../contexts/ToastContext';
import { exerciseByRoute, getExerciseCompletionState } from '../data/exerciseCatalog';
import { getProgress, markExerciseComplete, type ProgressEntry } from '../utils/exerciseTracking';

export default function ExerciseProgressDock() {
  const location = useLocation();
  const { success, error } = useAppToast();
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const exercise = exerciseByRoute.get(location.pathname);

  useEffect(() => {
    if (!exercise?.showCompletionDock) {
      return;
    }

    void (async () => {
      const progress = await getProgress();
      setProgressEntries(progress);
    })();
  }, [exercise]);

  const completion = useMemo(
    () => (exercise ? getExerciseCompletionState(exercise, progressEntries) : null),
    [exercise, progressEntries]
  );
  const isCompleted = completion?.isCompleted ?? false;
  const isFullyCompleted = completion?.isFullyCompleted ?? false;

  if (!exercise?.showCompletionDock) {
    return null;
  }

  const handleMarkComplete = async () => {
    if (isFullyCompleted || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const trackIdToMark = completion?.nextTrackId ?? exercise.trackIds[0];
      await markExerciseComplete(trackIdToMark, 100, `Completed ${exercise.title}`);
      setProgressEntries((current) => [
        {
          id: `local-${trackIdToMark}-${Date.now()}`,
          exerciseId: trackIdToMark,
          completed: true,
          score: 100,
          notes: `Completed ${exercise.title}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...current,
      ]);
      success(
        completion && completion.totalTrackCount > 1
          ? `${exercise.title}: ${Math.min(completion.completedTrackCount + 1, completion.totalTrackCount)}/${completion.totalTrackCount} practices logged.`
          : `${exercise.title} added to your progress.`
      );
    } catch (err) {
      error('Could not update progress for this exercise.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sticky bottom-4 mt-8 flex justify-end">
      <div className="max-w-sm rounded-2xl border border-brand-pink/35 bg-[rgba(252,250,251,0.95)] p-4 shadow-2xl backdrop-blur">
        <div className="mb-3 flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-electric-blue/10 p-2 text-electric-blue">
            {isCompleted ? <CheckCircle2 size={18} /> : <CircleDashed size={18} />}
          </div>
          <div className="min-w-0">
            <p className="font-subheader text-xs uppercase tracking-[0.18em] text-[#8c8199]">
              Exercise Progress
            </p>
            <p className="font-body text-sm text-[#4e3f5e]">
              {completion && completion.totalTrackCount > 1
                ? completion.isFullyCompleted
                  ? `All ${completion.totalTrackCount} internal practices are logged here.`
                  : `${completion.completedTrackCount} of ${completion.totalTrackCount} internal practices logged.`
                : isCompleted
                ? 'This exercise is already counted in your progress.'
                : 'Finished this practice? Add it to your progress in one click.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleMarkComplete}
          disabled={isFullyCompleted || isSaving}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFullyCompleted
            ? 'Completed'
            : isSaving
            ? 'Saving...'
            : completion && completion.totalTrackCount > 1
            ? 'Log Next Practice'
            : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
}
