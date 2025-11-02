import { Link } from 'react-router-dom';
import { Target, Brain, Heart, Zap, CheckSquare, Hexagon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
  }, []);

  const exerciseCategories = [
    {
      id: 'values',
      title: 'Values Clarification',
      description: 'Identify and explore what truly matters to you in life',
      icon: Target,
      color: 'bg-electric-blue',
      exercises: [
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
      exercises: [
        { name: 'Tug of War', path: '/exercises/tug-of-war', description: 'Interactive metaphor about dropping struggle' },
        { name: 'Willingness Scale', path: '/exercises/willingness-scale', description: 'Assess willingness to feel for values' },
        { name: 'Expansion', path: '/exercises/expansion', description: '4-step process to make space for emotions' },
        { name: 'Emotional Surfing', path: '/exercises/emotional-surfing', description: 'Ride the wave of emotion' },
        { name: 'Guest House', path: '/exercises/guest-house', description: 'Welcome all emotional visitors' },
      ],
    },
    {
      id: 'action',
      title: 'Committed Action',
      description: 'Set goals and take steps aligned with your values',
      icon: CheckSquare,
      color: 'bg-inferno-red',
      exercises: [
        { name: 'SMART Goals', path: '/exercises/smart-goals', description: 'Create specific, measurable goals' },
        { name: 'Barrier Busting', path: '/exercises/barrier-busting', description: 'Plan for obstacles with if-then strategies' },
        { name: 'Values-Based Scheduling', path: '/exercises/values-based-scheduling', description: 'Schedule time for what matters' },
        { name: 'Committed Action Tracker', path: '/exercises/committed-action-tracker', description: 'Track valued actions and celebrate progress' },
        { name: 'Valued Living Questionnaire', path: '/exercises/valued-living-questionnaire', description: 'Assess importance vs. consistency' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-header text-midnight-purple mb-2 hover-glow">
          Welcome back, {userName}!
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Continue your journey toward psychological flexibility
        </p>
      </div>

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

      <div>
        <h2 className="text-2xl font-header text-midnight-purple mb-6 animate-slide-in-up">Interactive Exercises</h2>
        <div className="space-y-8">
          {exerciseCategories.map((category, catIndex) => {
            const Icon = category.icon;
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
                  <div>
                    <h3 className="text-xl font-subheader text-midnight-purple uppercase">{category.title}</h3>
                    <p className="text-sm text-gray-600 font-body">{category.description}</p>
                  </div>
                </div>

                {/* Exercise Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 md:ml-15">
                  {category.exercises.map((exercise, exIndex) => (
                    <Link
                      key={exercise.path}
                      to={exercise.path}
                      className="card hover-lift group bg-white border-l-4 transition-all"
                      style={{
                        borderColor: category.color.replace('bg-', ''),
                        animationDelay: `${(catIndex * 0.1) + (exIndex * 0.05)}s`
                      }}
                    >
                      <h4 className="font-subheader text-midnight-purple mb-2 uppercase text-sm group-hover:text-electric-blue transition-colors">
                        {exercise.name}
                      </h4>
                      <p className="text-xs text-gray-600 font-body leading-relaxed">
                        {exercise.description}
                      </p>
                      <div className="mt-3 text-electric-blue font-subheader text-xs uppercase flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Start</span>
                        <span>→</span>
                      </div>
                    </Link>
                  ))}
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
