import { useState, useEffect } from 'react';
import { Smile, Volume2, RefreshCw } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #5 completion tracking, #20 ExerciseHeader+FavoriteButton, #45 page title

export default function SillyVoice() {
  const [thought, setThought] = useState('');
  const [currentVoice, setCurrentVoice] = useState<string | null>(null);
  const [practiced, setPracticed] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Silly Voice | ACT Therapy'; }, []);

  const voices = [
    { id: 'cartoon', name: 'Cartoon Character', style: 'font-comic', color: 'bg-brand-pink', effect: 'animate-bounce' },
    { id: 'robot', name: 'Robot', style: 'font-mono tracking-widest', color: 'bg-electric-blue', effect: 'animate-pulse' },
    { id: 'opera', name: 'Opera Singer', style: 'italic', color: 'bg-inferno-red', effect: 'animate-bounce-subtle' },
    { id: 'chipmunk', name: 'Chipmunk', style: 'text-xs', color: 'bg-lime-green', effect: 'animate-wiggle' },
    { id: 'slow', name: 'Slow Motion', style: 'tracking-wider', color: 'bg-midnight-purple', effect: 'animate-pulse-slow' },
    { id: 'backwards', name: 'Backwards', style: '', color: 'bg-electric-blue', effect: 'animate-bounce' },
  ];

  const handleTryVoice = (voiceId: string) => {
    setCurrentVoice(voiceId);
    if (!practiced.includes(voiceId)) {
      setPracticed([...practiced, voiceId]);
    }
  };

  const renderThought = (voiceId: string) => {
    if (voiceId === 'backwards') return thought.split('').reverse().join('');
    return thought;
  };

  const getVoiceStyle = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId);
    return voice ? voice.style : '';
  };

  if (completed || practiced.length === voices.length) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="silly-voice"
          exerciseName="Silly Voice Technique"
          title="Great Defusion Practice!"
          message="You practiced hearing your thought in all the silly voices. Remember: thoughts are just thoughts, not facts."
          data={{ thought, voicesPracticed: practiced.length }}
          nextExercise={{ path: '/exercises/thought-labels', name: 'Thought Labels' }}
        >
          <div className="card bg-parchment border-2 border-midnight-purple text-center">
            <p className="text-gray-700 font-body">
              You can use this technique anytime a thought feels heavy. Just imagine hearing it in a silly voice!
            </p>
            <button
              onClick={() => { setThought(''); setCurrentVoice(null); setPracticed([]); setCompleted(false); }}
              className="mt-4 btn-secondary inline-flex items-center space-x-2"
            >
              <RefreshCw size={18} />
              <span>Try Another Thought</span>
            </button>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader
        icon={<Smile size={24} className="text-white" />}
        title="Silly Voice Technique"
        subtitle="Defuse from difficult thoughts"
        exerciseId="silly-voice"
        exerciseName="Silly Voice Technique"
      />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How it Works</h3>
        <p className="text-gray-700 font-body mb-2">
          When we're fused with a thought, it feels heavy and serious. By repeating the thought in silly voices,
          we create distance from it - it's still there, but it loses its power over us.
        </p>
        <p className="text-gray-700 font-body">
          <strong>Try this:</strong> Enter a troubling thought, then "hear" it in different silly voices.
        </p>
      </div>

      <div className="card">
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          Enter a troubling thought:
        </label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="e.g., 'I'm not good enough' or 'I'll never succeed'"
          className="input-field w-full h-24 resize-none"
        />
      </div>

      {thought && currentVoice && (
        <div className="card bg-white border-2 border-midnight-purple animate-slide-in-up">
          <div className="text-center mb-4">
            <h3 className="font-subheader uppercase text-midnight-purple mb-2">
              {voices.find(v => v.id === currentVoice)?.name} Voice
            </h3>
            <div className={`text-3xl mb-4 ${getVoiceStyle(currentVoice)} ${voices.find(v => v.id === currentVoice)?.effect}`}>
              "{renderThought(currentVoice)}"
            </div>
            <p className="text-sm text-gray-600 font-body italic">
              Notice: It's the same thought, but it feels different now, doesn't it?
            </p>
          </div>
        </div>
      )}

      {thought && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {voices.map((voice, idx) => (
            <button
              key={voice.id}
              onClick={() => handleTryVoice(voice.id)}
              className={`card hover-lift text-center transition-all animate-slide-in-up ${
                currentVoice === voice.id ? 'border-2 border-midnight-purple scale-105' : ''
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-full ${voice.color} mx-auto mb-3 flex items-center justify-center ${voice.effect}`}>
                <Volume2 size={32} className="text-white" />
              </div>
              <h4 className="font-subheader uppercase text-midnight-purple text-sm mb-1">{voice.name}</h4>
              {practiced.includes(voice.id) && (
                <div className="flex items-center justify-center space-x-1 text-lime-green text-xs">
                  <span>✓</span><span>Practiced</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {practiced.length > 0 && (
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green animate-slide-in-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-subheader uppercase text-midnight-purple">Practice Progress</h3>
            <span className="text-sm font-body text-gray-600">{practiced.length} / {voices.length} voices tried</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-lime-green h-2 rounded-full transition-all duration-500" style={{ width: `${(practiced.length / voices.length) * 100}%` }}></div>
          </div>
          {practiced.length >= 3 && (
            <button onClick={() => setCompleted(true)} className="btn-primary w-full mt-2">
              Save & Complete Exercise
            </button>
          )}
        </div>
      )}
    </div>
  );
}
