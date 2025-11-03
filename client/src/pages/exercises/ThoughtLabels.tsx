import { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface LabeledThought {
  id: string;
  thought: string;
  labels: string[];
}

export default function ThoughtLabels() {
  const [thoughts, setThoughts] = useState<LabeledThought[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const [showLabels, setShowLabels] = useState(false);

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

  const addThought = (selectedLabels: string[]) => {
    if (currentThought.trim() && selectedLabels.length > 0) {
      const newThought: LabeledThought = {
        id: Date.now().toString(),
        thought: currentThought,
        labels: selectedLabels,
      };
      setThoughts([newThought, ...thoughts]);
      setCurrentThought('');
      setShowLabels(false);
    }
  };

  const removeThought = (id: string) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  const getLabelInfo = (labelId: string) => {
    return availableLabels.find(l => l.id === labelId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <Tag size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Thought Labels</h1>
          <p className="text-gray-600 font-body">Categorize thoughts to create distance</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How it Works</h3>
        <p className="text-gray-700 font-body">
          Instead of getting caught up in the content of your thoughts, try labeling what KIND of thought it is.
          This simple act creates psychological distance - you become the observer of your thoughts, not the thoughts themselves.
        </p>
      </div>

      {/* Input Section */}
      <ThoughtInput
        thought={currentThought}
        setThought={setCurrentThought}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        availableLabels={availableLabels}
        onAddThought={addThought}
      />

      {/* Stats */}
      {thoughts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center bg-electric-blue bg-opacity-10">
            <div className="text-3xl font-bold text-midnight-purple">{thoughts.length}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Thoughts Labeled</div>
          </div>
          <div className="card text-center bg-lime-green bg-opacity-10">
            <div className="text-3xl font-bold text-midnight-purple">
              {new Set(thoughts.flatMap(t => t.labels)).size}
            </div>
            <div className="text-xs font-subheader uppercase text-gray-600">Label Types Used</div>
          </div>
          <div className="card text-center bg-brand-pink bg-opacity-10">
            <div className="text-3xl font-bold text-midnight-purple">
              {Math.round((thoughts.flatMap(t => t.labels).length / thoughts.length) * 10) / 10}
            </div>
            <div className="text-xs font-subheader uppercase text-gray-600">Avg Labels/Thought</div>
          </div>
          <div className="card text-center bg-midnight-purple bg-opacity-10">
            <div className="text-2xl">{getMostCommonLabel(thoughts, availableLabels)?.icon || '🏷️'}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Most Common</div>
          </div>
        </div>
      )}

      {/* Labeled Thoughts */}
      <div className="space-y-3">
        {thoughts.map((t, idx) => (
          <div
            key={t.id}
            className="card hover-lift animate-slide-in-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <p className="text-gray-800 font-body mb-3 italic">"{t.thought}"</p>
                <div className="flex flex-wrap gap-2">
                  {t.labels.map(labelId => {
                    const label = getLabelInfo(labelId);
                    return label ? (
                      <div
                        key={labelId}
                        className={`${label.color} text-white px-3 py-1 rounded-full text-xs font-subheader uppercase flex items-center space-x-1`}
                      >
                        <span>{label.icon}</span>
                        <span>{label.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <button
                onClick={() => removeThought(t.id)}
                className="p-2 text-gray-400 hover:text-inferno-red transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {thoughts.length === 0 && (
        <div className="card text-center py-12 bg-parchment bg-opacity-30">
          <Tag size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-body">
            Start by entering a thought above and labeling it
          </p>
        </div>
      )}

      {thoughts.length >= 5 && (
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Reflection</h3>
          <p className="text-gray-700 font-body mb-3">
            You've labeled {thoughts.length} thoughts! Notice how this practice creates distance.
            The thought is no longer "truth" - it's just a "worry thought" or "prediction."
          </p>
          <p className="text-gray-700 font-body">
            <strong>Key insight:</strong> You are not your thoughts. You are the one noticing and labeling them.
          </p>
        </div>
      )}

      <button onClick={() => window.history.back()} className="btn-secondary w-full">
        Back to Exercises
      </button>
    </div>
  );
}

interface ThoughtInputProps {
  thought: string;
  setThought: (thought: string) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  availableLabels: Array<{ id: string; name: string; color: string; icon: string }>;
  onAddThought: (labels: string[]) => void;
}

function ThoughtInput({ thought, setThought, showLabels, setShowLabels, availableLabels, onAddThought }: ThoughtInputProps) {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const toggleLabel = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter(id => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const handleAdd = () => {
    onAddThought(selectedLabels);
    setSelectedLabels([]);
  };

  return (
    <div className="card">
      <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
        What thought are you having?
      </label>
      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder="e.g., 'I'm going to fail this test' or 'They probably think I'm weird'"
        className="input-field w-full h-20 resize-none mb-3"
      />

      {thought.trim() && !showLabels && (
        <button
          onClick={() => setShowLabels(true)}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <Tag size={18} />
          <span>Label This Thought</span>
        </button>
      )}

      {showLabels && (
        <div className="animate-slide-in-up">
          <p className="text-sm font-subheader uppercase text-gray-600 mb-3">
            What kind of thought is this? (Select all that apply)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {availableLabels.map((label) => (
              <button
                key={label.id}
                onClick={() => toggleLabel(label.id)}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedLabels.includes(label.id)
                    ? `${label.color} text-white border-transparent`
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">{label.icon}</div>
                <div className="text-xs font-subheader uppercase">{label.name}</div>
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              disabled={selectedLabels.length === 0}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Labeled Thought
            </button>
            <button
              onClick={() => {
                setShowLabels(false);
                setSelectedLabels([]);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getMostCommonLabel(
  thoughts: LabeledThought[],
  availableLabels: Array<{ id: string; name: string; color: string; icon: string }>
) {
  if (thoughts.length === 0) return null;

  const labelCounts: Record<string, number> = {};
  thoughts.forEach(t => {
    t.labels.forEach(label => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
  });

  const mostCommon = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0];
  return mostCommon ? availableLabels.find(l => l.id === mostCommon[0]) : null;
}
