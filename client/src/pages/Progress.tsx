import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Calendar, Flame } from 'lucide-react';
import { getProgressStats, getProgress } from '../utils/exerciseTracking';

// Improvement #2: Fix hardcoded port 5000 - now uses centralized API client
// Improvement #4: Fix totalExercises default from 25 → 33
// Improvement #16: Page title
// Improvement #39: Dynamic achievement unlocking
// Improvement #40: Real category distribution data

const EXERCISE_CATEGORIES: Record<string, string> = {
  'values-duel': 'Values',
  'values-compass': 'Values',
  'bulls-eye': 'Values',
  'life-domains': 'Values',
  'what-matters': 'Values',
  'values-in-action': 'Values',
  'silly-voice': 'Defusion',
  'thought-labels': 'Defusion',
  'thank-your-mind': 'Defusion',
  'passengers-on-bus': 'Defusion',
  'clouds-in-sky': 'Defusion',
  'leaves-stream': 'Self-as-Context',
  'observer-self': 'Self-as-Context',
  'mindful-walking': 'Mindfulness',
  'eating-meditation': 'Mindfulness',
  'sound-awareness': 'Mindfulness',
  'breath-counting': 'Mindfulness',
  'progressive-muscle-relaxation': 'Mindfulness',
  'tug-of-war': 'Acceptance',
  'willingness-scale': 'Acceptance',
  'expansion': 'Acceptance',
  'emotional-surfing': 'Acceptance',
  'guest-house': 'Acceptance',
  'smart-goals': 'Action',
  'barrier-busting': 'Action',
  'values-based-scheduling': 'Action',
  'committed-action-tracker': 'Action',
  'valued-living-questionnaire': 'Action',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Values': '#2344E7',
  'Defusion': '#784A9F',
  'Acceptance': '#FE97BB',
  'Self-as-Context': '#0EA5E9',
  'Mindfulness': '#93F357',
  'Action': '#EC4625',
};

