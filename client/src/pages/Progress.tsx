import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Calendar, Flame } from 'lucide-react';
import axios from 'axios';

export default function Progress() {
  const [stats, setStats] = useState({
    totalExercises: 25,
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

  const categoryData = [
    { name: 'Values', value: 0, color: '#2344E7' },
    { name: 'Defusion', value: 0, color: '#784A9F' },
    { name: 'Acceptance', value: 0, color: '#FE97BB' },
    { name: 'Self-as-Context', value: 0, color: '#0EA5E9' },
    { name: 'Mindfulness', value: 0, color: '#93F357' },
    { name: 'Action', value: 0, color: '#EC4625' },
  ];

  const achievements = [
    { id: 1, title: 'First Step', description: 'Complete your first exercise', icon: '🎯', unlocked: false },
    { id: 2, title: 'Week Warrior', description: 'Achieve a 7-day streak', icon: '🔥', unlocked: false },
    { id: 3, title: 'Values Champion', description: 'Complete all Values exercises', icon: '⭐', unlocked: false },
    { id: 4, title: 'Perspective Pilot', description: 'Complete the Self-as-Context journey', icon: '👁️', unlocked: false },
    { id: 5, title: 'Mindful Master', description: 'Practice 100 minutes of mindfulness', icon: '🧘', unlocked: false },
    { id: 6, title: 'ACT Expert', description: 'Complete all exercises', icon: '🏆', unlocked: false },
  ];

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const statsResponse = await axios.get('http://localhost:5000/api/progress/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.data) {
        setStats({
          totalExercises: statsResponse.data.totalExercises || 25,
          completedExercises: statsResponse.data.completedCount || 0,
          currentStreak: statsResponse.data.currentStreak || 0,
          longestStreak: statsResponse.data.longestStreak || 0,
          totalMinutes: 0, // Can be added later
        });

        if (statsResponse.data.weeklyData) {
          setWeeklyData(statsResponse.data.weeklyData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Keep initial zero state
    }
  };

  const completionRate = ((stats.completedExercises / stats.totalExercises) * 100).toFixed(0);

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

        <div className="card hover-lift bg-midnight-purple text-midnight-purple">
          <div className="flex items-center justify-between mb-2">
            <Award size={32} />
            <span className="text-4xl font-header">3/5</span>
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
              <YAxis stroke="#784A9F" style={{ fontFamily: 'Archivo' }} />
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
                <span className="text-sm font-body text-gray-700">{cat.name}</span>
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
