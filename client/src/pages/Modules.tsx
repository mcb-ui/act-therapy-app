import { Link } from 'react-router-dom';
import { BookOpen, Lock, CheckCircle, PlayCircle } from 'lucide-react';
import { useState } from 'react';

export default function Modules() {
  const [completedModules] = useState<number[]>([]); // Track completed modules

  const modules = [
    {
      id: 1,
      title: 'Foundation: Understanding ACT',
      description: 'Learn the basics of Acceptance and Commitment Therapy',
      duration: '45 mins',
      exercises: [
        { id: 'intro-act', name: 'Introduction to ACT', path: '/exercises/intro-act', completed: false },
        { id: 'values-compass', name: 'Values Compass', path: '/exercises/values-compass', completed: false },
        { id: 'life-domains', name: 'Life Domains Assessment', path: '/exercises/life-domains', completed: false },
        { id: 'hexaflex', name: 'The ACT Hexaflex', path: '/hexaflex', completed: false },
      ],
      color: 'from-electric-blue to-midnight-purple',
      icon: '📚',
    },
    {
      id: 2,
      title: 'Module 1: Present Moment Awareness',
      description: 'Develop mindfulness and stay grounded in the now',
      duration: '60 mins',
      exercises: [
        { id: 'breath-counting', name: 'Breath Counting', path: '/exercises/breath-counting', completed: false },
        { id: 'sound-awareness', name: 'Sound Awareness', path: '/exercises/sound-awareness', completed: false },
        { id: 'mindful-walking', name: 'Mindful Walking', path: '/exercises/mindful-walking', completed: false },
        { id: 'eating-meditation', name: 'Eating Meditation', path: '/exercises/eating-meditation', completed: false },
        { id: 'pmr', name: 'Progressive Muscle Relaxation', path: '/exercises/progressive-muscle-relaxation', completed: false },
      ],
      color: 'from-lime-green to-electric-blue',
      icon: '🧘',
    },
    {
      id: 3,
      title: 'Module 2: Cognitive Defusion',
      description: 'Learn to observe thoughts without being controlled',
      duration: '55 mins',
      exercises: [
        { id: 'silly-voice', name: 'Silly Voice Technique', path: '/exercises/silly-voice', completed: false },
        { id: 'thought-labels', name: 'Thought Labels', path: '/exercises/thought-labels', completed: false },
        { id: 'thank-your-mind', name: 'Thank Your Mind', path: '/exercises/thank-your-mind', completed: false },
        { id: 'leaves-stream', name: 'Leaves on a Stream', path: '/exercises/leaves-stream', completed: false },
        { id: 'passengers-on-bus', name: 'Passengers on the Bus', path: '/exercises/passengers-on-bus', completed: false },
        { id: 'clouds-in-sky', name: 'Clouds in the Sky', path: '/exercises/clouds-in-sky', completed: false },
      ],
      color: 'from-midnight-purple to-brand-pink',
      icon: '🧠',
    },
    {
      id: 4,
      title: 'Module 3: Acceptance & Willingness',
      description: 'Open up to difficult experiences with compassion',
      duration: '50 mins',
      exercises: [
        { id: 'tug-of-war', name: 'Tug of War with a Monster', path: '/exercises/tug-of-war', completed: false },
        { id: 'expansion', name: 'Expansion Exercise', path: '/exercises/expansion', completed: false },
        { id: 'willingness-scale', name: 'Willingness Scale', path: '/exercises/willingness-scale', completed: false },
        { id: 'emotional-surfing', name: 'Emotional Surfing', path: '/exercises/emotional-surfing', completed: false },
        { id: 'guest-house', name: 'The Guest House', path: '/exercises/guest-house', completed: false },
      ],
      color: 'from-brand-pink to-inferno-red',
      icon: '❤️',
    },
    {
      id: 5,
      title: 'Module 4: Values & Committed Action',
      description: 'Clarify values and take meaningful action',
      duration: '65 mins',
      exercises: [
        { id: 'what-matters', name: 'What Matters Most', path: '/exercises/what-matters', completed: false },
        { id: 'bulls-eye', name: 'Bull\'s Eye Exercise', path: '/exercises/bulls-eye', completed: false },
        { id: 'values-in-action', name: 'Values in Action', path: '/exercises/values-in-action', completed: false },
        { id: 'smart-goals', name: 'SMART Goals', path: '/exercises/smart-goals', completed: false },
        { id: 'barrier-busting', name: 'Barrier Busting', path: '/exercises/barrier-busting', completed: false },
        { id: 'values-scheduling', name: 'Values-Based Scheduling', path: '/exercises/values-based-scheduling', completed: false },
        { id: 'action-tracker', name: 'Committed Action Tracker', path: '/exercises/committed-action-tracker', completed: false },
      ],
      color: 'from-inferno-red to-lime-green',
      icon: '🎯',
    },
  ];

  const getModuleStatus = (moduleId: number) => {
    if (completedModules.includes(moduleId)) return 'completed';
    // All modules are unlocked - users can explore freely
    return 'unlocked';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-header text-midnight-purple mb-2 hover-glow">
          Learning Modules
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Structured pathways to master ACT skills
        </p>
      </div>

      {/* Progress Overview */}
      <div className="card bg-gradient-to-r from-midnight-purple to-electric-blue text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-header mb-2">Your Learning Journey</h2>
            <p className="text-white opacity-90 font-body mb-4">
              {completedModules.length} of {modules.length} modules completed
            </p>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-lime-green h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <BookOpen size={80} className="hidden md:block opacity-20" />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((module, index) => {
          const status = getModuleStatus(module.id);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';
          const completedCount = module.exercises.filter(e => e.completed).length;

          return (
            <div
              key={module.id}
              className={`card hover-lift animate-slide-in-up ${
                isLocked ? 'opacity-60' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                {/* Module Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0 shadow-lg ${
                  isLocked ? 'grayscale' : ''
                }`}>
                  {isLocked ? (
                    <Lock size={32} className="text-white" />
                  ) : isCompleted ? (
                    <CheckCircle size={32} className="text-white" />
                  ) : (
                    <span className="text-4xl">{module.icon}</span>
                  )}
                </div>

                {/* Module Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-subheader text-midnight-purple uppercase">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 font-body mt-1">{module.description}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-body whitespace-nowrap ml-4">
                      {module.duration}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-subheader text-gray-700 uppercase text-xs">
                        Progress
                      </span>
                      <span className="font-body text-gray-600">
                        {completedCount}/{module.exercises.length} exercises
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all duration-500`}
                        style={{
                          width: `${(completedCount / module.exercises.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Exercises List */}
                  <div className="space-y-2">
                    {module.exercises.map((exercise, exIndex) => (
                      <Link
                        key={exercise.id}
                        to={isLocked ? '#' : exercise.path}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          isLocked
                            ? 'cursor-not-allowed bg-gray-50'
                            : 'hover:bg-parchment hover:scale-102 cursor-pointer'
                        }`}
                        onClick={(e) => isLocked && e.preventDefault()}
                      >
                        {exercise.completed ? (
                          <CheckCircle size={20} className="text-lime-green flex-shrink-0" />
                        ) : isLocked ? (
                          <Lock size={20} className="text-gray-400 flex-shrink-0" />
                        ) : (
                          <PlayCircle size={20} className="text-electric-blue flex-shrink-0" />
                        )}
                        <span className={`font-body ${
                          exercise.completed
                            ? 'text-gray-500 line-through'
                            : isLocked
                            ? 'text-gray-400'
                            : 'text-gray-800'
                        }`}>
                          {exercise.name}
                        </span>
                        {!isLocked && !exercise.completed && (
                          <span className="text-xs text-electric-blue font-subheader uppercase ml-auto">
                            Start →
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Lock Message */}
                  {isLocked && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg border-2 border-gray-200">
                      <p className="text-sm text-gray-600 font-body flex items-center space-x-2">
                        <Lock size={16} />
                        <span>Complete the previous module to unlock this one</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      <div className="card bg-parchment border-2 border-midnight-purple text-center py-8">
        <h3 className="text-xl font-subheader text-midnight-purple mb-2 uppercase">
          🎓 Keep Going!
        </h3>
        <p className="text-gray-700 font-body max-w-2xl mx-auto">
          Complete each module in order to build a strong foundation in ACT. Take your time,
          practice regularly, and remember that progress, not perfection, is the goal.
        </p>
      </div>
    </div>
  );
}
