import { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #4 completion tracking, #19 ExerciseHeader+FavoriteButton, #45 page title

export default function BreathCounting() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [sessionTime, setSessionTime] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    document.title = 'Breath Counting | ACT Therapy';
  }, []);

  useEffect(() => {
    if (isBreathing) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isBreathing]);

  const handleBreathComplete = () => {
    if (phase === 'inhale') {
      setPhase('exhale');
    } else {
      setPhase('inhale');
      const newCount = breathCount + 1;
      if (newCount === 10) {
        setBreathCount(1);
        setCycles(cycles + 1);
      } else {
        setBreathCount(newCount + 1);
      }
    }
  };

  const reset = () => {
    setBreathCount(0);
    setCycles(0);
    setPhase('inhale');
    setSessionTime(0);
    setIsBreathing(false);
  };

  const minutes = Math.floor(sessionTime / 60);
  const seconds = sessionTime % 60;
  const totalBreaths = cycles * 10 + breathCount;

  const handleComplete = () => {
    setIsBreathing(false);
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="breath-counting"
          exerciseName="Breath Counting"
          title="Mindful Practice Complete!"
          message={`You completed ${cycles} full cycles (${totalBreaths} total breaths) in ${minutes}m ${seconds}s. You're building your capacity to stay present.`}
          data={{ cycles, totalBreaths, sessionTimeSeconds: sessionTime }}
          nextExercise={{ path: '/exercises/sound-awareness', name: 'Sound Awareness' }}
        >
          <div className="card bg-parchment border-2 border-midnight-purple">
            <p className="text-gray-700 font-body italic">
              Remember: Noticing that your mind has wandered IS success. That moment of awareness is
              the practice working. Be patient and kind with yourself.
            </p>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader
        icon={<Wind size={24} className="text-white" />}
        title="Breath Counting"
        subtitle="Anchor your attention with the breath"
        exerciseId="breath-counting"
        exerciseName="Breath Counting"
      />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How to Practice</h3>
        <p className="text-gray-700 font-body">
          Count each complete breath cycle (inhale + exhale) from 1 to 10, then start again at 1.
          When your mind wanders and you lose count, gently return to 1. This practice builds concentration
          and helps you notice when attention drifts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center bg-lime-green bg-opacity-10">
          <div className="text-3xl font-bold text-midnight-purple">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs font-subheader uppercase text-gray-600">Session Time</div>
        </div>
        <div className="card text-center bg-electric-blue bg-opacity-10">
          <div className="text-3xl font-bold text-midnight-purple">{totalBreaths}</div>
          <div className="text-xs font-subheader uppercase text-gray-600">Total Breaths</div>
        </div>
        <div className="card text-center bg-brand-pink bg-opacity-10">
          <div className="text-3xl font-bold text-midnight-purple">{cycles}</div>
          <div className="text-xs font-subheader uppercase text-gray-600">Completed Cycles</div>
        </div>
        <div className="card text-center bg-midnight-purple bg-opacity-10">
          <div className="text-3xl">{isBreathing ? '🧘' : '😌'}</div>
          <div className="text-xs font-subheader uppercase text-gray-600">{isBreathing ? 'Practicing' : 'Ready'}</div>
        </div>
      </div>

      {/* Breathing Visualization */}
      <div className="card bg-white border-2 border-midnight-purple relative overflow-hidden" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-8" style={{ height: '200px' }}>
            <div
              className={`rounded-full bg-electric-blue bg-opacity-20 border-4 border-electric-blue flex items-center justify-center transition-all duration-1000 ${
                phase === 'inhale' && isBreathing ? 'w-48 h-48' : 'w-32 h-32'
              }`}
            >
              <div
                className={`rounded-full bg-electric-blue bg-opacity-40 border-2 border-electric-blue flex items-center justify-center transition-all duration-1000 ${
                  phase === 'inhale' && isBreathing ? 'w-32 h-32' : 'w-20 h-20'
                }`}
              >
                <Wind size={48} className="text-electric-blue" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-8xl font-header text-midnight-purple mb-2 animate-pulse-slow">
              {breathCount === 0 ? '-' : breathCount}
            </div>
            <div className="text-xl font-subheader uppercase text-gray-600">
              {phase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
            </div>
          </div>

          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full transition-all ${
                  num <= breathCount ? 'bg-electric-blue scale-125' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          <div className="flex justify-center space-x-3">
            <button onClick={() => setIsBreathing(!isBreathing)} className="btn-primary flex items-center space-x-2">
              {isBreathing ? <Pause size={20} /> : <Play size={20} />}
              <span>{isBreathing ? 'Pause' : 'Start'}</span>
            </button>
            <button onClick={handleBreathComplete} disabled={!isBreathing} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
              Complete Breath
            </button>
            <button onClick={reset} className="btn-secondary flex items-center space-x-2">
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase flex items-center space-x-2">
            <span>✓</span><span>When Focused</span>
          </h3>
          <ul className="space-y-1 text-gray-700 font-body text-sm">
            <li>• Count each complete breath (in + out = 1 count)</li>
            <li>• Notice the sensations of breathing</li>
            <li>• Count from 1 to 10, then start over</li>
            <li>• Stay present with each breath</li>
          </ul>
        </div>
        <div className="card bg-brand-pink bg-opacity-10 border-2 border-brand-pink">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase flex items-center space-x-2">
            <span>↻</span><span>When Mind Wanders</span>
          </h3>
          <ul className="space-y-1 text-gray-700 font-body text-sm">
            <li>• Notice you've lost count (this IS the practice!)</li>
            <li>• Don't judge yourself - this is normal</li>
            <li>• Gently return to 1</li>
            <li>• Each return strengthens your awareness</li>
          </ul>
        </div>
      </div>

      {cycles >= 3 && (
        <div className="card bg-midnight-purple text-white animate-slide-in-up">
          <h3 className="font-subheader mb-2 uppercase">Excellent Practice! 🌬️</h3>
          <p className="font-body mb-4">
            You've completed {cycles} full cycles ({totalBreaths} total breaths) in {minutes} minutes.
          </p>
          <button onClick={handleComplete} className="bg-white text-midnight-purple px-6 py-2 rounded-lg font-subheader uppercase hover:scale-105 transition-all">
            Save & Complete
          </button>
        </div>
      )}
    </div>
  );
}
