import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';

type DraftStatus = 'idle' | 'saving' | 'saved';

interface ExerciseDraftResult<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  clearDraft: () => void;
  draftStatus: DraftStatus;
  hasStoredDraft: boolean;
}

function loadDraftValue<T>(storageKey: string, fallback: T) {
  if (typeof window === 'undefined') {
    return { value: fallback, hasStoredDraft: false };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return { value: fallback, hasStoredDraft: false };
    }

    return {
      value: JSON.parse(raw) as T,
      hasStoredDraft: true,
    };
  } catch {
    return { value: fallback, hasStoredDraft: false };
  }
}

export function useExerciseDraft<T>(storageKey: string, initialValue: T): ExerciseDraftResult<T> {
  const initialValueRef = useRef(initialValue);
  const initialDraft = useMemo(
    () => loadDraftValue(storageKey, initialValueRef.current),
    [storageKey]
  );
  const [hasStoredDraft, setHasStoredDraft] = useState(initialDraft.hasStoredDraft);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>(initialDraft.hasStoredDraft ? 'saved' : 'idle');

  const initialSerialized = useMemo(
    () => JSON.stringify(initialValueRef.current),
    []
  );

  const [value, setValue] = useState<T>(initialDraft.value);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const serialized = JSON.stringify(value);

    if (serialized === initialSerialized) {
      window.localStorage.removeItem(storageKey);
      setHasStoredDraft(false);
      setDraftStatus('idle');
      return;
    }

    setDraftStatus('saving');

    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, serialized);
      setHasStoredDraft(true);
      setDraftStatus('saved');
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [initialSerialized, storageKey, value]);

  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }

    setValue(initialValueRef.current);
    setHasStoredDraft(false);
    setDraftStatus('idle');
  }, [storageKey]);

  return {
    value,
    setValue,
    clearDraft,
    draftStatus,
    hasStoredDraft,
  };
}
