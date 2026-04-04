import { useState, useEffect } from 'react';
import { Cloud, Play, Pause, Wind } from 'lucide-react';
import ExerciseBackButton from '../../components/ExerciseBackButton';

interface CloudThought {
  id: number;
  text: string;
  position: number;
  height: number;
  size: number;
}

export default function CloudsInSky() {
  const [thought, setThought] = useState('');
  const [clouds, setClouds] = useState<CloudThought[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    if (isRunning && clouds.length > 0) {
      const interval = setInterval(() => {
        setClouds(prev => {
          const updated = prev.map(cloud => ({
            ...cloud,
            position: cloud.position + 0.5
          })).filter(cloud => cloud.position < 110);
          return updated;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isRunning, clouds.length]);

  const addCloud = () => {
    if (thought.trim()) {
      const newCloud: CloudThought = {
        id: nextId,
        text: thought,
        position: -10,
        height: Math.random() * 60 + 10, // 10-70%
        size: Math.random() * 30 + 70, // 70-100 pixels
      };
      setClouds(prev => [...prev, newCloud]);
      setNextId(prev => prev + 1);
      setThought('');
      if (!isRunning) setIsRunning(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <Cloud size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Clouds in the Sky</h1>
          <p className="text-gray-600 font-body">Watch thoughts drift by like clouds</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Visualization Practice</h3>
        <p className="text-gray-700 font-body">
          Imagine you're lying on your back, looking up at the sky. Your thoughts appear as clouds,
          drifting by. You don't have to push them away or hold onto them - just notice them passing through the vast sky of your awareness.
        </p>
      </div>

      {/* Sky Visualization */}
      <div className="card bg-midnight-purple overflow-hidden relative" style={{ height: '450px' }}>
        {/* Sky background effects */}
        <div className="absolute inset-0 bg-midnight-purple opacity-40"></div>

        {/* Sun */}
        <div className="absolute top-8 right-12 w-20 h-20 bg-parchment rounded-full opacity-80 animate-pulse-slow"></div>
        <div className="absolute top-10 right-14 w-16 h-16 bg-yellow-200 rounded-full opacity-60"></div>

        {/* Clouds */}
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute transition-all duration-50 ease-linear"
            style={{
              left: `${cloud.position}%`,
              top: `${cloud.height}%`,
              fontSize: `${cloud.size}px`,
              opacity: cloud.position > 100 ? 0 : 1,
            }}
          >
            <div className="relative group">
              {/* Cloud emoji */}
              <div className="text-white filter drop-shadow-lg animate-bounce-subtle">
                ☁️
              </div>
              {/* Thought text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-lg whitespace-nowrap text-xs font-body text-midnight-purple max-w-xs overflow-hidden text-ellipsis">
                {cloud.text}
              </div>
            </div>
          </div>
        ))}

        {/* Ground/horizon */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-midnight-purple opacity-40"></div>

        {/* Wind indicator */}
        {isRunning && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white bg-opacity-60 px-3 py-2 rounded-lg animate-pulse">
            <Wind size={16} className="text-electric-blue" />
            <span className="text-xs font-body text-gray-700">Wind blowing...</span>
          </div>
        )}

        {clouds.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white bg-opacity-80 p-6 rounded-lg">
              <Cloud size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 font-body">The sky is clear...</p>
              <p className="text-sm text-gray-500 font-body">Add thoughts to watch them drift by</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex space-x-3 mb-3">
          <input
            type="text"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCloud()}
            placeholder="Type a thought to release into the sky..."
            className="input-field flex-1"
          />
          <button
            onClick={addCloud}
            disabled={!thought.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Release
          </button>
        </div>

        <div className="flex justify-center space-x-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-secondary flex items-center space-x-2"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? 'Pause' : 'Start'} Wind</span>
          </button>
          <button
            onClick={() => {
              setClouds([]);
              setIsRunning(false);
            }}
            className="btn-secondary"
          >
            Clear Sky
          </button>
        </div>
      </div>

      {/* Stats */}
      {clouds.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center bg-electric-blue bg-opacity-10">
            <div className="text-3xl font-bold text-midnight-purple">{clouds.length}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Clouds in Sky</div>
          </div>
          <div className="card text-center bg-parchment bg-opacity-30">
            <div className="text-3xl font-bold text-midnight-purple">{nextId}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Total Released</div>
          </div>
          <div className="card text-center bg-lime-green bg-opacity-10">
            <div className="text-3xl">{isRunning ? '🌬️' : '😌'}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">{isRunning ? 'Flowing' : 'Still'}</div>
          </div>
        </div>
      )}

      {/* Practice Tips */}
      <div className="card bg-parchment border-2 border-midnight-purple">
        <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Practice Tips</h3>
        <ul className="space-y-2 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Notice thoughts without judging them as good or bad</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>You are not the clouds - you are the vast sky in which they appear</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Some clouds are dark and heavy, others light - all pass by eventually</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>If you get caught up in a cloud, gently return to watching</span>
          </li>
        </ul>
      </div>

      {nextId >= 10 && (
        <div className="card bg-electric-blue text-white animate-slide-in-up">
          <h3 className="font-subheader mb-2 uppercase">Beautiful Practice! 🌤️</h3>
          <p className="font-body mb-3">
            You've released {nextId} thoughts into the sky. Notice how each thought, no matter how heavy it felt,
            eventually drifted past. The sky (your awareness) remains vast and unchanged.
          </p>
          <p className="font-body italic">
            "You are the sky. Everything else - it's just the weather." - Pema Chödrön
          </p>
        </div>
      )}

      <ExerciseBackButton label="Back to Modules" />
    </div>
  );
}
