import { useEffect, useState } from 'react';
import {
  PRACTICE_SESSION_EVENT,
  readPracticeSession,
  type PracticeSessionSnapshot,
} from '../lib/practiceSession';

export function usePracticeSession() {
  const [practiceSession, setPracticeSession] = useState<PracticeSessionSnapshot | null>(() =>
    readPracticeSession()
  );

  useEffect(() => {
    const syncFromStorage = () => {
      setPracticeSession(readPracticeSession());
    };

    const handlePracticeSessionUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<PracticeSessionSnapshot | undefined>;
      setPracticeSession(customEvent.detail ?? readPracticeSession());
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener(PRACTICE_SESSION_EVENT, handlePracticeSessionUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener(
        PRACTICE_SESSION_EVENT,
        handlePracticeSessionUpdate as EventListener
      );
    };
  }, []);

  return practiceSession;
}
