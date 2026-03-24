import { useState, useEffect } from 'react';
import { Gauge } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #14 completion tracking, #29 ExerciseHeader+FavoriteButton, #45 page title

export default function WillingnessScale() {
  const [situation, setSituation] = useState('');
  const [difficultFeeling, setDifficultFeeling] = useState('');
  const [valuedAction, setValuedAction] = useState('');
  const [willingness, setWillingness] = useState(5);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Willingness Scale | ACT Therapy'; }, []);

  const getWillingnessColor = (level: number) => { if (level <= 3) return 'bg-inferno-red'; if (level <= 6) return 'bg-electric-blue'; return 'bg-lime-green'; };
  const getWillingnessLabel = (level: number) => { if (level <= 2) return 'Not willing at all'; if (level <= 4) return 'Slightly willing'; if (level <= 6) return 'Somewhat willing'; if (level <= 8) return 'Quite willing'; return 'Completely willing'; };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="willingness-scale"
          exerciseName="Willingness Scale"
          icon={<Gauge size={80} className="mx-auto mb-6 animate-pulse-slow text-white" />}
          title="Willingness Assessment"
          message="Understanding your willingness to feel"
          data={{ situation, difficultFeeling, valuedAction, willingness }}
          nextExercise={{ path: '/exercises/tug-of-war', name: 'Tug of War' }}
        >
          <div className="card">
            <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Your Situation</h3>
            <div className="space-y-4">
              <div><div className="text-sm font-subheader uppercase text-gray-600 mb-1">Situation:</div><div className="bg-parchment p-3 rounded-lg text-gray-800 font-body">{situation}</div></div>
              <div><div className="text-sm font-subheader uppercase text-gray-600 mb-1">Difficult feeling:</div><div className="bg-brand-pink bg-opacity-20 p-3 rounded-lg text-gray-800 font-body">{difficultFeeling}</div></div>
              <div><div className="text-sm font-subheader uppercase text-gray-600 mb-1">Valued action:</div><div className="bg-lime-green bg-opacity-20 p-3 rounded-lg text-gray-800 font-body">{valuedAction}</div></div>
            </div>
          </div>

          <div className={`card ${getWillingnessColor(willingness)} bg-opacity-10 border-2 ${getWillingnessColor(willingness).replace('bg-', 'border-')}`}>
            <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Your Willingness Level</h3>
            <div className="text-center mb-4">
              <div className="text-6xl font-bold text-midnight-purple mb-2">{willingness}/10</div>
              <div className="text-xl font-body text-gray-700">{getWillingnessLabel(willingness)}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className={`${getWillingnessColor(willingness)} h-4 rounded-full transition-all`} style={{ width: `${willingness * 10}%` }}></div>
            </div>
          </div>

          <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
            <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Understanding Willingness</h3>
            <p className="text-gray-700 font-body">
              Willingness isn't about wanting to feel difficult emotions. It's about being willing to have them
              <strong> if that's what it takes</strong> to do something that matters to you.
            </p>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Gauge size={24} className="text-white" />} title="Willingness Scale" subtitle="Assess your willingness to feel" exerciseId="willingness-scale" exerciseName="Willingness Scale" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">About Willingness</h3>
        <p className="text-gray-700 font-body">
          In ACT, willingness means being open to experiencing difficult thoughts and feelings
          <strong> when doing so helps you move toward your values</strong>.
        </p>
      </div>

      <div className="card">
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">Describe a situation you're avoiding:</label>
        <textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="e.g., 'Asking someone on a date'" className="input-field w-full h-20 resize-none mb-4" />
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">What difficult feeling might you experience?</label>
        <input type="text" value={difficultFeeling} onChange={(e) => setDifficultFeeling(e.target.value)} placeholder="e.g., 'Rejection', 'Embarrassment'" className="input-field w-full mb-4" />
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">What value would this action serve?</label>
        <input type="text" value={valuedAction} onChange={(e) => setValuedAction(e.target.value)} placeholder="e.g., 'Building connection'" className="input-field w-full mb-6" />
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-3 block">
          How willing are you to experience "{difficultFeeling || 'this feeling'}" if it meant you could {valuedAction || 'take this action'}?
        </label>
        <div className="text-center mb-4">
          <div className="text-5xl font-bold text-midnight-purple mb-2">{willingness}</div>
          <div className="text-sm text-gray-600 font-body">{getWillingnessLabel(willingness)}</div>
        </div>
        <input type="range" min="0" max="10" value={willingness} onChange={(e) => setWillingness(parseInt(e.target.value))} className="w-full mb-2" />
        <div className="flex justify-between text-xs text-gray-600 font-body mb-6">
          <span>Not willing at all</span><span>Completely willing</span>
        </div>
        <button onClick={() => setCompleted(true)} disabled={!situation.trim() || !difficultFeeling.trim() || !valuedAction.trim()} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
          View Assessment
        </button>
      </div>
    </div>
  );
}
