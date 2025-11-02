import { useState, useEffect } from 'react';
import { Ear, Play, Pause, Volume2 } from 'lucide-react';

interface Sound {
  id: string;
  description: string;
  timestamp: Date;
  distance: 'near' | 'medium' | 'far';
}

export default function SoundAwareness() {
  const [isListening, setIsListening] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [newSound, setNewSound] = useState('');

  useEffect(() => {
    if (isListening) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isListening]);

  const addSound = (distance: 'near' | 'medium' | 'far') => {
    if (newSound.trim()) {
      const sound: Sound = {
        id: Date.now().toString(),
        description: newSound,
        timestamp: new Date(),
        distance,
      };
      setSounds([sound, ...sounds]);
      setNewSound('');
    }
  };

  const minutes = Math.floor(sessionTime / 60);
  const seconds = sessionTime % 60;

  const distanceColors = {
    near: 'bg-inferno-red',
    medium: 'bg-electric-blue',
    far: 'bg-brand-pink',
  };

  const distanceLabels = {
    near: 'Close by',
    medium: 'Medium distance',
    far: 'Far away',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue to-brand-pink flex items-center justify-center">
          <Ear size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Sound Awareness</h1>
          <p className="text-gray-600 font-body">Tune into the soundscape around you</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Practice Instructions</h3>
        <p className="text-gray-700 font-body mb-2">
          Find a comfortable position, close your eyes if you'd like, and simply listen. Notice sounds without
          judging them as good or bad. You're not trying to find sounds - let them come to you.
        </p>
        <p className="text-gray-700 font-body">
          Categorize each sound you notice as near (close by), medium (some distance), or far (distant background sounds).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center bg-lime-green bg-opacity-10">
          <div className="text-3xl font-bold text-midnight-purple">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs font-subheader uppercase text-gray-600">Listening Time</div>
        </div>
        <div className="card text-center bg-electric-blue bg-opacity-10">
          <div className="text-3xl font-bold text-midnight-purple">{sounds.length}</div>
          <div className="text-xs font-subheader uppercase text-gray-600">Sounds Noticed</div>
        </div>
        <div className="card text-center bg-brand-pink bg-opacity-10">
          <div className="text-3xl">{isListening ? '👂' : '🤫'}</div>
          <div className="text-xs font-subheader uppercase text-gray-600">{isListening ? 'Listening' : 'Paused'}</div>
        </div>
        <div className="card text-center bg-parchment bg-opacity-50">
          <div className="text-3xl">
            {sounds.length === 0 ? '🔇' : sounds.length < 5 ? '🔉' : '🔊'}
          </div>
          <div className="text-xs font-subheader uppercase text-gray-600">Awareness</div>
        </div>
      </div>

      {/* Listening Control */}
      <div className="card bg-gradient-to-br from-parchment to-white border-2 border-midnight-purple">
        <div className="text-center mb-4">
          {!isListening && sounds.length === 0 && (
            <>
              <Ear size={64} className="mx-auto text-electric-blue mb-3 animate-pulse-slow" />
              <h3 className="text-2xl font-header text-midnight-purple mb-2">Ready to Listen?</h3>
              <p className="text-gray-700 font-body">Click Start to begin your sound awareness practice</p>
            </>
          )}
          {isListening && (
            <>
              <div className="relative inline-block">
                <Ear size={64} className="mx-auto text-electric-blue mb-3" />
                <div className="absolute inset-0 animate-ping">
                  <Ear size={64} className="text-electric-blue opacity-20" />
                </div>
              </div>
              <h3 className="text-2xl font-header text-midnight-purple mb-2">Listening...</h3>
              <p className="text-gray-700 font-body">Notice each sound as it arrives in your awareness</p>
            </>
          )}
        </div>

        <button
          onClick={() => setIsListening(!isListening)}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-4"
        >
          {isListening ? <Pause size={20} /> : <Play size={20} />}
          <span>{isListening ? 'Pause' : 'Start'} Listening</span>
        </button>

        {isListening && (
          <div className="animate-slide-in-up">
            <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
              What sound do you notice?
            </label>
            <input
              type="text"
              value={newSound}
              onChange={(e) => setNewSound(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newSound.trim()) {
                  addSound('medium');
                }
              }}
              placeholder="e.g., 'car passing', 'bird chirping', 'refrigerator humming'"
              className="input-field w-full mb-3"
            />
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => addSound('near')}
                disabled={!newSound.trim()}
                className="bg-inferno-red text-white py-2 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="text-sm font-subheader uppercase">Near</div>
                <div className="text-xs opacity-75">Close by</div>
              </button>
              <button
                onClick={() => addSound('medium')}
                disabled={!newSound.trim()}
                className="bg-electric-blue text-white py-2 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="text-sm font-subheader uppercase">Medium</div>
                <div className="text-xs opacity-75">Some distance</div>
              </button>
              <button
                onClick={() => addSound('far')}
                disabled={!newSound.trim()}
                className="bg-brand-pink text-white py-2 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="text-sm font-subheader uppercase">Far</div>
                <div className="text-xs opacity-75">Distant</div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sound Log */}
      {sounds.length > 0 && (
        <div className="card">
          <h3 className="font-subheader uppercase text-midnight-purple mb-3 flex items-center space-x-2">
            <Volume2 size={20} />
            <span>Sounds Noticed ({sounds.length})</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sounds.map((sound, idx) => (
              <div
                key={sound.id}
                className={`${distanceColors[sound.distance]} bg-opacity-10 border-2 border-current rounded-lg p-3 animate-slide-in-up`}
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-800 font-body">{sound.description}</p>
                  </div>
                  <div className={`${distanceColors[sound.distance]} text-white px-3 py-1 rounded-full text-xs font-subheader uppercase ml-3`}>
                    {distanceLabels[sound.distance]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Tips */}
      <div className="card bg-parchment border-2 border-midnight-purple">
        <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Tips for Deep Listening</h3>
        <ul className="space-y-2 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Don't strain to hear - let sounds come to you naturally</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Notice the spaces of silence between sounds</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Try to hear sounds as pure sensation, not immediately labeling them</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>If your mind wanders, gently return to listening</span>
          </li>
          <li className="flex items-start">
            <span className="text-electric-blue mr-2">•</span>
            <span>Practice for at least 5 minutes to settle into deep listening</span>
          </li>
        </ul>
      </div>

      {sounds.length >= 10 && (
        <div className="card bg-gradient-to-br from-electric-blue to-brand-pink text-white animate-slide-in-up">
          <h3 className="font-subheader mb-2 uppercase">Excellent Awareness! 👂</h3>
          <p className="font-body mb-3">
            You've noticed {sounds.length} sounds in {minutes} minutes and {seconds} seconds.
            Most people go through life barely noticing the rich soundscape around them.
          </p>
          <p className="font-body italic">
            This practice strengthens your ability to be present. The same quality of attention
            can be brought to thoughts, emotions, and bodily sensations.
          </p>
        </div>
      )}

      <button onClick={() => window.history.back()} className="btn-secondary w-full">
        Back to Exercises
      </button>
    </div>
  );
}
