import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProgress } from '../utils/exerciseTracking';

// Improvement #16: Page title
// Improvement #28: Replace `any` types

interface ProgressRecord {
  exerciseId: string;
  completed: boolean;
}

export default function Modules() {
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'Learning Modules | ACT Therapy';
    fetchCompletedExercises();
  }, []);

  const fetchCompletedExercises = async () => {
    const progress = await getProgress();
    const completed = progress
      .filter((p: ProgressRecord) => p.completed)
      .map((p: ProgressRecord) => p.exerciseId);
    setCompletedExerciseIds(completed);
  };

  const modules = [
    {
      id: 1,
      title: 'Foundation: Understanding ACT',
      description: 'Learn the basics of Acceptance and Commitment Therapy',
      duration: '45 mins',
      exercises: [
        { id: 'intro-act', name: 'Introduction to ACT', path: '/exercises/intro-act' },
        { id: 'values-duel', name: 'Values Duel', path: '/exercises/values-duel' },
        { id: 'values-compass', name: 'Values Compass', path: '/exercises/values-compass' },
        { id: 'life-domains', name: 'Life Domains Assessment', path: '/exercises/life-domains' },
        { id: 'hexaflex', name: 'The ACT Hexaflex', path: '/hexaflex' },
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
        { id: 'breath-counting', name: 'Breath Counting', path: '/exercises/breath-counting' },
        { id: 'sound-awareness', name: 'Sound Awareness', path: '/exercises/sound-awareness' },
        { id: 'mindful-walking', name: 'Mindful Walking', path: '/exercises/mindful-walking' },
        { id: 'eating-meditation', name: 'Eating Meditation', path: '/exercises/eating-meditation' },
        { id: 'pmr', name: 'Progressive Muscle Relaxation', path: '/exercises/progressive-muscle-relaxation' },
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
        { id: 'silly-voice', name: 'Silly Voice Technique', path: '/exercises/silly-voice' },
        { id: 'thought-labels', name: 'Thought Labels', path: '/exercises/thought-labels' },
        { id: 'thank-your-mind', name: 'Thank Your Mind', path: '/exercises/thank-your-mind' },
        { id: 'leaves-stream', name: 'Leaves on a Stream', path: '/exercises/leaves-stream' },
        { id: 'passengers-on-bus', name: 'Passengers on the Bus', path: '/exercises/passengers-on-bus' },
        { id: 'clouds-in-sky', name: 'Clouds in the Sky', path: '/exercises/clouds-in-sky' },
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
        { id: 'tug-of-war', name: 'Tug of War with a Monster', path: '/exercises/tug-of-war' },
        { id: 'expansion', name: 'Expansion Exercise', path: '/exercises/expansion' },
        { id: 'willingness-scale', name: 'Willingness Scale', path: '/exercises/willingness-scale' },
        { id: 'emotional-surfing', name: 'Emotional Surfing', path: '/exercises/emotional-surfing' },
        { id: 'guest-house', name: 'The Guest House', path: '/exercises/guest-house' },
      ],
      color: 'from-brand-pink to-inferno-red',
      icon: '❤️',
    },
    {
      id: 5,
      title: 'Module 4: Self-as-Context & Perspective',
      description: 'Practice taking the observer stance and widening perspective',
      duration: '45 mins',
      exercises: [
        { id: 'observer-self', name: 'Observer Self Journey', path: '/exercises/observer-self' },
        { id: 'leaves-stream', name: 'Leaves on a Stream', path: '/exercises/leaves-stream' },
        { id: 'breath-counting', name: 'Observer Breath Practice', path: '/exercises/breath-counting' },
      ],
      color: 'from-electric-blue to-midnight-purple',
      icon: '👁️',
    },
    {
      id: 6,
      title: 'Module 5: Values & Committed Action',
      description: 'Clarify values and take meaningful action',
      duration: '65 mins',
      exercises: [
        { id: 'what-matters', name: 'What Matters Most', path: '/exercises/what-matters' },
        { id: 'bulls-eye', name: 'Bull\'s Eye Exercise', path: '/exercises/bulls-eye' },
        { id: 'values-in-action', name: 'Values in Action', path: '/exercises/values-in-action' },
        { id: 'smart-goals', name: 'SMART Goals', path: '/exercises/smart-goals' },
        { id: 'barrier-busting', name: 'Barrier Busting', path: '/exercises/barrier-busting' },
        { id: 'values-scheduling', name: 'Values-Based Scheduling', path: '/exercises/values-based-scheduling' },
        { id: 'action-tracker', name: 'Committed Action Tracker', path: '/exercises/committed-action-tracker' },
      ],
      color: 'from-inferno-red to-lime-green',
      icon: '🎯',
    },
  ];

  // Calculate overall progress
  const allExerciseIds = modules.flatMap((m) => m.exercises.map((e) => e.id));
  const uniqueExerciseIds = [...new Set(allExerciseIds)];
  const totalCompleted = uniqueExerciseIds.filter((id) => completedExerciseIds.includes(id)).length;
  const completedModuleCount = modules.filter((module) => {
    return module.exercises.every((e) => completedExerciseIds.includes(e.id));
  }).length;

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
      <div className="card bg-midnight-purple text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-header mb-2">Your Learning Journey</h2>
            <p className="text-white opacity-90 font-body mb-4">
              {completedModuleCount} of {modules.length} modules completed ({totalCompleted} exercises done)
            </p>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-lime-green h-3 rounded-full transition-all duration-500"
                style={{ width: `${(totalCompleted / uniqueExerciseIds.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <BookOpen size={80} className="hidden md:block opacity-20 ml-8" />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((module, index) => {
          const completedCount = module.exercises.filter((e) => completedExerciseIds.includes(e.id)).length;
          const isModuleComplete = completedCount === module.exercises.length;

          return (
            <div
              key={module.id}
              className="card hover-lift animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                {/* Module Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  {isModuleComplete ? (
                    <CheckCircle size={32} className="text-white" />
                  ) : (
                    <span className="text-4xl">{module.icon}</span>
                  )}
                </div>

                {/* Module Content */}
                <div className="flex-1 min-w-0">
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
                    {module.exercises.map((exercise) => {
                      const isExerciseCompleted = completedExerciseIds.includes(exercise.id);
                      return (
                        <Link
                          key={`${module.id}-${exercise.id}`}
                          to={exercise.path}
                          className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-parchment hover:scale-102 cursor-pointer"
                        >
                          {isExerciseCompleted ? (
                            <CheckCircle size={20} className="text-lime-green flex-shrink-0" />
                          ) : (
                            <PlayCircle size={20} className="text-electric-blue flex-shrink-0" />
                          )}
                          <span className={`font-body ${
                            isExerciseCompleted
                              ? 'text-gray-500 line-through'
                              : 'text-gray-800'
                          }`}>
                            {exercise.name}
                          </span>
                          {!isExerciseCompleted && (
                            <span className="text-xs text-electric-blue font-subheader uppercase ml-auto">
                              Start →
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
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
          Complete each module to build a strong foundation in ACT. Take your time,
          practice regularly, and remember that progress, not perfection, is the goal.
        </p>
      </div>
    </div>
  );
}
