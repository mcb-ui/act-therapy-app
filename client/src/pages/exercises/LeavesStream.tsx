import { useState, useEffect } from 'react';
import { Waves, Play, Pause } from 'lucide-react';

export default function LeavesStream() {
  const [thought, setThought] = useState('');
  const [leaves, setLeaves] = useState<Array<{ id: number; text: string; position: number }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    if (isRunning && leaves.length > 0) {
      const interval = setInterval(() => {
        setLeaves(prev => {
          const updated = prev.map(leaf => ({
            ...leaf,
            position: leaf.position + 1
          })).filter(leaf => leaf.position < 100);
          return updated;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning, leaves]);

  const addLeaf = () => {
    if (thought.trim()) {
      setLeaves(prev => [...prev, {
        id: nextId,
        text: thought,
        position: 0
      }]);
      setNextId(prev => prev + 1);
      setThought('');
      setIsRunning(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue to-lime-green flex items-center justify-center">
          <Waves size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Leaves on a Stream</h1>
          <p className="text-gray-600 font-body">Watch your thoughts float by</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How it Works</h3>
        <p className="text-gray-700 font-body">
          Imagine you're sitting by a stream. Place each thought on a leaf and watch it float away.
          This helps you practice observing thoughts without getting caught up in them.
        </p>
      </div>

      {/* Stream Visualization */}
      <div className="card bg-gradient-to-b from-electric-blue-50 to-lime-green-50 overflow-hidden relative" style={{ height: '400px' }}>
        <div className="absolute inset-0 bg-electric-blue opacity-10 animate-pulse-slow"></div>

        {/* Stream */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-2/3 bg-electric-blue bg-opacity-20 relative">
            {leaves.map((leaf) => (
              <div
                key={leaf.id}
                className="absolute top-1/2 -translate-y-1/2 bg-lime-green text-white px-4 py-2 rounded-full shadow-lg font-body text-sm transition-all duration-100"
                style={{
                  left: `${leaf.position}%`,
                  transform: `translateY(-50%) rotate(${Math.sin(leaf.position / 10) * 10}deg)`
                }}
              >
                🍃 {leaf.text}
              </div>
            ))}
          </div>
        </div>

        {/* River banks */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-lime-green to-transparent opacity-30"></div>
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-lime-green to-transparent opacity-30"></div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex space-x-4">
          <input
            type="text"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLeaf()}
            placeholder="Type a thought..."
            className="input-field flex-1"
          />
          <button onClick={addLeaf} className="btn-primary">
            Add to Stream
          </button>
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-secondary flex items-center space-x-2"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>
          <button
            onClick={() => setLeaves([])}
            className="btn-secondary"
          >
            Clear Stream
          </button>
        </div>
      </div>

      <div className="card bg-parchment border-2 border-midnight-purple">
        <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Practice Tips</h3>
        <ul className="space-y-2 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Don't try to stop or change the thoughts</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Simply notice them and let them float by</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>If you get caught up in a thought, gently return to watching</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
