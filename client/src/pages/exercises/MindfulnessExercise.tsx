import { useState, useEffect } from 'react';
import { Zap, Play, Pause, RotateCcw } from 'lucide-react';
import axios from 'axios';

export default function MindfulnessExercise() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (activeExercise === 'breathing' && isRunning) {
      const phaseTimer = setInterval(() => {
        setBreathPhase((current) => {
          if (current === 'inhale') return 'hold';
          if (current === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);

      return () => clearInterval(phaseTimer);
    }
  }, [activeExercise, isRunning]);

  const startExercise = async (exerciseId: string) => {
    setActiveExercise(exerciseId);
    setTimer(0);
    setIsRunning(true);
  };

  const stopExercise = async () => {
    setIsRunning(false);
    if (activeExercise && timer > 10) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          '/api/progress',
          {
            exerciseId: `mindfulness-${activeExercise}`,
            completed: true,
            score: timer,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  const resetExercise = () => {
    setIsRunning(false);
    setTimer(0);
    setActiveExercise(null);
    setBreathPhase('inhale');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exercises = [
    {
      id: 'breathing',
      title: 'Mindful Breathing',
      description: 'Focus on your breath, the anchor to the present moment',
      instructions: [
        'Find a comfortable position',
        'Close your eyes or soften your gaze',
        'Notice the natural rhythm of your breath',
        'When your mind wanders, gently return to the breath',
      ],
    },
    {
      id: '5-senses',
      title: '5 Senses Grounding',
      description: 'Ground yourself in the present using your senses',
      instructions: [
        '5 things you can see',
        '4 things you can touch',
        '3 things you can hear',
        '2 things you can smell',
        '1 thing you can taste',
      ],
    },
    {
      id: 'body-scan',
      title: 'Body Scan',
      description: 'Bring awareness to different parts of your body',
      instructions: [
        'Start with your feet and gradually move up',
        'Notice sensations without trying to change them',
        'Breathe into any areas of tension',
        'Observe what you feel with curiosity, not judgment',
      ],
    },
  ];

  const currentExerciseData = exercises.find((e) => e.id === activeExercise);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <Zap size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Present Moment Awareness</h1>
          <p className="text-gray-600">Connect with the here and now</p>
        </div>
      </div>

      <div className="card bg-orange-50 border-orange-200">
        <h3 className="font-semibold text-orange-900 mb-2">Why Practice Mindfulness?</h3>
        <p className="text-orange-800">
          Mindfulness helps you engage fully with the present moment rather than getting lost
          in thoughts about the past or future. It's a foundation for psychological flexibility
          and helps you respond to life rather than react automatically.
        </p>
      </div>

      {activeExercise && currentExerciseData && (
        <div className="card bg-midnight-purple text-white">
          <h2 className="text-2xl font-bold mb-4">{currentExerciseData.title}</h2>

          {activeExercise === 'breathing' && (
            <div className="mb-6">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <div
                  className={`w-full h-full rounded-full border-8 border-white transition-all duration-4000 ${
                    breathPhase === 'inhale'
                      ? 'scale-100'
                      : breathPhase === 'hold'
                      ? 'scale-100'
                      : 'scale-75'
                  }`}
                  style={{ transitionDuration: '4000ms' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold">
                      {breathPhase === 'inhale'
                        ? 'Breathe In'
                        : breathPhase === 'hold'
                        ? 'Hold'
                        : 'Breathe Out'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">{formatTime(timer)}</div>
            <p className="text-yellow-100">Time spent in practice</p>
          </div>

          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="space-y-2">
              {currentExerciseData.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-x-4">
            {isRunning ? (
              <button
                onClick={stopExercise}
                className="flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(true)}
                className="flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50"
              >
                <Play size={20} />
                <span>Resume</span>
              </button>
            )}
            <button
              onClick={resetExercise}
              className="flex items-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30"
            >
              <RotateCcw size={20} />
              <span>End Practice</span>
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => startExercise(exercise.id)}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{exercise.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
              <button className="btn-primary w-full flex items-center justify-center space-x-2">
                <Play size={18} />
                <span>Start Practice</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Mindfulness Tips:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-orange-600 mr-2">•</span>
            <span>Start with just 2-3 minutes and gradually increase</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-600 mr-2">•</span>
            <span>Your mind will wander - that's normal and expected</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-600 mr-2">•</span>
            <span>Each time you notice wandering is a success, not a failure</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-600 mr-2">•</span>
            <span>Practice regularly - consistency matters more than duration</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
