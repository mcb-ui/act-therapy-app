import { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #10 completion tracking, #25 ExerciseHeader+FavoriteButton, #45 page title

export default function EmotionalSurfing() {
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [isSurfing, setIsSurfing] = useState(false);
  const [time, setTime] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Emotional Surfing | ACT Therapy'; }, []);

  useEffect(() => {
    if (isSurfing) {
      const timer = setInterval(() => {
        setTime(t => t + 1);
        setWavePhase(p => (p + 0.1) % (Math.PI * 2));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isSurfing]);

  const waveHeight = Math.sin(wavePhase) * intensity * 5 + 50;

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="emotional-surfing"
          exerciseName="Emotional Surfing"
          title="You Rode the Wave! 🏄"
          message={`You surfed "${emotion}" for ${(time / 10).toFixed(0)} seconds. Emotions are like waves - they always come back down.`}
          data={{ emotion, intensity, durationSeconds: Math.round(time / 10) }}
          nextExercise={{ path: '/exercises/guest-house', name: 'The Guest House' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Waves size={24} className="text-white" />} title="Emotional Surfing" subtitle="Ride the wave of emotion" exerciseId="emotional-surfing" exerciseName="Emotional Surfing" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">The Wave Metaphor</h3>
        <p className="text-gray-700 font-body">
          Emotions are like waves - they rise, peak, and fall. When you surf them (riding on top, staying present), you can handle even big waves.
        </p>
      </div>

      {!isSurfing ? (
        <div className="card">
          <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">What emotion are you experiencing?</label>
          <input type="text" value={emotion} onChange={(e) => setEmotion(e.target.value)} placeholder="e.g., Anxiety, Anger, Sadness, Fear" className="input-field w-full mb-4" />
          <label className="font-subheader uppercase text-midnight-purple text-sm mb-3 block">How intense is it? (1-10)</label>
          <div className="text-center mb-3"><div className="text-4xl font-bold text-midnight-purple">{intensity}</div></div>
          <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full mb-6" />
          <button onClick={() => setIsSurfing(true)} disabled={!emotion.trim()} className="btn-primary w-full disabled:opacity-50">Start Surfing 🏄</button>
        </div>
      ) : (
        <>
          <div className="card bg-midnight-purple" style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded-lg">
              <div className="text-sm font-subheader uppercase text-gray-600">Surfing: {emotion}</div>
              <div className="text-xs text-gray-600">{(time / 10).toFixed(1)}s</div>
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <div className="text-6xl" style={{ transform: `translateY(-${waveHeight}px)`, transition: 'transform 0.1s' }}>🏄</div>
            </div>
            <svg className="absolute bottom-0 w-full" height="200" xmlns="http://www.w3.org/2000/svg">
              <path d={`M 0 ${100 - waveHeight} Q 100 ${50 - waveHeight}, 200 ${100 - waveHeight} T 400 ${100 - waveHeight} T 600 ${100 - waveHeight} T 800 ${100 - waveHeight} T 1000 ${100 - waveHeight} V 200 H 0 Z`} fill="rgba(35, 68, 231, 0.3)" />
            </svg>
          </div>

          <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
            <h3 className="font-subheader text-midnight-purple mb-3 uppercase">While Surfing...</h3>
            <ul className="space-y-2 text-gray-700 font-body">
              <li>• Notice the wave rising and falling - emotions change</li>
              <li>• Stay on top - don't dive under or run away</li>
              <li>• Breathe - you can handle this</li>
              <li>• Waves always eventually come back down</li>
            </ul>
          </div>

          <button onClick={() => { setIsSurfing(false); setCompleted(true); }} className="btn-primary w-full">
            End Session & Save
          </button>
        </>
      )}
    </div>
  );
}
