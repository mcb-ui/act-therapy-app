import { useState } from 'react';
import { Anchor, AlertCircle } from 'lucide-react';

export default function TugOfWar() {
  const [struggle, setStruggle] = useState('');
  const [valuedAction, setValuedAction] = useState('');
  const [phase, setPhase] = useState<'setup' | 'pulling' | 'dropped'>('setup');
  const [pullIntensity, setPullIntensity] = useState(5);

  const handleStartPulling = () => {
    if (struggle.trim() && valuedAction.trim()) {
      setPhase('pulling');
    }
  };

  const handleDropRope = () => {
    setPhase('dropped');
  };

  if (phase === 'dropped') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-lime-green text-white text-center py-12">
          <Anchor size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">You Dropped the Rope</h1>
          <p className="text-xl opacity-90 font-body">Now you're free to move toward what matters</p>
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">The Insight</h3>
          <p className="text-gray-700 font-body mb-3">
            When you were pulling on the rope, trying to win the tug-of-war with <strong>"{struggle}"</strong>,
            all your energy went into the struggle. You couldn't move toward <strong>"{valuedAction}"</strong>
            because you were stuck in the battle.
          </p>
          <p className="text-gray-700 font-body mb-3">
            But here's the thing: <strong>You don't have to win the tug-of-war. You can drop the rope.</strong>
          </p>
          <p className="text-gray-700 font-body">
            The monster (your difficult thoughts, feelings, memories) might still be there, on the other side.
            But when you drop the rope, you're no longer in a struggle. You're free to turn around and walk
            toward what truly matters to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-inferno-red bg-opacity-10 border-2 border-inferno-red">
            <h3 className="font-subheader text-midnight-purple mb-2 uppercase">When Pulling the Rope</h3>
            <ul className="space-y-2 text-gray-700 font-body text-sm">
              <li className="flex items-start">
                <span className="text-inferno-red mr-2">•</span>
                <span>All energy goes into fighting "{struggle}"</span>
              </li>
              <li className="flex items-start">
                <span className="text-inferno-red mr-2">•</span>
                <span>Can't move toward valued actions</span>
              </li>
              <li className="flex items-start">
                <span className="text-inferno-red mr-2">•</span>
                <span>Exhausting and endless battle</span>
              </li>
              <li className="flex items-start">
                <span className="text-inferno-red mr-2">•</span>
                <span>Stuck in one place</span>
              </li>
            </ul>
          </div>

          <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
            <h3 className="font-subheader text-midnight-purple mb-2 uppercase">After Dropping the Rope</h3>
            <ul className="space-y-2 text-gray-700 font-body text-sm">
              <li className="flex items-start">
                <span className="text-lime-green mr-2">•</span>
                <span>Energy freed up for "{valuedAction}"</span>
              </li>
              <li className="flex items-start">
                <span className="text-lime-green mr-2">•</span>
                <span>Can move in valued directions</span>
              </li>
              <li className="flex items-start">
                <span className="text-lime-green mr-2">•</span>
                <span>Peace with what is</span>
              </li>
              <li className="flex items-start">
                <span className="text-lime-green mr-2">•</span>
                <span>Freedom to act on values</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="card bg-parchment border-2 border-midnight-purple">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">In Real Life</h3>
          <p className="text-gray-700 font-body mb-3">
            Dropping the rope doesn't mean you won't feel anxiety, sadness, pain, or other difficult experiences.
            The monster might still be there. But you're no longer in a wrestling match with it.
          </p>
          <p className="text-gray-700 font-body">
            <strong>This week:</strong> Notice when you're pulling on the rope with "{struggle}".
            Ask yourself: "What would it be like to drop the rope right now? What valued action could I take instead?"
          </p>
        </div>

        <button onClick={() => window.history.back()} className="btn-primary w-full">
          Complete Exercise
        </button>
      </div>
    );
  }

  if (phase === 'pulling') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
            <AlertCircle size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-header text-midnight-purple">The Tug-of-War</h1>
            <p className="text-gray-600 font-body">You're locked in battle</p>
          </div>
        </div>

        {/* Visualization */}
        <div className="card bg-white overflow-hidden relative" style={{ minHeight: '400px' }}>
          <div className="flex items-center justify-between px-8 py-12">
            {/* You */}
            <div className="text-center flex-1">
              <div className="text-6xl mb-3 animate-bounce">😰</div>
              <div className="font-header text-xl text-midnight-purple mb-2">YOU</div>
              <div className="text-sm text-gray-600 font-body">Pulling hard...</div>
              <div className="text-xs text-gray-500 mt-2 italic max-w-xs">
                "If I just fight harder, I can defeat {struggle}..."
              </div>
            </div>

            {/* Rope */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full relative">
                <div
                  className="h-4 bg-inferno-red rounded animate-pulse"
                  style={{
                    width: `${pullIntensity * 10}%`,
                    marginLeft: `${(10 - pullIntensity) * 5}%`,
                  }}
                ></div>
                <div className="text-center mt-2 text-xs text-gray-600 font-body">
                  Struggle Intensity: {pullIntensity}/10
                </div>
              </div>

              {/* Pit */}
              <div className="mt-8 text-center">
                <div className="w-32 h-24 bg-midnight-purple opacity-20 rounded-lg mb-2"></div>
                <div className="text-xs text-gray-600 font-body">Pit of Despair</div>
              </div>
            </div>

            {/* Monster */}
            <div className="text-center flex-1">
              <div className="text-6xl mb-3 animate-bounce-subtle">👹</div>
              <div className="font-header text-xl text-inferno-red mb-2">THE MONSTER</div>
              <div className="text-sm text-gray-700 font-body bg-inferno-red bg-opacity-10 p-2 rounded max-w-xs">
                "{struggle}"
              </div>
            </div>
          </div>

          {/* Struggle intensity slider */}
          <div className="px-8 pb-6">
            <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
              How hard are you pulling? (adjust to feel the struggle)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={pullIntensity}
              onChange={(e) => setPullIntensity(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Meanwhile... */}
        <div className="card bg-brand-pink bg-opacity-10 border-2 border-brand-pink">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Meanwhile... Behind You</h3>
          <p className="text-gray-700 font-body mb-2">
            While you're locked in this exhausting tug-of-war with "{struggle}", what you really care about
            is waiting behind you:
          </p>
          <div className="bg-white p-4 rounded-lg border-2 border-electric-blue">
            <div className="text-2xl text-center mb-2">🎯</div>
            <p className="text-center text-lg font-body text-midnight-purple">"{valuedAction}"</p>
          </div>
          <p className="text-gray-700 font-body mt-3 text-sm italic">
            But you can't turn around and move toward it while you're pulling on the rope...
          </p>
        </div>

        {/* Drop the rope */}
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">What If...</h3>
          <p className="text-gray-700 font-body mb-4">
            What if the solution isn't to pull harder? What if you don't have to win this tug-of-war?
          </p>
          <p className="text-gray-700 font-body mb-4">
            <strong>What if you could just... drop the rope?</strong>
          </p>
          <button onClick={handleDropRope} className="btn-primary w-full">
            Drop the Rope →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <AlertCircle size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Tug-of-War with a Monster</h1>
          <p className="text-gray-600 font-body">An ACT metaphor for acceptance</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">The Metaphor</h3>
        <p className="text-gray-700 font-body">
          Imagine you're in a tug-of-war with a monster. Between you and the monster is a pit.
          You're pulling as hard as you can, trying not to fall into the pit. The monster pulls back.
          You're stuck - can't move forward toward what you value because you're locked in this battle.
        </p>
      </div>

      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple mb-3">Set Up Your Tug-of-War</h3>

        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          What's your monster? (What are you struggling with?)
        </label>
        <input
          type="text"
          value={struggle}
          onChange={(e) => setStruggle(e.target.value)}
          placeholder="e.g., 'My anxiety', 'My depression', 'Intrusive thoughts', 'Past trauma'"
          className="input-field w-full mb-4"
        />

        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          What valued action can't you take while you're pulling?
        </label>
        <input
          type="text"
          value={valuedAction}
          onChange={(e) => setValuedAction(e.target.value)}
          placeholder="e.g., 'Connecting with my family', 'Pursuing my career', 'Living freely'"
          className="input-field w-full mb-4"
        />

        <button
          onClick={handleStartPulling}
          disabled={!struggle.trim() || !valuedAction.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start the Tug-of-War
        </button>
      </div>
    </div>
  );
}
