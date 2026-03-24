import { Link } from 'react-router-dom';
import { Target, Brain, Heart, Zap, CheckSquare, Hexagon, Sparkles, CheckCircle, Eye, Loader2, Search, Flame, Star } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { getProgress, getFavorites, getProgressStats } from '../utils/exerciseTracking';
import { useAuth } from '../contexts/AuthContext';
import FavoriteButton from '../components/FavoriteButton';

// User Improvements: #31 favorites section, #32 recently completed, #33 search/filter,
// #34 daily ACT quote, #35 streak banner, #36 category completion %

interface Value {
  name: string;
  description: string;
  example: string;
}

interface ProgressRecord {
  exerciseId: string;
  completed: boolean;
  updatedAt?: string;
}

interface FavoriteRecord {
  exerciseId: string;
  exerciseName: string;
}

const ACT_QUOTES = [
  { text: "The goal is not to feel better, but to get better at feeling.", author: "ACT Principle" },
  { text: "Pain is inevitable; suffering is optional.", author: "Haruki Murakami" },
  { text: "You can't stop the waves, but you can learn to surf.", author: "Jon Kabat-Zinn" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose.", author: "Viktor Frankl" },
  { text: "The curious paradox is that when I accept myself just as I am, then I can change.", author: "Carl Rogers" },
  { text: "What you resist, persists. What you accept, transforms.", author: "ACT Principle" },
  { text: "Life is not a problem to be solved, but an experience to be lived.", author: "Steven Hayes" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return ACT_QUOTES[dayOfYear % ACT_QUOTES.length];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [topFiveValues, setTopFiveValues] = useState<Value[]>([]);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const dailyQuote = useMemo(() => getDailyQuote(), []);

  useEffect(() => {
    document.title = 'Dashboard | ACT Therapy';

    const savedValues = localStorage.getItem('topFiveValues');
    if (savedValues) {
      try { setTopFiveValues(JSON.parse(savedValues)); } catch { /* */ }
    }

    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [progress, favs, stats] = await Promise.all([
        getProgress(),
        getFavorites(),
        getProgressStats(),
      ]);
      const completed = progress
        .filter((p: ProgressRecord) => p.completed)
        .map((p: ProgressRecord) => p.exerciseId);
      setCompletedExerciseIds(completed);
      setFavorites(favs);
      if (stats) setCurrentStreak(stats.currentStreak || 0);
    } finally {
      setLoading(false);
    }
  };

  const exerciseCategories = [
    {
      id: 'values',
      title: 'Values Clarification',
      description: 'Identify and explore what truly matters to you in life',
      icon: Target,
      color: 'bg-electric-blue',
      borderColor: '#2344E7',
      exercises: [
        { name: 'Values Duel', path: '/exercises/values-duel', description: 'Discover your top 5 core values through choices' },
        { name: 'Values Compass', path: '/exercises/values-compass', description: 'Rate 8 life directions with interactive compass' },
        { name: 'Bull\'s Eye', path: '/exercises/bulls-eye', description: 'Visualize your values alignment on a target' },
        { name: 'Life Domains', path: '/exercises/life-domains', description: 'Assess satisfaction across 10 life areas' },
        { name: 'What Matters Most', path: '/exercises/what-matters', description: 'Select and rank your core values' },
        { name: 'Values in Action', path: '/exercises/values-in-action', description: 'Connect values to concrete actions' },
      ],
    },
    {
      id: 'defusion',
      title: 'Cognitive Defusion',
      description: 'Learn to observe thoughts without being controlled by them',
      icon: Brain,
      color: 'bg-midnight-purple',
      borderColor: '#784A9F',
      exercises: [
        { name: 'Silly Voice', path: '/exercises/silly-voice', description: 'Transform thoughts with playful voices' },
        { name: 'Thought Labels', path: '/exercises/thought-labels', description: 'Categorize thoughts to create distance' },
        { name: 'Thank Your Mind', path: '/exercises/thank-your-mind', description: 'Gratitude practice for difficult thoughts' },
        { name: 'Passengers on Bus', path: '/exercises/passengers-on-bus', description: 'ACT metaphor with animated journey' },
        { name: 'Clouds in Sky', path: '/exercises/clouds-in-sky', description: 'Watch thoughts drift like clouds' },
      ],
    },
    {
      id: 'mindfulness',
      title: 'Present Moment',
      description: 'Develop awareness and connection to the here and now',
      icon: Zap,
      color: 'bg-lime-green',
      borderColor: '#93F357',
      exercises: [
        { name: 'Mindful Walking', path: '/exercises/mindful-walking', description: 'Step-by-step walking meditation' },
        { name: 'Eating Meditation', path: '/exercises/eating-meditation', description: '8-phase sensory eating practice' },
        { name: 'Sound Awareness', path: '/exercises/sound-awareness', description: 'Notice and log sounds around you' },
        { name: 'Breath Counting', path: '/exercises/breath-counting', description: 'Count breaths with animated circle' },
        { name: 'Progressive Muscle Relaxation', path: '/exercises/progressive-muscle-relaxation', description: 'Tense and release 12 muscle groups' },
      ],
    },
    {
      id: 'acceptance',
      title: 'Acceptance',
      description: 'Practice opening up to difficult emotions and experiences',
      icon: Heart,
      color: 'bg-brand-pink',
      borderColor: '#FE97BB',
      exercises: [
        { name: 'Tug of War', path: '/exercises/tug-of-war', description: 'Interactive metaphor about dropping struggle' },
        { name: 'Willingness Scale', path: '/exercises/willingness-scale', description: 'Assess willingness to feel for values' },
        { name: 'Expansion', path: '/exercises/expansion', description: '4-step process to make space for emotions' },
        { name: 'Emotional Surfing', path: '/exercises/emotional-surfing', description: 'Ride the wave of emotion' },
        { name: 'Guest House', path: '/exercises/guest-house', description: 'Welcome all emotional visitors' },
      ],
    },
    {
      id: 'self-as-context',
      title: 'Self-as-Context',
      description: 'Strengthen the observing self and flexible perspective-taking',
      icon: Eye,
      color: 'bg-electric-blue',
      borderColor: '#2344E7',
      exercises: [
        { name: 'Observer Self Journey', path: '/exercises/observer-self', description: 'Guided practice to embody the observing self' },
        { name: 'Leaves on a Stream', path: '/exercises/leaves-stream', description: 'Watch experiences float by from the observer seat' },
      ],
    },
    {
      id: 'action',
      title: 'Committed Action',
      description: 'Set goals and take steps aligned with your values',
      icon: CheckSquare,
      color: 'bg-inferno-red',
      borderColor: '#EC4625',
      exercises: [
        { name: 'SMART Goals', path: '/exercises/smart-goals', description: 'Create specific, measurable goals' },
        { name: 'Barrier Busting', path: '/exercises/barrier-busting', description: 'Plan for obstacles with if-then strategies' },
        { name: 'Values-Based Scheduling', path: '/exercises/values-based-scheduling', description: 'Schedule time for what matters' },
        { name: 'Committed Action Tracker', path: '/exercises/committed-action-tracker', description: 'Track valued actions and celebrate progress' },
        { name: 'Valued Living Questionnaire', path: '/exercises/valued-living-questionnaire', description: 'Assess importance vs. consistency' },
      ],
    },
  ];

  // User Improvement #33: Search/filter exercises
  const allExercises = exerciseCategories.flatMap(cat =>
    cat.exercises.map(ex => ({ ...ex, category: cat.title, categoryColor: cat.borderColor }))
  );
  const filteredCategories = searchQuery.trim()
    ? exerciseCategories.map(cat => ({
        ...cat,
        exercises: cat.exercises.filter(ex =>
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.exercises.length > 0)
    : exerciseCategories;

  // Favorites mapped to exercise paths
  const favoriteExercises = favorites
    .map(fav => allExercises.find(ex => ex.path.replace('/exercises/', '') === fav.exerciseId))
    .filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-electric-blue mx-auto mb-4" />
          <p className="text-gray-600 font-body">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-header text-midnight-purple mb-2 hover-glow">
          Welcome back, {user?.name || 'Friend'}!
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Continue your journey toward psychological flexibility
        </p>
      </div>

      {/* User Improvement #35: Streak banner */}
      {currentStreak > 0 && (
        <div className="card bg-inferno-red text-white animate-slide-in-up flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flame size={32} className="animate-pulse-slow" />
            <div>
              <p className="font-subheader uppercase text-sm">{currentStreak}-Day Streak!</p>
              <p className="text-white/80 text-xs font-body">Keep it going - practice daily</p>
            </div>
          </div>
          <div className="text-4xl font-header">{currentStreak}</div>
        </div>
      )}

      {/* User Improvement #34: Daily ACT quote */}
      <div className="card bg-midnight-purple text-white text-center py-6 animate-fade-in">
        <p className="text-lg md:text-xl font-header italic mb-2">"{dailyQuote.text}"</p>
        <p className="font-body text-white/70 text-sm">— {dailyQuote.author}</p>
      </div>

      {/* Top 5 Core Values Display */}
      {topFiveValues.length === 5 && (
        <div className="card bg-midnight-purple text-white hover-lift animate-slide-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-header">Your Core Values</h2>
                <p className="text-white/80 text-sm">What matters most to you</p>
              </div>
            </div>
            <Link
              to="/exercises/values-duel"
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
            >
              Retake
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topFiveValues.map((value, index) => (
              <div
                key={value.name}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white/60">#{index + 1}</span>
                  <Target size={16} className="text-lime-green group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{value.name}</h3>
                <p className="text-xs text-white/70 line-clamp-2">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card bg-midnight-purple text-white hover-lift animate-slide-in-up overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-header mb-2">ACT Hexaflex Model</h2>
            <p className="text-white mb-4 font-body opacity-90">
              Explore the six core processes of ACT
            </p>
            <Link
              to="/hexaflex"
              className="inline-flex items-center space-x-2 bg-white text-midnight-purple px-6 py-3 rounded-lg font-subheader uppercase tracking-wide hover:bg-parchment hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Hexagon size={20} />
              <span>View Hexaflex</span>
            </Link>
          </div>
          <Hexagon size={120} className="text-white opacity-20 hidden md:block animate-pulse-slow" />
        </div>
      </div>

      {/* User Improvement #31: Favorites section */}
      {favoriteExercises.length > 0 && (
        <div className="animate-slide-in-up">
          <h2 className="text-2xl font-header text-midnight-purple mb-4 flex items-center space-x-2">
            <Star size={24} className="text-inferno-red" />
            <span>Your Favorites</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteExercises.map((exercise) => exercise && (
              <Link key={exercise.path} to={exercise.path} className="card hover-lift group border-l-4 transition-all" style={{ borderLeftColor: exercise.categoryColor }}>
                <h4 className="font-subheader text-midnight-purple mb-1 uppercase text-sm group-hover:text-electric-blue transition-colors">{exercise.name}</h4>
                <p className="text-xs text-gray-600 font-body">{exercise.description}</p>
                <p className="text-xs text-gray-400 font-body mt-1">{exercise.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        {/* User Improvement #33: Search/filter bar */}
        <div className="flex items-center justify-between mb-6 animate-slide-in-up">
          <h2 className="text-2xl font-header text-midnight-purple">Interactive Exercises</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-body focus:border-electric-blue focus:outline-none transition-colors w-48 md:w-64"
            />
          </div>
        </div>
        {searchQuery && filteredCategories.length === 0 && (
          <div className="card text-center py-8 mb-6">
            <Search size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-body">No exercises match "{searchQuery}"</p>
          </div>
        )}
        <div className="space-y-8">
          {filteredCategories.map((category, catIndex) => {
            const Icon = category.icon;
            const completedCount = category.exercises.filter((ex) => {
              const exerciseId = ex.path.replace('/exercises/', '');
              return completedExerciseIds.includes(exerciseId);
            }).length;

            return (
              <div
                key={category.id}
                className="animate-slide-in-up"
                style={{ animationDelay: `${catIndex * 0.1}s` }}
              >
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-subheader text-midnight-purple uppercase">{category.title}</h3>
                      <span className="text-sm font-body text-gray-500">{completedCount}/{category.exercises.length}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-body">{category.description}</p>
                  </div>
                </div>

                {/* Exercise Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 md:ml-15">
                  {category.exercises.map((exercise, exIndex) => {
                    const exerciseId = exercise.path.replace('/exercises/', '');
                    const isCompleted = completedExerciseIds.includes(exerciseId);
                    return (
                      <div
                        key={exercise.path}
                        className="card hover-lift group bg-white border-l-4 transition-all relative"
                        style={{
                          borderLeftColor: category.borderColor,
                          animationDelay: `${(catIndex * 0.1) + (exIndex * 0.05)}s`
                        }}
                      >
                        {/* Favorite & Completed Icons */}
                        <div className="absolute top-3 right-3 flex items-center space-x-2">
                          {isCompleted && (
                            <CheckCircle size={18} className="text-lime-green" aria-label="Completed" />
                          )}
                          <div onClick={(e) => e.preventDefault()}>
                            <FavoriteButton
                              exerciseId={exerciseId}
                              exerciseName={exercise.name}
                            />
                          </div>
                        </div>

                        <Link to={exercise.path} className="block">
                          <h4 className="font-subheader text-midnight-purple mb-2 uppercase text-sm group-hover:text-electric-blue transition-colors pr-16">
                            {exercise.name}
                          </h4>
                          <p className="text-xs text-gray-600 font-body leading-relaxed">
                            {exercise.description}
                          </p>
                          <div className="mt-3 text-electric-blue font-subheader text-xs uppercase flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>{isCompleted ? 'Redo' : 'Start'}</span>
                            <span>→</span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card bg-parchment border-2 border-midnight-purple animate-slide-in-up">
        <h3 className="text-lg font-subheader text-midnight-purple mb-3 uppercase flex items-center space-x-2">
          <span className="w-2 h-2 bg-midnight-purple rounded-full"></span>
          <span>About ACT</span>
        </h3>
        <p className="text-gray-700 font-body leading-relaxed">
          Acceptance and Commitment Therapy (ACT) helps you build psychological flexibility
          through six core processes. Each exercise on this platform is designed to help you
          develop these skills and live a more valued life.
        </p>
      </div>
    </div>
  );
}
