import { useState } from 'react';
import { Smile, Volume2, RefreshCw } from 'lucide-react';

export default function SillyVoice() {
  const [thought, setThought] = useState('');
  const [currentVoice, setCurrentVoice] = useState<string | null>(null);
  const [practiced, setPracticed] = useState<string[]>([]);

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
    const voice = voices.find(v => v.id === voiceId);
    if (!voice) return thought;

    if (voiceId === 'backwards') {
      return thought.split('').reverse().join('');
    }

    return thought;
  };

  const getVoiceStyle = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId);
    return voice ? voice.style : '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <Smile size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Silly Voice Technique</h1>
          <p className="text-gray-600 font-body">Defuse from difficult thoughts</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How it Works</h3>
        <p className="text-gray-700 font-body mb-2">
          When we're fused with a thought, it feels heavy and serious. By repeating the thought in silly voices,
          we create distance from it - it's still there, but it loses its power over us.
        </p>
        <p className="text-gray-700 font-body">
          <strong>Try this:</strong> Enter a troubling thought, then "hear" it in different silly voices.
          Notice how the thought loses its grip when you defuse from it.
        </p>
      </div>

      {/* Input Section */}
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
        {thought && (
          <p className="text-xs text-gray-600 mt-2 font-body">
            Now try saying this in different silly voices below
          </p>
        )}
      </div>

      {/* Voice Display */}
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

      {/* Voice Buttons */}
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
                  <span>✓</span>
                  <span>Practiced</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Progress & Completion */}
      {practiced.length > 0 && (
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green animate-slide-in-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-subheader uppercase text-midnight-purple">Practice Progress</h3>
            <span className="text-sm font-body text-gray-600">{practiced.length} / {voices.length} voices tried</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-lime-green h-2 rounded-full transition-all duration-500"
              style={{ width: `${(practiced.length / voices.length) * 100}%` }}
            ></div>
          </div>

          {practiced.length >= 3 && (
            <div className="space-y-2">
              <p className="text-gray-700 font-body mb-2">
                <strong>Reflection:</strong> How does the thought feel now compared to when you started?
              </p>
              <ul className="space-y-1 text-gray-700 font-body text-sm ml-4">
                <li className="flex items-start">
                  <span className="text-lime-green mr-2">•</span>
                  <span>Is it still as heavy or serious?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-green mr-2">•</span>
                  <span>Can you notice the thought without getting caught up in it?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-green mr-2">•</span>
                  <span>Do you feel more distance from it?</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {practiced.length === voices.length && (
        <div className="card bg-electric-blue text-white text-center py-8 animate-slide-in-up">
          <Smile size={60} className="mx-auto mb-4" />
          <h2 className="text-2xl font-header mb-2">Great Job!</h2>
          <p className="font-body mb-4">
            You've practiced defusion with all the silly voices. Remember: thoughts are just thoughts,
            not facts. You can notice them without being controlled by them.
          </p>
          <button
            onClick={() => {
              setThought('');
              setCurrentVoice(null);
              setPracticed([]);
            }}
            className="bg-white text-electric-blue px-6 py-2 rounded-lg font-subheader uppercase hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Try Another Thought</span>
          </button>
        </div>
      )}

      <button onClick={() => window.history.back()} className="btn-secondary w-full">
        Back to Exercises
      </button>
    </div>
  );
}
