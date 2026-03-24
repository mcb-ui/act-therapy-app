import { useState, useEffect } from 'react';
import { Anchor, AlertCircle } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #6 completion tracking, #21 ExerciseHeader+FavoriteButton, #45 page title

export default function TugOfWar() {
  const [struggle, setStruggle] = useState('');
  const [valuedAction, setValuedAction] = useState('');
  const [phase, setPhase] = useState<'setup' | 'pulling' | 'dropped'>('setup');
  const [pullIntensity, setPullIntensity] = useState(5);

  useEffect(() => { document.title = 'Tug of War | ACT Therapy'; }, []);

  const handleStartPulling = () => {
    if (struggle.trim() && valuedAction.trim()) setPhase('pulling');
  };

  const handleDropRope = () => setPhase('dropped');

  if (phase === 'dropped') {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="tug-of-war"
          exerciseName="Tug of War"
          icon={<Anchor size={80} className="mx-auto mb-6 animate-pulse-slow text-white" />}
          title="You Dropped the Rope"
          message={`Now you're free to move toward "${valuedAction}"`}
          data={{ struggle, valuedAction, pullIntensity }}
          nextExercise={{ path: '/exercises/willingness-scale', name: 'Willingness Scale' }}
        >
          <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
            <h3 className="font-subheader text-midnight-purple mb-3 uppercase">The Insight</h3>
            <p className="text-gray-700 font-body mb-3">
              When you were pulling on the rope, trying to win the tug-of-war with <strong>"{struggle}"</strong>,
              all your energy went into the struggle. You couldn't move toward <strong>"{valuedAction}"</strong>.
            </p>
            <p className="text-gray-700 font-body">
              <strong>You don't have to win the tug-of-war. You can drop the rope.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-inferno-red bg-opacity-10 border-2 border-inferno-red">
              <h3 className="font-subheader text-midnight-purple mb-2 uppercase">When Pulling</h3>
              <ul className="space-y-2 text-gray-700 font-body text-sm">
                <li className="flex items-start"><span className="text-inferno-red mr-2">•</span><span>All energy into fighting</span></li>
                <li className="flex items-start"><span className="text-inferno-red mr-2">•</span><span>Can't move toward values</span></li>
                <li className="flex items-start"><span className="text-inferno-red mr-2">•</span><span>Exhausting, endless battle</span></li>
              </ul>
            </div>
            <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
              <h3 className="font-subheader text-midnight-purple mb-2 uppercase">After Dropping</h3>
              <ul className="space-y-2 text-gray-700 font-body text-sm">
                <li className="flex items-start"><span className="text-lime-green mr-2">•</span><span>Energy freed for values</span></li>
                <li className="flex items-start"><span className="text-lime-green mr-2">•</span><span>Freedom to act</span></li>
                <li className="flex items-start"><span className="text-lime-green mr-2">•</span><span>Peace with what is</span></li>
              </ul>
            </div>
          </div>

          <div className="card bg-parchment border-2 border-midnight-purple">
            <h3 className="font-subheader text-midnight-purple mb-2 uppercase">This Week</h3>
            <p className="text-gray-700 font-body">
              Notice when you're pulling on the rope with "{struggle}".
              Ask yourself: "What would it be like to drop the rope right now?"
            </p>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  if (phase === 'pulling') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <ExerciseHeader icon={<AlertCircle size={24} className="text-white" />} title="The Tug-of-War" subtitle="You're locked in battle" exerciseId="tug-of-war" exerciseName="Tug of War" />

        <div className="card bg-white overflow-hidden relative" style={{ minHeight: '400px' }}>
          <div className="flex items-center justify-between px-8 py-12">
            <div className="text-center flex-1">
              <div className="text-6xl mb-3 animate-bounce">😰</div>
              <div className="font-header text-xl text-midnight-purple mb-2">YOU</div>
              <div className="text-sm text-gray-600 font-body">Pulling hard...</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full relative">
                <div className="h-4 bg-inferno-red rounded animate-pulse" style={{ width: `${pullIntensity * 10}%`, marginLeft: `${(10 - pullIntensity) * 5}%` }}></div>
                <div className="text-center mt-2 text-xs text-gray-600 font-body">Struggle Intensity: {pullIntensity}/10</div>
              </div>
              <div className="mt-8 text-center">
                <div className="w-32 h-24 bg-midnight-purple opacity-20 rounded-lg mb-2"></div>
                <div className="text-xs text-gray-600 font-body">Pit of Despair</div>
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="text-6xl mb-3 animate-bounce-subtle">👹</div>
              <div className="font-header text-xl text-inferno-red mb-2">THE MONSTER</div>
              <div className="text-sm text-gray-700 font-body bg-inferno-red bg-opacity-10 p-2 rounded max-w-xs">"{struggle}"</div>
            </div>
          </div>
          <div className="px-8 pb-6">
            <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">How hard are you pulling?</label>
            <input type="range" min="1" max="10" value={pullIntensity} onChange={(e) => setPullIntensity(parseInt(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="card bg-brand-pink bg-opacity-10 border-2 border-brand-pink">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Meanwhile... Behind You</h3>
          <p className="text-gray-700 font-body mb-2">While you're locked in this tug-of-war, what you really care about is waiting:</p>
          <div className="bg-white p-4 rounded-lg border-2 border-electric-blue">
            <div className="text-2xl text-center mb-2">🎯</div>
            <p className="text-center text-lg font-body text-midnight-purple">"{valuedAction}"</p>
          </div>
        </div>

        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">What If...</h3>
          <p className="text-gray-700 font-body mb-4"><strong>What if you could just... drop the rope?</strong></p>
          <button onClick={handleDropRope} className="btn-primary w-full">Drop the Rope →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<AlertCircle size={24} className="text-white" />} title="Tug-of-War with a Monster" subtitle="An ACT metaphor for acceptance" exerciseId="tug-of-war" exerciseName="Tug of War" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">The Metaphor</h3>
        <p className="text-gray-700 font-body">
          Imagine you're in a tug-of-war with a monster. Between you and the monster is a pit.
          You're pulling as hard as you can. The monster pulls back. You're stuck.
        </p>
      </div>

      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple mb-3">Set Up Your Tug-of-War</h3>
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">What's your monster?</label>
        <input type="text" value={struggle} onChange={(e) => setStruggle(e.target.value)} placeholder="e.g., 'My anxiety', 'Intrusive thoughts'" className="input-field w-full mb-4" />
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">What valued action can't you take while pulling?</label>
        <input type="text" value={valuedAction} onChange={(e) => setValuedAction(e.target.value)} placeholder="e.g., 'Connecting with family', 'Living freely'" className="input-field w-full mb-4" />
        <button onClick={handleStartPulling} disabled={!struggle.trim() || !valuedAction.trim()} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
          Start the Tug-of-War
        </button>
      </div>
    </div>
  );
}