export default function Progress() {
  const [stats, setStats] = useState({
    totalExercises: 33,
    completedExercises: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalMinutes: 0,
  });

  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', completed: 0 },
    { day: 'Tue', completed: 0 },
    { day: 'Wed', completed: 0 },
    { day: 'Thu', completed: 0 },
    { day: 'Fri', completed: 0 },
    { day: 'Sat', completed: 0 },
    { day: 'Sun', completed: 0 },
  ]);

  const [categoryData, setCategoryData] = useState([
    { name: 'Values', value: 0, color: '#2344E7' },
    { name: 'Defusion', value: 0, color: '#784A9F' },
    { name: 'Acceptance', value: 0, color: '#FE97BB' },
    { name: 'Self-as-Context', value: 0, color: '#0EA5E9' },
    { name: 'Mindfulness', value: 0, color: '#93F357' },
    { name: 'Action', value: 0, color: '#EC4625' },
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Step', description: 'Complete your first exercise', icon: '🎯', unlocked: false },
    { id: 2, title: 'Week Warrior', description: 'Achieve a 7-day streak', icon: '🔥', unlocked: false },
    { id: 3, title: 'Values Champion', description: 'Complete all Values exercises', icon: '⭐', unlocked: false },
    { id: 4, title: 'Perspective Pilot', description: 'Complete the Self-as-Context journey', icon: '👁️', unlocked: false },
    { id: 5, title: 'Mindful Master', description: 'Complete all Mindfulness exercises', icon: '🧘', unlocked: false },
    { id: 6, title: 'ACT Expert', description: 'Complete all exercises', icon: '🏆', unlocked: false },
  ]);

  useEffect(() => {
    document.title = 'Your Progress | ACT Therapy';
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [statsData, progressData] = await Promise.all([
        getProgressStats(),
        getProgress(),
      ]);

      if (statsData) {
        const completedCount = statsData.completedCount || 0;
        setStats({
          totalExercises: statsData.totalExercises || 33,
          completedExercises: completedCount,
          currentStreak: statsData.currentStreak || 0,
          longestStreak: statsData.longestStreak || 0,
          totalMinutes: completedCount * 10, // Improvement #41: estimate ~10 min per exercise
        });

        if (statsData.weeklyData) {
          setWeeklyData(statsData.weeklyData);
        }
      }

      // Improvement #40: Calculate real category distribution
      if (progressData) {
        const completedIds = progressData
          .filter((p) => p.completed)
          .map((p) => p.exerciseId);

        const categoryCounts: Record<string, number> = {};
        completedIds.forEach((id) => {
          const cat = EXERCISE_CATEGORIES[id];
          if (cat) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
        });

        setCategoryData(
          Object.entries(CATEGORY_COLORS).map(([name, color]) => ({
            name,
            value: categoryCounts[name] || 0,
            color,
          }))
        );

        // Improvement #39: Dynamic achievement unlocking
        const valuesExercises = ['values-duel', 'values-compass', 'bulls-eye', 'life-domains', 'what-matters', 'values-in-action'];
        const mindfulnessExercises = ['mindful-walking', 'eating-meditation', 'sound-awareness', 'breath-counting', 'progressive-muscle-relaxation'];
        const selfAsContextExercises = ['observer-self', 'leaves-stream'];

        const allValuesComplete = valuesExercises.every((id) => completedIds.includes(id));
        const allMindfulnessComplete = mindfulnessExercises.every((id) => completedIds.includes(id));
        const selfContextComplete = selfAsContextExercises.every((id) => completedIds.includes(id));

        setAchievements((prev) =>
          prev.map((a) => {
            switch (a.id) {
              case 1: return { ...a, unlocked: completedIds.length >= 1 };
              case 2: return { ...a, unlocked: (statsData?.longestStreak || 0) >= 7 };
              case 3: return { ...a, unlocked: allValuesComplete };
              case 4: return { ...a, unlocked: selfContextComplete };
              case 5: return { ...a, unlocked: allMindfulnessComplete };
              case 6: return { ...a, unlocked: completedIds.length >= 33 };
              default: return a;
            }
          })
        );
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const completionRate = ((stats.completedExercises / stats.totalExercises) * 100).toFixed(0);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-header text-midnight-purple mb-2 hover-glow">
          Your Progress
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Track your journey toward psychological flexibility
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover-lift bg-electric-blue text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={32} />
            <span className="text-4xl font-header">{completionRate}%</span>
          </div>
          <h3 className="font-subheader uppercase text-sm opacity-90">Completion Rate</h3>
          <p className="text-xs opacity-75 mt-1">{stats.completedExercises}/{stats.totalExercises} exercises done</p>
        </div>

        <div className="card hover-lift bg-inferno-red text-white">
          <div className="flex items-center justify-between mb-2">
            <Flame size={32} className="animate-pulse-slow" />
            <span className="text-4xl font-header">{stats.currentStreak}</span>
          </div>
          <h3 className="font-subheader uppercase text-sm opacity-90">Day Streak</h3>
          <p className="text-xs opacity-75 mt-1">Longest: {stats.longestStreak} days</p>
        </div>

        <div className="card hover-lift bg-lime-green text-white">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={32} />
            <span className="text-4xl font-header">{stats.totalMinutes}</span>
          </div>
          <h3 className="font-subheader uppercase text-sm opacity-90">Total Minutes</h3>
          <p className="text-xs opacity-75 mt-1">Time invested in growth</p>
        </div>

        <div className="card hover-lift bg-midnight-purple text-white">
          <div className="flex items-center justify-between mb-2">
            <Award size={32} />
            <span className="text-4xl font-header">{unlockedCount}/{achievements.length}</span>
          </div>
          <h3 className="font-subheader uppercase text-sm">Achievements</h3>
          <p className="text-xs opacity-75 mt-1">Unlocked badges</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="card">
          <h3 className="text-xl font-subheader text-midnight-purple mb-6 uppercase flex items-center space-x-2">
            <span className="w-2 h-2 bg-electric-blue rounded-full"></span>
            <span>Weekly Activity</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#784A9F" style={{ fontFamily: 'Archivo' }} />
              <YAxis stroke="#784A9F" style={{ fontFamily: 'Archivo' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#784A9F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Archivo'
                }}
              />
              <Bar dataKey="completed" fill="#2344E7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exercise Distribution */}
        <div className="card">
          <h3 className="text-xl font-subheader text-midnight-purple mb-6 uppercase flex items-center space-x-2">
            <span className="w-2 h-2 bg-midnight-purple rounded-full"></span>
            <span>Exercise Distribution</span>
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #784A9F',
                    borderRadius: '8px',
                    fontFamily: 'Archivo'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                <span className="text-sm font-body text-gray-700">{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-2xl font-subheader text-midnight-purple mb-6 uppercase flex items-center space-x-2">
          <Award size={24} className="text-electric-blue" />
          <span>Achievements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`card border-2 transition-all hover-lift ${
                achievement.unlocked
                  ? 'border-lime-green bg-lime-green bg-opacity-5'
                  : 'border-gray-200 opacity-50 grayscale'
              }`}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <h4 className="font-subheader uppercase text-midnight-purple mb-1">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600 font-body">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-3 text-lime-green font-subheader text-sm uppercase flex items-center justify-center space-x-1">
                    <span>✓</span>
                    <span>Unlocked</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="card bg-midnight-purple text-white text-center py-12">
        <p className="text-2xl md:text-3xl font-alt-header mb-4">
          "The curious paradox is that when I accept myself just as I am, then I can change."
        </p>
        <p className="font-body opacity-90">— Carl Rogers</p>
      </div>
    </div>
  );
}
