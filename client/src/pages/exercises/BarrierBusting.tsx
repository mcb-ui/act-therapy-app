import { useState } from 'react';
import { Shield, Zap } from 'lucide-react';
import ExerciseBackButton from '../../components/ExerciseBackButton';

export default function BarrierBusting() {
  const [valuedAction, setValuedAction] = useState('');
  const [barriers, setBarriers] = useState<Array<{ id: string; barrier: string; solution: string }>>([]);
  const [currentBarrier, setCurrentBarrier] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');

  const addBarrier = () => {
    if (currentBarrier.trim() && currentSolution.trim()) {
      setBarriers([...barriers, { id: Date.now().toString(), barrier: currentBarrier, solution: currentSolution }]);
      setCurrentBarrier('');
      setCurrentSolution('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Barrier Busting</h1>
          <p className="text-gray-600 font-body">Overcome obstacles to valued action</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <p className="text-gray-700 font-body">
          Identify barriers that might stop you from taking valued action, then create specific plans to overcome them.
          This "if-then" planning dramatically increases follow-through.
        </p>
      </div>

      <div className="card">
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          What valued action do you want to take?
        </label>
        <input
          type="text"
          value={valuedAction}
          onChange={(e) => setValuedAction(e.target.value)}
          placeholder="e.g., 'Start exercising regularly'"
          className="input-field w-full"
        />
      </div>

      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple mb-3">Identify Barriers & Solutions</h3>
        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={currentBarrier}
            onChange={(e) => setCurrentBarrier(e.target.value)}
            placeholder="Potential barrier (e.g., 'Too tired in the morning')"
            className="input-field w-full"
          />
          <input
            type="text"
            value={currentSolution}
            onChange={(e) => setCurrentSolution(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBarrier()}
            placeholder="Solution (e.g., 'Lay out workout clothes the night before')"
            className="input-field w-full"
          />
          <button
            onClick={addBarrier}
            disabled={!currentBarrier.trim() || !currentSolution.trim()}
            className="btn-secondary w-full disabled:opacity-50"
          >
            Add Barrier & Solution
          </button>
        </div>

        {barriers.length > 0 && (
          <div className="space-y-3">
            {barriers.map((b, idx) => (
              <div key={b.id} className="bg-parchment p-4 rounded-lg border-2 border-midnight-purple">
                <div className="flex items-start space-x-3 mb-2">
                  <Shield size={20} className="text-inferno-red mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-subheader uppercase text-gray-600 mb-1">Barrier {idx + 1}:</div>
                    <div className="text-gray-800 font-body">{b.barrier}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 ml-8">
                  <Zap size={20} className="text-lime-green mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-subheader uppercase text-gray-600 mb-1">Solution:</div>
                    <div className="text-gray-800 font-body">{b.solution}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {barriers.length >= 2 && (
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">If-Then Plan</h3>
          <p className="text-gray-700 font-body mb-3">
            You've identified {barriers.length} potential barriers. Now you're prepared! Studies show
            that making "if-then" plans doubles the chance of following through.
          </p>
          <p className="text-gray-700 font-body">
            <strong>Your commitment:</strong> "I will {valuedAction}. If obstacles arise, I have plans to overcome them."
          </p>
        </div>
      )}

      <ExerciseBackButton label="Back to Modules" />
    </div>
  );
}
