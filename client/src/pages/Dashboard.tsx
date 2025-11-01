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

  const exercises = [
    {
      id: 'values',
      title: 'Values Clarification',
      description: 'Identify and explore what truly matters to you in life',
      icon: Target,
      color: 'bg-electric-blue',
      path: '/exercises/values',
    },
    {
      id: 'defusion',
      title: 'Cognitive Defusion',
      description: 'Learn to observe thoughts without being controlled by them',
      icon: Brain,
      color: 'bg-midnight-purple',
      path: '/exercises/defusion',
    },
    {
      id: 'acceptance',
      title: 'Acceptance',
      description: 'Practice opening up to difficult emotions and experiences',
      icon: Heart,
      color: 'bg-brand-pink',
      path: '/exercises/acceptance',
    },
    {
      id: 'mindfulness',
      title: 'Present Moment',
      description: 'Develop awareness and connection to the here and now',
      icon: Zap,
      color: 'bg-lime-green',
      path: '/exercises/mindfulness',
    },
    {
      id: 'action',
      title: 'Committed Action',
      description: 'Set goals and take steps aligned with your values',
      icon: CheckSquare,
      color: 'bg-inferno-red',
      path: '/exercises/action',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-header text-midnight-purple mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Continue your journey toward psychological flexibility
        </p>
      </div>

      <div className="card bg-midnight-purple text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-header mb-2">ACT Hexaflex Model</h2>
            <p className="text-white mb-4 font-body">
              Explore the six core processes of ACT
            </p>
            <Link
              to="/hexaflex"
              className="inline-flex items-center space-x-2 bg-white text-midnight-purple px-6 py-3 rounded-lg font-subheader uppercase tracking-wide hover:bg-parchment transition-colors"
            >
              <Hexagon size={20} />
              <span>View Hexaflex</span>
            </Link>
          </div>
          <Hexagon size={120} className="text-white opacity-20" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-header text-midnight-purple mb-6">Interactive Exercises</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            return (
              <Link
                key={exercise.id}
                to={exercise.path}
                className="card hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className={`w-14 h-14 rounded-xl ${exercise.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-subheader text-midnight-purple mb-2 uppercase tracking-wide">
                  {exercise.title}
                </h3>
                <p className="text-gray-600 font-body">
                  {exercise.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card bg-parchment">
        <h3 className="text-lg font-subheader text-midnight-purple mb-2 uppercase">About ACT</h3>
        <p className="text-gray-700 font-body">
          Acceptance and Commitment Therapy (ACT) helps you build psychological flexibility
          through six core processes. Each exercise on this platform is designed to help you
          develop these skills and live a more valued life.
        </p>
      </div>
    </div>
  );
}
