import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppLoader from '../components/AppLoader';
import {
  getCompletedExerciseIds,
  getExerciseCompletionMap,
  getExercisesByIds,
  learningModules,
  totalTrackableExercises,
} from '../data/exerciseCatalog';
import { api } from '../lib/api';
import { buildPracticeFlowModel } from '../lib/practiceFlow';
import { getFavorites, getProgress, type Favorite, type ProgressEntry } from '../utils/exerciseTracking';

interface ValueRecord {
  id: string;
  category: string;
  description: string;
  importance: number;
  alignment: number;
}

interface ActionRecord {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  valueId?: string | null;
}

export default function Modules() {
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [values, setValues] = useState<ValueRecord[]>([]);
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setErrorMessage('');

      const [progressResult, favoritesResult, valuesResult, actionsResult] = await Promise.allSettled([
        getProgress(),
        getFavorites(),
        api.get<ValueRecord[]>('/values'),
        api.get<ActionRecord[]>('/actions'),
      ]);

      if (progressResult.status === 'fulfilled') {
        setProgressEntries(progressResult.value);
      }

      if (favoritesResult.status === 'fulfilled') {
        setFavorites(favoritesResult.value);
      }

      if (valuesResult.status === 'fulfilled') {
        setValues(valuesResult.value.data);
      }

      if (actionsResult.status === 'fulfilled') {
        setActions(actionsResult.value.data);
      }

      if (
        progressResult.status === 'rejected' ||
        favoritesResult.status === 'rejected' ||
        valuesResult.status === 'rejected' ||
        actionsResult.status === 'rejected'
      ) {
        setErrorMessage('Some learning data failed to load. The module path is still usable, but parts of it may be incomplete until refresh.');
      }

      setIsLoading(false);
    })();
  }, []);

  const completionMap = useMemo(
    () => getExerciseCompletionMap(progressEntries),
    [progressEntries]
  );
  const completedExerciseIds = useMemo(
    () => getCompletedExerciseIds(progressEntries),
    [progressEntries]
  );
  const totalCompleted = completedExerciseIds.size;

  const practiceFlow = useMemo(
    () => buildPracticeFlowModel(progressEntries, favorites, values, actions),
    [progressEntries, favorites, values, actions]
  );

  const recommendedModule = useMemo(
    () => practiceFlow.moduleRecommendation?.module ?? learningModules[0],
    [practiceFlow.moduleRecommendation]
  );
  const recommendedStartExercise =
    practiceFlow.moduleRecommendation?.nextExercise ?? getExercisesByIds(recommendedModule.exerciseIds)[0];

  if (isLoading) {
    return <AppLoader label="Loading your learning modules..." />;
  }

  return (
    <div className="space-y-8 pb-28 md:pb-0">
      {errorMessage && (
        <div className="rounded-2xl border border-inferno-red/20 bg-inferno-red/5 px-5 py-4 text-sm text-inferno-red">
          {errorMessage}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-midnight-purple/10 bg-white p-6 shadow-xl sm:p-8">
          <p className="font-subheader text-xs uppercase tracking-[0.2em] text-electric-blue">
            Learning Journey
          </p>
          <h1 className="mt-3 font-header text-4xl text-midnight-purple md:text-5xl">
            Structured ACT pathways, not just a pile of exercises.
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base leading-7 text-gray-600">
            These modules group practices into meaningful sequences so you can deepen one ACT skill
            set at a time instead of bouncing randomly between tools.
          </p>
          {practiceFlow.moduleRecommendation && (
            <div className="mt-6 rounded-[1.5rem] border border-midnight-purple/10 bg-midnight-purple/5 px-4 py-4">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                Why this path
              </p>
              <p className="mt-2 font-body text-sm leading-6 text-gray-700">
                {practiceFlow.moduleRecommendation.reason}
              </p>
              <p className="mt-3 font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                {practiceFlow.moduleRecommendation.progressLabel}
              </p>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={recommendedStartExercise?.route ?? '/'} className="btn-primary">
              {practiceFlow.moduleRecommendation?.progressLabel?.startsWith('0/')
                ? 'Start Recommended Module'
                : 'Continue Recommended Module'}
            </Link>
            <Link
              to="/progress"
              className="inline-flex items-center gap-2 rounded-2xl border border-midnight-purple/10 px-5 py-3 font-subheader text-xs uppercase tracking-[0.18em] text-midnight-purple transition hover:bg-midnight-purple hover:text-white"
            >
              <span>View Progress</span>
              <Sparkles size={16} />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-midnight-purple/10 bg-midnight-purple p-8 text-white shadow-xl shadow-midnight-purple/15">
          <div className="mb-6 flex items-center justify-between">
            <BookOpen size={40} className="text-electric-blue" />
            <span className="font-header text-5xl">
              {Math.round((totalCompleted / Math.max(totalTrackableExercises, 1)) * 100)}%
            </span>
          </div>
          <p className="font-subheader text-xs uppercase tracking-[0.2em] text-electric-blue/90">
            Total Completion
          </p>
          <p className="mt-2 font-body text-lg text-white/90">
            {totalCompleted} of {totalTrackableExercises} exercises are complete.
          </p>
          <div className="mt-6 h-3 rounded-full bg-white/15">
            <div
              className="h-3 rounded-full bg-lime-green transition-all duration-700"
              style={{ width: `${(totalCompleted / Math.max(totalTrackableExercises, 1)) * 100}%` }}
            />
          </div>
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-white/70">
              Recommended next module
            </p>
            <h2 className="mt-2 font-subheader text-lg uppercase">{recommendedModule.title}</h2>
            <p className="mt-2 font-body text-sm leading-6 text-white/80">
              {recommendedModule.description}
            </p>
            {practiceFlow.moduleRecommendation && (
              <p className="mt-4 font-body text-sm leading-6 text-white/80">
                {practiceFlow.moduleRecommendation.reason}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {learningModules.map((module, index) => {
          const exercises = getExercisesByIds(module.exerciseIds);
          const completedCount = exercises.filter(
            (exercise) => completionMap.get(exercise.id)?.isCompleted
          ).length;
          const continueExercise =
            exercises.find((exercise) => {
              const completion = completionMap.get(exercise.id);

              return Boolean(
                completion?.isStarted && !completion.isFullyCompleted
              );
            }) ?? null;
          const nextExercise =
            exercises.find((exercise) => !completionMap.get(exercise.id)?.isCompleted) ?? null;
          const ctaExercise = continueExercise ?? nextExercise;
          const isCompleted = completedCount === exercises.length;

          return (
            <div
              key={module.id}
              className="card overflow-hidden"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className={`rounded-[1.75rem] bg-gradient-to-br ${module.colorClass} p-6 text-white shadow-xl`}>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="text-5xl">{isCompleted ? '✅' : module.emoji}</div>
                    <span className="rounded-full bg-white/15 px-4 py-2 font-subheader text-[11px] uppercase tracking-[0.18em] text-white/80">
                      {module.duration}
                    </span>
                  </div>

                  <h2 className="font-subheader text-2xl uppercase">{module.title}</h2>
                  <p className="mt-3 font-body text-sm leading-6 text-white/85">{module.description}</p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between font-body text-sm text-white/80">
                      <span>{completedCount} complete</span>
                      <span>{exercises.length} total</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/15">
                      <div
                        className="h-3 rounded-full bg-white transition-all duration-700"
                        style={{ width: `${(completedCount / Math.max(exercises.length, 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {ctaExercise ? (
                    <Link
                      to={ctaExercise.route}
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-subheader text-xs uppercase tracking-[0.18em] text-midnight-purple transition hover:scale-[1.02]"
                    >
                      <span>{continueExercise ? `Resume ${ctaExercise.title}` : `Continue with ${ctaExercise.title}`}</span>
                      <PlayCircle size={16} />
                    </Link>
                  ) : (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-subheader text-xs uppercase tracking-[0.18em] text-white">
                      <CheckCircle2 size={16} />
                      <span>Module Complete</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {exercises.map((exercise) => {
                    const completion = completionMap.get(exercise.id);
                    const isComplete = Boolean(completion?.isCompleted);
                    const isInProgress = Boolean(
                      completion?.isStarted && !completion.isFullyCompleted
                    );
                    const progressLabel = isInProgress
                      ? `${completion?.completedTrackCount ?? 0}/${completion?.totalTrackCount ?? 0} reps`
                      : isComplete
                        ? 'Complete'
                        : 'Open';

                    return (
                      <Link
                        key={exercise.id}
                        to={exercise.route}
                        className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-5"
                      >
                        <div className="pr-4">
                          <p className="font-subheader text-sm uppercase text-midnight-purple">
                            {exercise.title}
                          </p>
                          <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                            {exercise.description}
                          </p>
                        </div>
                        <div className="mt-1 flex shrink-0 items-center gap-2">
                          <span className="hidden rounded-full bg-midnight-purple/5 px-3 py-1 font-subheader text-[10px] uppercase tracking-[0.16em] text-gray-500 sm:inline-flex">
                            {isInProgress ? 'In progress' : isComplete ? 'Review' : 'Open'}
                          </span>
                          {isInProgress && (
                            <span className="hidden rounded-full bg-electric-blue/10 px-3 py-1 font-subheader text-[10px] uppercase tracking-[0.16em] text-electric-blue lg:inline-flex">
                              {progressLabel}
                            </span>
                          )}
                          {isComplete ? (
                            <CheckCircle2 size={20} className="text-lime-green" />
                          ) : (
                            <PlayCircle size={20} className="text-electric-blue" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {recommendedStartExercise && (
        <div className="fixed inset-x-4 bottom-[5.25rem] z-20 md:hidden">
          <Link
            to={recommendedStartExercise.route}
            className="flex items-center justify-between rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4 shadow-2xl"
          >
            <div>
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                Recommended next
              </p>
              <p className="mt-1 font-subheader text-sm uppercase text-midnight-purple">
                {recommendedStartExercise.title}
              </p>
            </div>
            <PlayCircle size={18} className="text-electric-blue" />
          </Link>
        </div>
      )}
    </div>
  );
}
