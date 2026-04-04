import type { ReactNode } from 'react';
import { Clock3, Save, Sparkles } from 'lucide-react';
import ExerciseBackButton from './ExerciseBackButton';
import { exerciseById, processCatalog } from '../data/exerciseCatalog';

type DraftStatus = 'idle' | 'saving' | 'saved';

interface ExerciseShellProps {
  exerciseId: string;
  title?: string;
  subtitle?: string;
  intro?: string;
  estimatedDuration?: string;
  whyItMatters?: string;
  draftStatus?: DraftStatus;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const draftStatusLabels: Record<DraftStatus, string> = {
  idle: 'Ready',
  saving: 'Saving draft',
  saved: 'Draft saved',
};

export default function ExerciseShell({
  exerciseId,
  title,
  subtitle,
  intro,
  estimatedDuration,
  whyItMatters,
  draftStatus = 'idle',
  headerActions,
  footer,
  children,
}: ExerciseShellProps) {
  const exercise = exerciseById.get(exerciseId);
  const process = exercise?.processId
    ? processCatalog.find((candidate) => candidate.id === exercise.processId)
    : null;

  const resolvedTitle = title ?? exercise?.title ?? 'Exercise';
  const resolvedSubtitle = subtitle ?? exercise?.description ?? '';
  const resolvedDuration = estimatedDuration ?? '10 min';

  return (
    <div className={`mx-auto max-w-5xl space-y-6 ${footer ? 'pb-28 md:pb-0' : ''}`}>
      <section className="overflow-hidden rounded-[2rem] border border-brand-pink/35 bg-white/95 shadow-[0_24px_60px_rgba(31,20,47,0.08)]">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(31,137,150,0.10),_transparent_38%),linear-gradient(180deg,rgba(68,37,103,0.08),rgba(255,255,255,0))] px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <ExerciseBackButton className="w-auto" />
              <div className="flex flex-wrap items-center gap-2">
                {process && (
                  <span className="rounded-full bg-midnight-purple px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-white">
                    {process.title}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-electric-blue/10 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                  <Clock3 size={13} />
                  {resolvedDuration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-midnight-purple/5 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-brand-pink-700">
                  <Save size={13} />
                  {draftStatusLabels[draftStatus]}
                </span>
              </div>
            </div>

            {headerActions ? <div className="flex shrink-0 flex-wrap gap-3">{headerActions}</div> : null}
          </div>

          <div className="mt-6 max-w-3xl">
            <p className="font-subheader text-[10px] uppercase tracking-[0.18em] text-electric-blue">
              Guided Practice
            </p>
            <h1 className="mt-3 font-header text-3xl text-midnight-purple sm:text-4xl">{resolvedTitle}</h1>
            {resolvedSubtitle ? (
              <p className="mt-3 font-body text-base leading-7 text-[#4e3f5e]">{resolvedSubtitle}</p>
            ) : null}
            {intro ? (
              <p className="mt-4 font-body text-base leading-7 text-[#1f142f]">{intro}</p>
            ) : null}
          </div>
        </div>
      </section>

      {whyItMatters ? (
        <section className="rounded-[1.75rem] border border-electric-blue/15 bg-[rgba(31,137,150,0.06)] px-5 py-5 shadow-sm sm:px-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-electric-blue shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-electric-blue">
                Why This Matters
              </p>
              <p className="mt-2 font-body text-sm leading-7 text-gray-700 sm:text-base">
                {whyItMatters}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <div className="space-y-6">{children}</div>

      {footer ? (
        <div className="fixed inset-x-4 bottom-[5.25rem] z-20 rounded-[1.5rem] border border-brand-pink/35 bg-[rgba(252,250,251,0.94)] p-3 shadow-2xl backdrop-blur md:static md:inset-auto md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
