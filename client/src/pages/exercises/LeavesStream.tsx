import { useState, useEffect } from 'react';
import { Waves, Play, Pause } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #9 completion tracking, #18 fix onKeyPress, #24 ExerciseHeader+FavoriteButton, #45 page title

export default function LeavesStream() {
  const [thought, setThought] = useState('');
  const [leaves, setLeaves] = useState<Array<{ id: number; text: string; position: number }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [nextId, setNextId] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Leaves on a Stream | ACT Therapy'; }, []);

  useEffect(() => {
    if (isRunning && leaves.length > 0) {
      const interval = setInterval(() => {
        setLeaves(prev => prev.map(leaf => ({ ...leaf, position: leaf.position + 1 })).filter(leaf => leaf.position < 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, leaves]);

  const addLeaf = () => {
    if (thought.trim()) {
      setLeaves(prev => [...prev, { id: nextId, text: thought, position: 0 }]);
      setNextId(prev => prev + 1);
      setThought('');
      setIsRunning(true);
    }
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="leaves-stream"
          exerciseName="Leaves on a Stream"
          title="Mindful Practice Complete! 🍃"
          message={`You placed ${nextId} thoughts on leaves and watched them float by.`}
          data={{ totalLeaves: nextId }}
          nextExercise={{ path: '/exercises/observer-self', name: 'Observer Self Journey' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Waves size={24} className="text-white" />} title="Leaves on a Stream" subtitle="Watch your thoughts float by" exerciseId="leaves-stream" exerciseName="Leaves on a Stream" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How it Works</h3>
        <p className="text-gray-700 font-body">
          Imagine you're sitting by a stream. Place each thought on a leaf and watch it float away.
          This helps you practice observing thoughts without getting caught up in them.
        </p>
      </div>

      <div className="card bg-midnight-purple overflow-hidden relative" style={{ height: '400px' }}>
        <div className="absolute inset-0 bg-electric-blue opacity-10 animate-pulse-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-2/3 bg-electric-blue bg-opacity-20 relative">
            {leaves.map((leaf) => (
              <div key={leaf.id} className="absolute top-1/2 -translate-y-1/2 bg-lime-green text-white px-4 py-2 rounded-full shadow-lg font-body text-sm transition-all duration-100"
                style={{ left: `${leaf.position}%`, transform: `translateY(-50%) rotate(${Math.sin(leaf.position / 10) * 10}deg)` }}>
                🍃 {leaf.text}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-midnight-purple opacity-30"></div>
        <div className="absolute top-0 left-0 right-0 h-16 bg-midnight-purple opacity-30"></div>
      </div>

      <div className="card">
        <div className="flex space-x-4">
          <input type="text" value={thought} onChange={(e) => setThought(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLeaf()} placeholder="Type a thought..." className="input-field flex-1" />
          <button onClick={addLeaf} className="btn-primary">Add to Stream</button>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button onClick={() => setIsRunning(!isRunning)} className="btn-secondary flex items-center space-x-2">
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>
          <button onClick={() => setLeaves([])} className="btn-secondary">Clear Stream</button>
        </div>
      </div>

      <div className="card bg-parchment border-2 border-midnight-purple">
        <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Practice Tips</h3>
        <ul className="space-y-2 text-gray-700 font-body">
          <li className="flex items-start"><span className="text-electric-blue mr-2">•</span><span>Don't try to stop or change the thoughts</span></li>
          <li className="flex items-start"><span className="text-electric-blue mr-2">•</span><span>Simply notice them and let them float by</span></li>
          <li className="flex items-start"><span className="text-electric-blue mr-2">•</span><span>If you get caught up, gently return to watching</span></li>
        </ul>
      </div>

      {nextId >= 5 && (
        <button onClick={() => setCompleted(true)} className="btn-primary w-full">Save & Complete Exercise</button>
      )}
    </div>
  );
}
