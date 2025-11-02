import { useState } from 'react';
import { Gauge } from 'lucide-react';

export default function WillingnessScale() {
  const [situation, setSituation] = useState('');
  const [difficultFeeling, setDifficultFeeling] = useState('');
  const [valuedAction, setValuedAction] = useState('');
  const [willingness, setWillingness] = useState(5);
  const [completed, setCompleted] = useState(false);

  const getWillingnessColor = (level: number) => {
    if (level <= 3) return 'bg-inferno-red';
    if (level <= 6) return 'bg-electric-blue';
    return 'bg-lime-green';
  };

  const getWillingnessLabel = (level: number) => {
    if (level <= 2) return 'Not willing at all';
    if (level <= 4) return 'Slightly willing';
    if (level <= 6) return 'Somewhat willing';
    if (level <= 8) return 'Quite willing';
    return 'Completely willing';
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-gradient-to-br from-electric-blue to-midnight-purple text-white text-center py-12">
          <Gauge size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">Willingness Assessment</h1>
          <p className="text-xl opacity-90 font-body">Understanding your willingness to feel</p>
        </div>

        <div className="card">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Your Situation</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-subheader uppercase text-gray-600 mb-1">Situation:</div>
              <div className="bg-parchment p-3 rounded-lg text-gray-800 font-body">{situation}</div>
            </div>
            <div>
              <div className="text-sm font-subheader uppercase text-gray-600 mb-1">Difficult feeling that might arise:</div>
              <div className="bg-brand-pink bg-opacity-20 p-3 rounded-lg text-gray-800 font-body">{difficultFeeling}</div>
            </div>
            <div>
              <div className="text-sm font-subheader uppercase text-gray-600 mb-1">Valued action:</div>
              <div className="bg-lime-green bg-opacity-20 p-3 rounded-lg text-gray-800 font-body">{valuedAction}</div>
            </div>
          </div>
        </div>

        <div className={`card ${getWillingnessColor(willingness)} bg-opacity-10 border-2 ${getWillingnessColor(willingness).replace('bg-', 'border-')}`}>
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Your Willingness Level</h3>
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-midnight-purple mb-2">{willingness}/10</div>
            <div className="text-xl font-body text-gray-700">{getWillingnessLabel(willingness)}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`${getWillingnessColor(willingness)} h-4 rounded-full transition-all`}
              style={{ width: `${willingness * 10}%` }}
            ></div>
          </div>
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Understanding Willingness</h3>
          <p className="text-gray-700 font-body mb-3">
            Willingness isn't about wanting to feel difficult emotions. It's about being willing to have them
            <strong> if that's what it takes</strong> to do something that matters to you.
          </p>

          {willingness < 5 && (
            <div className="bg-white p-4 rounded-lg mb-3">
              <p className="text-gray-700 font-body mb-2">
                Your low willingness ({willingness}/10) suggests you might be avoiding "{valuedAction}" to escape "{difficultFeeling}".
              </p>
              <p className="text-gray-700 font-body text-sm">
                <strong>Consider:</strong> What's the cost of avoidance? What are you missing out on by not taking this valued action?
              </p>
            </div>
          )}

          {willingness >= 5 && willingness < 8 && (
            <div className="bg-white p-4 rounded-lg mb-3">
              <p className="text-gray-700 font-body mb-2">
                Your moderate willingness ({willingness}/10) shows you're open to the possibility of moving forward even with "{difficultFeeling}".
              </p>
              <p className="text-gray-700 font-body text-sm">
                <strong>Next step:</strong> Try taking one small action toward "{valuedAction}", noticing you can handle "{difficultFeeling}" if it shows up.
              </p>
            </div>
          )}

          {willingness >= 8 && (
            <div className="bg-white p-4 rounded-lg mb-3">
              <p className="text-gray-700 font-body mb-2">
                Your high willingness ({willingness}/10) shows you're ready to move toward "{valuedAction}" even if "{difficultFeeling}" comes along for the ride.
              </p>
              <p className="text-gray-700 font-body text-sm">
                <strong>Take action:</strong> You're in a great position to move forward. What's one step you can take today?
              </p>
            </div>
          )}
        </div>

        <button onClick={() => window.history.back()} className="btn-primary w-full">
          Complete Exercise
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue to-lime-green flex items-center justify-center">
          <Gauge size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Willingness Scale</h1>
          <p className="text-gray-600 font-body">Assess your willingness to feel</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">About Willingness</h3>
        <p className="text-gray-700 font-body">
          In ACT, willingness means being open to experiencing difficult thoughts and feelings
          <strong> when doing so helps you move toward your values</strong>. It's not about wanting to feel bad -
          it's about being willing to feel bad if that's part of doing what matters.
        </p>
      </div>

      <div className="card">
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          Describe a situation you're avoiding:
        </label>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="e.g., 'Asking someone on a date' or 'Speaking up in meetings'"
          className="input-field w-full h-20 resize-none mb-4"
        />

        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          What difficult feeling might you experience?
        </label>
        <input
          type="text"
          value={difficultFeeling}
          onChange={(e) => setDifficultFeeling(e.target.value)}
          placeholder="e.g., 'Rejection', 'Embarrassment', 'Anxiety'"
          className="input-field w-full mb-4"
        />

        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          What value would this action serve?
        </label>
        <input
          type="text"
          value={valuedAction}
          onChange={(e) => setValuedAction(e.target.value)}
          placeholder="e.g., 'Building connection', 'Being authentic', 'Growing professionally'"
          className="input-field w-full mb-6"
        />

        <label className="font-subheader uppercase text-midnight-purple text-sm mb-3 block">
          How willing are you to experience "{difficultFeeling || 'this feeling'}" if it meant you could {valuedAction || 'take this action'}?
        </label>
        <div className="text-center mb-4">
          <div className="text-5xl font-bold text-midnight-purple mb-2">{willingness}</div>
          <div className="text-sm text-gray-600 font-body">{getWillingnessLabel(willingness)}</div>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={willingness}
          onChange={(e) => setWillingness(parseInt(e.target.value))}
          className="w-full mb-2"
        />
        <div className="flex justify-between text-xs text-gray-600 font-body mb-6">
          <span>Not willing at all</span>
          <span>Completely willing</span>
        </div>

        <button
          onClick={() => setCompleted(true)}
          disabled={!situation.trim() || !difficultFeeling.trim() || !valuedAction.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          View Assessment
        </button>
      </div>
    </div>
  );
}
