import { exerciseById, type ProcessId } from '../data/exerciseCatalog';

export interface PracticeSessionSnapshot {
  exerciseId: string;
  route: string;
  title: string;
  processId: ProcessId | null;
  visitedAt: string;
}

export const PRACTICE_SESSION_STORAGE_KEY = 'act-practice-session';
export const PRACTICE_SESSION_EVENT = 'act:practice-session';

export const readPracticeSession = (): PracticeSessionSnapshot | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PRACTICE_SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PracticeSessionSnapshot;

    if (
      typeof parsed?.exerciseId !== 'string' ||
      typeof parsed?.route !== 'string' ||
      typeof parsed?.title !== 'string' ||
      typeof parsed?.visitedAt !== 'string'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const recordPracticeSession = (snapshot: PracticeSessionSnapshot) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PRACTICE_SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(
    new CustomEvent<PracticeSessionSnapshot>(PRACTICE_SESSION_EVENT, {
      detail: snapshot,
    })
  );
};

export const clearPracticeSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PRACTICE_SESSION_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PRACTICE_SESSION_EVENT));
};

export const getPracticeSessionExercise = (
  session: PracticeSessionSnapshot | null
) => (session ? exerciseById.get(session.exerciseId) ?? null : null);

export const formatPracticeSessionAge = (visitedAt: string) => {
  const visitTime = new Date(visitedAt).getTime();

  if (Number.isNaN(visitTime)) {
    return 'recently';
  }

  const diffMs = Date.now() - visitTime;
  const diffMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  return new Date(visitedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};
