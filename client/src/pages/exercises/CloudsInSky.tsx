import { useState, useEffect } from 'react';
import { Cloud, Play, Pause, Wind } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #7 completion tracking, #16 fix onKeyPress, #22 ExerciseHeader+FavoriteButton, #45 page title

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
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Clouds in the Sky | ACT Therapy'; }, []);

  useEffect(() => {
    if (isRunning && clouds.length > 0) {
      const interval = setInterval(() => {
        setClouds(prev => prev.map(cloud => ({ ...cloud, position: cloud.position + 0.5 })).filter(cloud => cloud.position < 110));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRunning, clouds.length]);

  const addCloud = () => {
    if (thought.trim()) {
      setClouds(prev => [...prev, { id: nextId, text: thought, position: -10, height: Math.random() * 60 + 10, size: Math.random() * 30 + 70 }]);
      setNextId(prev => prev + 1);
      setThought('');
      if (!isRunning) setIsRunning(true);
    }
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="clouds-in-sky"
          exerciseName="Clouds in the Sky"
          title="Beautiful Practice! 🌤️"
          message={`You released ${nextId} thoughts into the sky. Each thought, no matter how heavy, eventually drifted past.`}
          data={{ totalReleased: nextId }}
          nextExercise={{ path: '/exercises/passengers-on-bus', name: 'Passengers on the Bus' }}
        >
          <div className="card bg-parchment border-2 border-midnight-purple text-center">
            <p className="text-gray-700 font-body italic">
              "You are the sky. Everything else - it's just the weather." - Pema Chödrön
            </p>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Cloud size={24} className="text-white" />} title="Clouds in the Sky" subtitle="Watch thoughts drift by like clouds" exerciseId="clouds-in-sky" exerciseName="Clouds in the Sky" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Visualization Practice</h3>
        <p className="text-gray-700 font-body">
          Imagine you're lying on your back, looking up at the sky. Your thoughts appear as clouds,
          drifting by. Just notice them passing through the vast sky of your awareness.
        </p>
      </div>

      <div className="card bg-midnight-purple overflow-hidden relative" style={{ height: '450px' }}>
        <div className="absolute inset-0 bg-midnight-purple opacity-40"></div>
        <div className="absolute top-8 right-12 w-20 h-20 bg-parchment rounded-full opacity-80 animate-pulse-slow"></div>
        <div className="absolute top-10 right-14 w-16 h-16 bg-yellow-200 rounded-full opacity-60"></div>

        {clouds.map((cloud) => (
          <div key={cloud.id} className="absolute transition-all duration-50 ease-linear" style={{ left: `${cloud.position}%`, top: `${cloud.height}%`, fontSize: `${cloud.size}px`, opacity: cloud.position > 100 ? 0 : 1 }}>
            <div className="relative group">
              <div className="text-white filter drop-shadow-lg animate-bounce-subtle">☁️</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-lg whitespace-nowrap text-xs font-body text-midnight-purple max-w-xs overflow-hidden text-ellipsis">
                {cloud.text}
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-midnight-purple opacity-40"></div>
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

      <div className="card">
        <div className="flex space-x-3 mb-3">
          <input type="text" value={thought} onChange={(e) => setThought(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCloud()} placeholder="Type a thought to release into the sky..." className="input-field flex-1" />
          <button onClick={addCloud} disabled={!thought.trim()} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">Release</button>
        </div>
        <div className="flex justify-center space-x-3">
          <button onClick={() => setIsRunning(!isRunning)} className="btn-secondary flex items-center space-x-2">
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? 'Pause' : 'Start'} Wind</span>
          </button>
          <button onClick={() => { setClouds([]); setIsRunning(false); }} className="btn-secondary">Clear Sky</button>
        </div>
      </div>

      {nextId >= 5 && (
        <div className="card bg-electric-blue text-white animate-slide-in-up">
          <h3 className="font-subheader mb-2 uppercase">Beautiful Practice! 🌤️</h3>
          <p className="font-body mb-4">You've released {nextId} thoughts into the sky.</p>
          <button onClick={() => setCompleted(true)} className="bg-white text-electric-blue px-6 py-2 rounded-lg font-subheader uppercase hover:scale-105 transition-all">
            Save & Complete
          </button>
        </div>
      )}
    </div>
  );
}
