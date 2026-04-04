import { useEffect, useMemo, useState } from 'react';
import { Award, Calendar, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import AppLoader from '../components/AppLoader';
import ProgressTrendsPanel from '../components/progress/ProgressTrendsPanel';
import {
  exerciseCatalog,
  getCompletedExerciseIds,
  getExercisesByProcess,
  processCatalog,
  totalTrackableExercises,
} from '../data/exerciseCatalog';
import { getProgress, getProgressStats, type ProgressEntry } from '../utils/exerciseTracking';

interface UiStats {
  completedExercises: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  practiceDays: number;
  completedThisWeek: number;
  lastCompletedAt: string | null;
}

interface CategoryDataPoint {
  name: string;
  value: number;
  total: number;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

type ProgressTab = 'overview' | 'trends' | 'achievements';

const EMPTY_WEEKLY_DATA = [
  { day: 'Mon', completed: 0 },
  { day: 'Tue', completed: 0 },
  { day: 'Wed', completed: 0 },
  { day: 'Thu', completed: 0 },
  { day: 'Fri', completed: 0 },
  { day: 'Sat', completed: 0 },
  { day: 'Sun', completed: 0 },
];

const progressTabs: Array<{ id: ProgressTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'trends', label: 'Trends' },
  { id: 'achievements', label: 'Achievements' },
];

const getTrackedMindfulnessMinutes = (progressEntries: ProgressEntry[]) => {
  const totalSeconds = progressEntries.reduce((sum, entry) => {
    if (
      !entry.completed ||
      !entry.exerciseId.startsWith('mindfulness-') ||
      typeof entry.score !== 'number'
    ) {
      return sum;
    }

    return sum + entry.score;
  }, 0);

  return Math.round(totalSeconds / 60);
};

const getRecentCompletions = (progressEntries: ProgressEntry[]) =>
  progressEntries
    .filter((entry) => entry.completed)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((entry) => ({
      entry,
      exercise: exerciseCatalog.find((exercise) => exercise.trackIds.includes(entry.exerciseId)),
    }))
    .filter(
      (
        item
      ): item is {
        entry: ProgressEntry;
        exercise: NonNullable<(typeof exerciseCatalog)[number]>;
      } => Boolean(item.exercise)
    )
    .slice(0, 5);

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`rounded-[1.5rem] border px-5 py-5 transition ${
        achievement.unlocked
          ? 'border-lime-green/30 bg-lime-green/10 shadow-md'
          : 'border-midnight-purple/10 bg-white opacity-70'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <Award size={24} className={achievement.unlocked ? 'text-lime-green' : 'text-gray-300'} />
        {achievement.unlocked && (
          <span className="rounded-full bg-lime-green px-3 py-1 text-[10px] font-subheader uppercase tracking-[0.18em] text-white">
            Unlocked
          </span>
        )}
      </div>
      <h3 className="font-subheader text-sm uppercase text-midnight-purple">{achievement.title}</h3>
      <p className="mt-2 font-body text-sm leading-6 text-gray-600">{achievement.description}</p>
    </div>
  );
}

export default function Progress() {
  const [stats, setStats] = useState<UiStats>({
    completedExercises: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalMinutes: 0,
    practiceDays: 0,
    completedThisWeek: 0,
    lastCompletedAt: null,
  });
  const [weeklyData, setWeeklyData] = useState(EMPTY_WEEKLY_DATA);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProgressTab>('overview');

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      const [statsResponse, progressResponse] = await Promise.all([getProgressStats(), getProgress()]);

      setProgressEntries(progressResponse);

      const completedExerciseIds = getCompletedExerciseIds(progressResponse);
      const totalMinutes = getTrackedMindfulnessMinutes(progressResponse);

      setStats({
        completedExercises: completedExerciseIds.size,
        currentStreak: statsResponse?.currentStreak ?? 0,
        longestStreak: statsResponse?.longestStreak ?? 0,
        totalMinutes,
        practiceDays: statsResponse?.practiceDays ?? 0,
        completedThisWeek: statsResponse?.completedThisWeek ?? 0,
        lastCompletedAt: statsResponse?.lastCompletedAt ?? null,
      });
      setWeeklyData(statsResponse?.weeklyData?.length ? statsResponse.weeklyData : EMPTY_WEEKLY_DATA);
      setIsLoading(false);
    })();
  }, []);

  const completedExerciseIds = useMemo(
    () => getCompletedExerciseIds(progressEntries),
    [progressEntries]
  );

  const categoryData = useMemo<CategoryDataPoint[]>(
    () =>
      processCatalog.map((process) => {
        const exercises = getExercisesByProcess(process.id);

        return {
          name: process.title.replace(' Clarification', ''),
          value: exercises.filter((exercise) => completedExerciseIds.has(exercise.id)).length,
          total: exercises.length,
          color: process.accent,
        };
      }),
    [completedExerciseIds]
  );

  const recentCompletions = useMemo(() => getRecentCompletions(progressEntries), [progressEntries]);

  const completionRate = Math.round(
    (stats.completedExercises / Math.max(totalTrackableExercises, 1)) * 100
  );

  const achievements: Achievement[] = [
    {
      id: 'first-step',
      title: 'First Step',
      description: 'Complete your first exercise.',
      unlocked: stats.completedExercises > 0,
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day practice streak.',
      unlocked: stats.currentStreak >= 7,
    },
    {
      id: 'values-champion',
      title: 'Values Champion',
      description: 'Complete every values-focused exercise.',
      unlocked:
        categoryData.find((category) => category.name === 'Values')?.value ===
        categoryData.find((category) => category.name === 'Values')?.total,
    },
    {
      id: 'mindful-master',
      title: 'Mindful Master',
      description: 'Accumulate 100 minutes of mindfulness practice.',
      unlocked: stats.totalMinutes >= 100,
    },
    {
      id: 'act-expert',
      title: 'ACT Expert',
      description: 'Complete every trackable exercise in the app.',
      unlocked: stats.completedExercises >= totalTrackableExercises,
    },
  ];

  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked);

  if (isLoading) {
    return <AppLoader label="Loading your progress overview..." />;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-midnight-purple/10 bg-white p-6 shadow-xl sm:p-8">
          <p className="font-subheader text-xs uppercase tracking-[0.2em] text-electric-blue">
            Practice Pulse
          </p>
          <h1 className="mt-3 font-header text-4xl text-midnight-purple md:text-5xl">
            One place to see momentum, balance, and what to strengthen next.
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base leading-7 text-gray-600">
            Progress in ACT is not only about volume. This view now separates quick signals from deeper analytics so you can scan fast or dig in when you want.
          </p>
        </div>

        <div className="rounded-[2rem] border border-midnight-purple/10 bg-midnight-purple p-8 text-white shadow-xl shadow-midnight-purple/15">
          <div className="mb-6 flex items-center justify-between">
            <TrendingUp size={36} className="text-electric-blue" />
            <span className="font-header text-5xl">{completionRate}%</span>
          </div>
          <p className="font-subheader text-xs uppercase tracking-[0.2em] text-electric-blue/90">
            Overall Completion
          </p>
          <p className="mt-2 font-body text-base text-white/85">
            {stats.completedExercises} of {totalTrackableExercises} trackable exercises logged.
          </p>
          <div className="mt-6 h-3 rounded-full bg-white/15">
            <div
              className="h-3 rounded-full bg-lime-green transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-white/70">
                This week
              </p>
              <p className="mt-2 font-subheader text-sm uppercase">
                {stats.completedThisWeek} practice reps
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-white/70">
                Practice days
              </p>
              <p className="mt-2 font-subheader text-sm uppercase">
                {stats.practiceDays} days logged
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-midnight-purple/10 bg-white p-2 shadow-lg sm:p-3">
        <div className="flex flex-wrap gap-2">
          {progressTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-4 py-3 font-subheader text-xs uppercase tracking-[0.18em] transition ${
                activeTab === tab.id
                  ? 'bg-midnight-purple text-white shadow-lg shadow-midnight-purple/15'
                  : 'text-gray-500 hover:bg-midnight-purple/5 hover:text-midnight-purple'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="card bg-electric-blue text-white shadow-xl shadow-electric-blue/15">
              <div className="mb-4 flex items-center justify-between">
                <TrendingUp size={28} />
                <span className="font-header text-4xl">{completionRate}%</span>
              </div>
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-white/80">
                Completion
              </p>
              <p className="mt-1 font-body text-sm text-white/85">
                {stats.completedExercises}/{totalTrackableExercises} complete
              </p>
            </div>

            <div className="card bg-inferno-red text-white shadow-xl shadow-inferno-red/15">
              <div className="mb-4 flex items-center justify-between">
                <Flame size={28} />
                <span className="font-header text-4xl">{stats.currentStreak}</span>
              </div>
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-white/80">
                Current Streak
              </p>
              <p className="mt-1 font-body text-sm text-white/85">
                Longest streak: {stats.longestStreak} days
              </p>
            </div>

            <div className="card bg-lime-green text-white shadow-xl shadow-lime-green/15">
              <div className="mb-4 flex items-center justify-between">
                <Calendar size={28} />
                <span className="font-header text-4xl">{stats.completedThisWeek}</span>
              </div>
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-white/80">
                This Week
              </p>
              <p className="mt-1 font-body text-sm text-white/85">
                Completion reps in the last 7 days
              </p>
            </div>

            <div className="card bg-white shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <Award size={28} className="text-electric-blue" />
                <span className="font-header text-4xl text-midnight-purple">{stats.practiceDays}</span>
              </div>
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Practice Days
              </p>
              <p className="mt-1 font-body text-sm text-gray-600">
                {stats.lastCompletedAt
                  ? `Last completion ${new Date(stats.lastCompletedAt).toLocaleDateString()}`
                  : 'Your active days will build as you log more reps.'}
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="card">
              <h2 className="mb-5 font-subheader text-xl uppercase text-midnight-purple">
                Recent Momentum
              </h2>
              {recentCompletions.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-midnight-purple/15 bg-midnight-purple/5 px-5 py-8 text-center">
                  <CheckCircle2 className="mx-auto mb-3 text-lime-green" size={32} />
                  <p className="font-body text-gray-700">
                    Completed exercises will appear here once you start logging progress.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCompletions.map(({ entry, exercise }) => (
                    <div
                      key={entry.id}
                      className="rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                          {exercise.title}
                        </h3>
                        <CheckCircle2 size={18} className="text-lime-green" />
                      </div>
                      <p className="font-body text-sm text-gray-600">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="font-subheader text-xl uppercase text-midnight-purple">
                  Skill Balance
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {categoryData.map((category) => (
                    <div key={category.name} className="rounded-2xl border border-midnight-purple/10 bg-white px-4 py-4">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <p className="font-subheader text-xs uppercase tracking-[0.18em] text-midnight-purple">
                          {category.name}
                        </p>
                      </div>
                      <p className="font-body text-sm text-gray-600">
                        {category.value} of {category.total} completed
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-subheader text-xl uppercase text-midnight-purple">
                    Latest Wins
                  </h2>
                  <span className="rounded-full bg-lime-green/10 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-lime-green">
                    {unlockedAchievements.length} unlocked
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'trends' && (
        <ProgressTrendsPanel weeklyData={weeklyData} categoryData={categoryData} />
      )}

      {activeTab === 'achievements' && (
        <section className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-subheader text-xs uppercase tracking-[0.2em] text-gray-500">
                Achievements
              </p>
              <h2 className="mt-2 font-header text-2xl text-midnight-purple">
                Milestones that reflect consistency
              </h2>
            </div>
            <span className="rounded-full bg-electric-blue/10 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
              {unlockedAchievements.length} unlocked
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
