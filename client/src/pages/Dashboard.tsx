import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  ListTodo,
  Sparkles,
  Target,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../contexts/AuthContext';
import {
  exerciseCatalog,
  exerciseById,
  getCompletedExerciseIds,
  totalTrackableExercises,
} from '../data/exerciseCatalog';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { api } from '../lib/api';
import { buildPracticeFlowModel } from '../lib/practiceFlow';
import { formatPracticeSessionAge, getPracticeSessionExercise } from '../lib/practiceSession';
import {
  getFavorites,
  getProgress,
  getProgressStats,
  type Favorite,
  type ProgressEntry,
  type ProgressStats,
} from '../utils/exerciseTracking';

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
}

const readStoredTopValues = () => {
  try {
    const raw = window.localStorage.getItem('topFiveValues');
    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as Array<{ name: string; description: string }>;
  } catch {
    return [];
  }
};

const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) {
    return 'No due date';
  }

  return new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const getMostRecentExercise = (entry: ProgressEntry) =>
  exerciseCatalog.find((exercise) => exercise.trackIds.includes(entry.exerciseId));

const trimDescription = (description: string, maxLength = 84) =>
  description.length > maxLength ? `${description.slice(0, maxLength).trimEnd()}...` : description;

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [values, setValues] = useState<ValueRecord[]>([]);
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const practiceSession = usePracticeSession();

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setErrorMessage('');

      const [progressStatsResult, progressResult, favoriteResult, valuesResult, actionsResult] =
        await Promise.allSettled([
          getProgressStats(),
          getProgress(),
          getFavorites(),
          api.get<ValueRecord[]>('/values'),
          api.get<ActionRecord[]>('/actions'),
        ]);

      if (progressStatsResult.status === 'fulfilled') {
        setStats(progressStatsResult.value);
      }

      if (progressResult.status === 'fulfilled') {
        setProgressEntries(progressResult.value);
      }

      if (favoriteResult.status === 'fulfilled') {
        setFavorites(favoriteResult.value);
      }

      if (valuesResult.status === 'fulfilled') {
        setValues(valuesResult.value.data);
      }

      if (actionsResult.status === 'fulfilled') {
        setActions(actionsResult.value.data);
      }

      const hasFailedRequest = [
        progressStatsResult,
        progressResult,
        favoriteResult,
        valuesResult,
        actionsResult,
      ].some((result) => result.status === 'rejected');

      if (hasFailedRequest) {
        setErrorMessage('Some dashboard data could not be loaded. You can still continue practicing.');
      }

      setIsLoading(false);
    })();
  }, []);

  const completedExerciseIds = useMemo(
    () => getCompletedExerciseIds(progressEntries),
    [progressEntries]
  );

  const completionRate = Math.round(
    (completedExerciseIds.size / Math.max(totalTrackableExercises, 1)) * 100
  );

  const topValues = useMemo(() => {
    if (values.length > 0) {
      return [...values]
        .sort((left, right) => {
          if (right.importance !== left.importance) {
            return right.importance - left.importance;
          }

          return left.alignment - right.alignment;
        })
        .slice(0, 5)
        .map((value) => ({
          name: value.category,
          description: value.description,
          importance: value.importance,
          alignment: value.alignment,
        }));
    }

    return readStoredTopValues().map((value) => ({
      ...value,
      importance: null,
      alignment: null,
    }));
  }, [values]);

  const favoriteExercises = useMemo(
    () =>
      favorites
        .map((favorite) => exerciseById.get(favorite.exerciseId))
        .filter((exercise): exercise is NonNullable<(typeof exerciseCatalog)[number]> => Boolean(exercise)),
    [favorites]
  );

  const recentExercises = useMemo(
    () =>
      progressEntries
        .filter((entry) => entry.completed)
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        )
        .map((entry) => ({ entry, exercise: getMostRecentExercise(entry) }))
        .filter(
          (
            item
          ): item is {
            entry: ProgressEntry;
            exercise: NonNullable<ReturnType<typeof getMostRecentExercise>>;
          } => Boolean(item.exercise)
        )
        .slice(0, 3),
    [progressEntries]
  );

  const activeActions = useMemo(
    () =>
      actions
        .filter((action) => !action.completed)
        .sort((left, right) => {
          if (!left.dueDate) {
            return 1;
          }

          if (!right.dueDate) {
            return -1;
          }

          return new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
        })
        .slice(0, 4),
    [actions]
  );

  const practiceFlow = useMemo(
    () => buildPracticeFlowModel(progressEntries, favorites, values, actions),
    [progressEntries, favorites, values, actions]
  );

  const streak = stats?.currentStreak ?? 0;
  const longestStreak = stats?.longestStreak ?? 0;
  const practiceDays = stats?.practiceDays ?? 0;
  const completedThisWeek = stats?.completedThisWeek ?? 0;
  const primaryRecommendation = practiceFlow.primaryRecommendation;
  const quickResumeRecommendation = practiceFlow.quickResumeRecommendation;
  const moduleRecommendation = practiceFlow.moduleRecommendation;
  const primaryFocus = primaryRecommendation?.exercise ?? null;
  const quickResume = quickResumeRecommendation?.exercise ?? null;
  const anchorValue = topValues[0] ?? null;
  const todayAction = activeActions[0] ?? null;
  const lastSessionExercise = getPracticeSessionExercise(practiceSession);
  const lastSessionCard =
    practiceSession &&
    lastSessionExercise &&
    practiceSession.exerciseId !== primaryFocus?.id &&
    practiceSession.exerciseId !== quickResume?.id
      ? {
          exercise: lastSessionExercise,
          relativeTime: formatPracticeSessionAge(practiceSession.visitedAt),
        }
      : null;
  const primaryFocusButtonLabel =
    practiceSession?.exerciseId === primaryFocus?.id ? 'Resume This Practice' : 'Start This Practice';

  const processCards = practiceFlow.rankedProcesses;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-midnight-purple/10 bg-midnight-purple px-6 py-8 text-white shadow-2xl shadow-midnight-purple/15 sm:px-8 sm:py-10">
          <div className="relative">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric-blue/20 blur-3xl" />
            <p className="relative z-10 mb-3 font-subheader text-xs uppercase tracking-[0.24em] text-electric-blue/90">
              Today&apos;s Focus
            </p>
            <h1 className="relative z-10 mb-3 font-header text-4xl md:text-5xl">
              {user?.name ? `${user.name}, keep moving toward what matters.` : 'Keep moving toward what matters.'}
            </h1>
            <p className="relative z-10 max-w-2xl font-body text-base text-white/80 md:text-lg">
              {primaryFocus
                ? primaryRecommendation?.reason ?? `Start with ${primaryFocus.title}. One focused rep is more useful than trying to do everything at once.`
                : 'Start with one small practice today. Momentum matters more than intensity.'}
            </p>

            {primaryFocus && (
              <div className="relative z-10 mt-8 rounded-[1.75rem] border border-white/10 bg-white/10 p-5">
                <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue/90">
                  {primaryRecommendation?.label ?? 'Best next exercise'}
                </p>
                <h2 className="mt-2 font-subheader text-2xl uppercase">{primaryFocus.title}</h2>
                <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-white/80">
                  {primaryFocus.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to={primaryFocus.route} className="btn-primary bg-white text-midnight-purple hover:bg-parchment">
                    {primaryFocusButtonLabel}
                  </Link>
                  <Link
                    to="/coach"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 font-subheader text-xs uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                  >
                    <span>Talk to Coach</span>
                    <Sparkles size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-subheader text-xs uppercase tracking-[0.2em] text-gray-500">
                Today Plan
              </p>
              <h2 className="mt-2 font-header text-2xl text-midnight-purple">Three things worth attention</h2>
            </div>
            <span className="rounded-full bg-electric-blue/10 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
              {completionRate}% done
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.5rem] border border-midnight-purple/10 bg-midnight-purple/5 px-4 py-4">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">Practice</p>
              <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                {primaryFocus?.title ?? 'Choose a first exercise'}
              </p>
              <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                {primaryRecommendation?.reason ??
                  'Start your first exercise and momentum will begin to show up here.'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">Commitment</p>
              <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                {todayAction?.title ?? 'Create one committed action'}
              </p>
              <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                {todayAction
                  ? `Due ${formatDueDate(todayAction.dueDate)}. ${trimDescription(todayAction.description ?? 'Keep this action small enough to complete this week.', 72)}`
                  : 'Turn one value into a concrete move so the day has an intentional direction.'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">Anchor Value</p>
              <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                {anchorValue?.name ?? 'Clarify a value'}
              </p>
              <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                {anchorValue
                  ? trimDescription(anchorValue.description)
                  : 'Your values will appear here once you define what you want to stand for.'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">Practice Rhythm</p>
              <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                {completedThisWeek} reps this week across {practiceDays} practice days
              </p>
              <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                Consistency matters more than intensity. Keep the streak alive with one useful rep today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="rounded-2xl border border-inferno-red/20 bg-inferno-red/5 px-5 py-4 text-sm text-inferno-red">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-[1.5rem] bg-white/70 shadow-lg"
            />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-subheader text-xs uppercase tracking-[0.2em] text-gray-500">
                    Quick Resume
                  </p>
                  <h2 className="mt-2 font-header text-2xl text-midnight-purple">Return to what already works</h2>
                </div>
                <Link to="/modules" className="font-subheader text-xs uppercase tracking-[0.18em] text-electric-blue">
                  All modules
                </Link>
              </div>

              <div className="space-y-3">
                {lastSessionCard && practiceSession && (
                  <Link
                    to={practiceSession.route}
                    className="group flex items-start justify-between rounded-[1.5rem] border border-electric-blue/15 bg-electric-blue/5 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="pr-4">
                      <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                        Last session
                      </p>
                      <h3 className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                        {lastSessionCard.exercise.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                        You last opened this {lastSessionCard.relativeTime}. If you were interrupted, this is the cleanest place to pick back up.
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="mt-1 text-electric-blue transition group-hover:translate-x-1"
                    />
                  </Link>
                )}

                {moduleRecommendation && (
                  <div className="rounded-[1.5rem] border border-midnight-purple/10 bg-midnight-purple/5 px-4 py-4">
                    <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                      Recommended pathway
                    </p>
                    <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                      {moduleRecommendation.module.title}
                    </p>
                    <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                      {moduleRecommendation.reason}
                    </p>
                    <p className="mt-3 font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                      {moduleRecommendation.progressLabel}
                    </p>
                  </div>
                )}

                {quickResume ? (
                  <Link
                    to={quickResume.route}
                    className="group flex items-start justify-between rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="pr-4">
                      <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                        {quickResumeRecommendation?.label ?? 'Resume next'}
                      </p>
                      <h3 className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                        {quickResume.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                        {quickResumeRecommendation?.reason ?? quickResume.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="mt-1 text-electric-blue transition group-hover:translate-x-1"
                    />
                  </Link>
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-midnight-purple/15 bg-midnight-purple/5 px-5 py-6 text-center">
                    <CheckCircle2 className="mx-auto mb-3 text-lime-green" size={32} />
                    <p className="font-body text-gray-700">
                      Pick your first exercise and your dashboard will start adapting around it.
                    </p>
                  </div>
                )}

                {favoriteExercises.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-midnight-purple/15 bg-midnight-purple/5 px-4 py-6 text-center">
                    <Heart className="mx-auto mb-2 text-brand-pink" size={28} />
                    <p className="font-body text-sm text-gray-700">
                      Tap hearts on exercises you want fast access to later.
                    </p>
                  </div>
                ) : (
                  favoriteExercises.slice(0, 2).map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-start justify-between rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4 shadow-sm"
                    >
                      <Link to={exercise.route} className="block flex-1 pr-4">
                        <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                          {exercise.title}
                        </h3>
                        <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                          {exercise.description}
                        </p>
                      </Link>
                      <FavoriteButton exerciseId={exercise.id} exerciseName={exercise.title} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-subheader text-xs uppercase tracking-[0.2em] text-gray-500">
                    Active Commitments
                  </p>
                  <h2 className="mt-2 font-header text-2xl text-midnight-purple">Keep behavior moving</h2>
                </div>
                <Link to="/exercises/action" className="font-subheader text-xs uppercase tracking-[0.18em] text-electric-blue">
                  Open planner
                </Link>
              </div>

              {activeActions.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-midnight-purple/15 bg-midnight-purple/5 px-5 py-8 text-center">
                  <ListTodo className="mx-auto mb-3 text-lime-green" size={32} />
                  <p className="font-body text-gray-700">
                    Turn a value into one small move. A useful dashboard starts with a useful commitment.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeActions.map((action) => (
                    <div
                      key={action.id}
                      className="rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                            {action.title}
                          </h3>
                          {action.description && (
                            <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                              {action.description}
                            </p>
                          )}
                        </div>
                        <div className="rounded-full bg-lime-green/10 p-2 text-lime-green">
                          <Clock3 size={16} />
                        </div>
                      </div>
                      <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                        Due {formatDueDate(action.dueDate)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="card">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-subheader text-xs uppercase tracking-[0.2em] text-gray-500">
                    Values Anchor
                  </p>
                  <h2 className="mt-2 font-header text-2xl text-midnight-purple">
                    What matters most right now
                  </h2>
                </div>
                <Link to="/exercises/values" className="font-subheader text-xs uppercase tracking-[0.18em] text-electric-blue">
                  Clarify values
                </Link>
              </div>

              {topValues.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-midnight-purple/15 bg-midnight-purple/5 px-5 py-8 text-center">
                  <Target className="mx-auto mb-3 text-electric-blue" size={32} />
                  <p className="font-body text-gray-700">
                    Start a values exercise to surface the directions you want your life to move toward.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topValues.slice(0, 3).map((value, index) => (
                    <div
                      key={`${value.name}-${index}`}
                      className="rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-midnight-purple text-sm font-subheader text-white">
                            {index + 1}
                          </div>
                          <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                            {value.name}
                          </h3>
                        </div>
                        {'importance' in value && value.importance != null && (
                          <span className="rounded-full bg-electric-blue/10 px-3 py-1 text-[11px] font-subheader uppercase tracking-[0.16em] text-electric-blue">
                            {value.importance}/10
                          </span>
                        )}
                      </div>
                      <p className="font-body text-sm leading-6 text-gray-600">{value.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-subheader text-xs uppercase tracking-[0.2em] text-gray-500">
                    Recent Wins
                  </p>
                  <h2 className="mt-2 font-header text-2xl text-midnight-purple">Momentum worth keeping</h2>
                </div>
                <Link to="/progress" className="font-subheader text-xs uppercase tracking-[0.18em] text-electric-blue">
                  Full progress
                </Link>
              </div>

              {recentExercises.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-midnight-purple/15 bg-midnight-purple/5 px-4 py-6 text-center">
                  <CheckCircle2 className="mx-auto mb-2 text-lime-green" size={28} />
                  <p className="font-body text-sm text-gray-700">
                    Completed exercises will appear here once you start logging progress.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {recentExercises.map(({ entry, exercise }) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                          {exercise.title}
                        </h3>
                        <CheckCircle2 size={18} className="text-lime-green" />
                      </div>
                      <p className="font-body text-sm text-gray-600">
                        Completed {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-subheader text-xs uppercase tracking-[0.2em] text-gray-500">
                  Strengthen By Process
                </p>
                <h2 className="mt-2 font-header text-2xl text-midnight-purple">
                  Choose the ACT skill that needs attention next
                </h2>
              </div>
              <div className="rounded-full bg-midnight-purple/5 px-4 py-2 text-center">
                <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  Streak
                </p>
                <p className="font-body text-sm font-semibold text-midnight-purple">
                  {streak} days, best {longestStreak}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {processCards.map((process) => (
                <Link
                  key={process.id}
                  to={process.continueExercise?.route ?? process.nextExercise?.route ?? '/modules'}
                  className="card-hover group bg-white"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${process.colorClass} shadow-lg`}>
                      <process.icon size={24} className="text-white" />
                    </div>
                    <ArrowRight size={16} className="text-electric-blue transition group-hover:translate-x-1" />
                  </div>
                  <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                    {process.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                    {process.description}
                  </p>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between font-body text-sm text-gray-600">
                      <span>{process.completedCount} complete</span>
                      <span>{process.totalCount} total</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-electric-blue transition-all duration-700"
                        style={{ width: `${(process.completedCount / Math.max(process.totalCount, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="mt-4 font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                    {process.continueExercise ? `Continue ${process.continueExercise.title}` : process.nextExercise ? `Start ${process.nextExercise.title}` : 'Review module'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
