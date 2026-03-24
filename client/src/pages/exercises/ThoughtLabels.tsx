import { useState, useEffect } from 'react';
import { Tag, X } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #15 completion tracking, #30 ExerciseHeader+FavoriteButton, #45 page title

interface LabeledThought {
  id: string;
  thought: string;
  labels: string[];
}

const availableLabels = [
  { id: 'worry', name: 'Worry Thought', color: 'bg-electric-blue', icon: '😟' },
  { id: 'judgment', name: 'Judgment', color: 'bg-midnight-purple', icon: '⚖️' },
  { id: 'prediction', name: 'Prediction', color: 'bg-brand-pink', icon: '🔮' },
  { id: 'memory', name: 'Memory', color: 'bg-lime-green', icon: '💭' },
  { id: 'selfcriticism', name: 'Self-Criticism', color: 'bg-inferno-red', icon: '👎' },
  { id: 'comparison', name: 'Comparison', color: 'bg-electric-blue', icon: '🔄' },
  { id: 'catastrophizing', name: 'Catastrophizing', color: 'bg-inferno-red', icon: '🌪️' },
  { id: 'shouldstatement', name: 'Should Statement', color: 'bg-midnight-purple', icon: '📏' },
  { id: 'mindreading', name: 'Mind Reading', color: 'bg-brand-pink', icon: '🧠' },
  { id: 'allornone', name: 'All-or-None', color: 'bg-lime-green', icon: '⚪⚫' },
];

function getMostCommonLabel(thoughts: LabeledThought[]) {
  if (thoughts.length === 0) return null;
  const labelCounts: Record<string, number> = {};
  thoughts.forEach(t => t.labels.forEach(label => { labelCounts[label] = (labelCounts[label] || 0) + 1; }));
  const mostCommon = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0];
  return mostCommon ? availableLabels.find(l => l.id === mostCommon[0]) : null;
}

export default function ThoughtLabels() {
  const [thoughts, setThoughts] = useState<LabeledThought[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const [showLabels, setShowLabels] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Thought Labels | ACT Therapy'; }, []);

  const addThought = () => {
    if (currentThought.trim() && selectedLabels.length > 0) {
      setThoughts([{ id: Date.now().toString(), thought: currentThought, labels: selectedLabels }, ...thoughts]);
      setCurrentThought('');
      setShowLabels(false);
      setSelectedLabels([]);
    }
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]);
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="thought-labels"
          exerciseName="Thought Labels"
          title="Defusion Practice Complete!"
          message={`You labeled ${thoughts.length} thoughts. Notice how labeling creates distance - the thought becomes a "type" rather than "truth."`}
          data={{ thoughtCount: thoughts.length, labelTypesUsed: new Set(thoughts.flatMap(t => t.labels)).size }}
          nextExercise={{ path: '/exercises/thank-your-mind', name: 'Thank Your Mind' }}
        >
          <div className="card bg-parchment border-2 border-midnight-purple">
            <p className="text-gray-700 font-body">
              <strong>Key insight:</strong> You are not your thoughts. You are the one noticing and labeling them.
            </p>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Tag size={24} className="text-white" />} title="Thought Labels" subtitle="Categorize thoughts to create distance" exerciseId="thought-labels" exerciseName="Thought Labels" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How it Works</h3>
        <p className="text-gray-700 font-body">
          Instead of getting caught up in the content, try labeling what KIND of thought it is.
          This creates psychological distance - you become the observer of your thoughts.
        </p>
      </div>

      {/* Input */}
      <div className="card">
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">What thought are you having?</label>
        <textarea value={currentThought} onChange={(e) => setCurrentThought(e.target.value)} placeholder="e.g., 'I'm going to fail' or 'They think I'm weird'" className="input-field w-full h-20 resize-none mb-3" />
        {currentThought.trim() && !showLabels && (
          <button onClick={() => setShowLabels(true)} className="btn-primary w-full flex items-center justify-center space-x-2">
            <Tag size={18} /><span>Label This Thought</span>
          </button>
        )}
        {showLabels && (
          <div className="animate-slide-in-up">
            <p className="text-sm font-subheader uppercase text-gray-600 mb-3">Select all that apply:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {availableLabels.map((label) => (
                <button key={label.id} onClick={() => toggleLabel(label.id)} className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${selectedLabels.includes(label.id) ? `${label.color} text-white border-transparent` : 'bg-white border-gray-300 text-gray-700'}`}>
                  <div className="text-2xl mb-1">{label.icon}</div>
                  <div className="text-xs font-subheader uppercase">{label.name}</div>
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button onClick={addThought} disabled={selectedLabels.length === 0} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">Add Labeled Thought</button>
              <button onClick={() => { setShowLabels(false); setSelectedLabels([]); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {thoughts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center bg-electric-blue bg-opacity-10"><div className="text-3xl font-bold text-midnight-purple">{thoughts.length}</div><div className="text-xs font-subheader uppercase text-gray-600">Labeled</div></div>
          <div className="card text-center bg-lime-green bg-opacity-10"><div className="text-3xl font-bold text-midnight-purple">{new Set(thoughts.flatMap(t => t.labels)).size}</div><div className="text-xs font-subheader uppercase text-gray-600">Types Used</div></div>
          <div className="card text-center bg-brand-pink bg-opacity-10"><div className="text-3xl font-bold text-midnight-purple">{Math.round((thoughts.flatMap(t => t.labels).length / thoughts.length) * 10) / 10}</div><div className="text-xs font-subheader uppercase text-gray-600">Avg Labels</div></div>
          <div className="card text-center bg-midnight-purple bg-opacity-10"><div className="text-2xl">{getMostCommonLabel(thoughts)?.icon || '🏷️'}</div><div className="text-xs font-subheader uppercase text-gray-600">Most Common</div></div>
        </div>
      )}

      <div className="space-y-3">
        {thoughts.map((t, idx) => (
          <div key={t.id} className="card hover-lift animate-slide-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <p className="text-gray-800 font-body mb-3 italic">"{t.thought}"</p>
                <div className="flex flex-wrap gap-2">
                  {t.labels.map(labelId => { const label = availableLabels.find(l => l.id === labelId); return label ? <div key={labelId} className={`${label.color} text-white px-3 py-1 rounded-full text-xs font-subheader uppercase flex items-center space-x-1`}><span>{label.icon}</span><span>{label.name}</span></div> : null; })}
                </div>
              </div>
              <button onClick={() => setThoughts(thoughts.filter(th => th.id !== t.id))} className="p-2 text-gray-400 hover:text-inferno-red transition-all"><X size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {thoughts.length >= 3 && (
        <button onClick={() => setCompleted(true)} className="btn-primary w-full">Save & Complete Exercise</button>
      )}
    </div>
  );
}
