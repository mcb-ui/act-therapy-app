import { useState } from 'react';
import { Target } from 'lucide-react';
import ExerciseBackButton from '../../components/ExerciseBackButton';

interface DomainRating {
  domain: string;
  importance: number;
  current: number;
  color: string;
}

export default function BullsEye() {
  const [currentDomain, setCurrentDomain] = useState(0);
  const [ratings, setRatings] = useState<DomainRating[]>([
    { domain: 'Work/Education', importance: 0, current: 0, color: 'bg-electric-blue' },
    { domain: 'Relationships', importance: 0, current: 0, color: 'bg-brand-pink' },
    { domain: 'Personal Growth', importance: 0, current: 0, color: 'bg-lime-green' },
    { domain: 'Health/Wellbeing', importance: 0, current: 0, color: 'bg-inferno-red' },
  ]);
  const [step, setStep] = useState<'importance' | 'current'>('importance');
  const [completed, setCompleted] = useState(false);

  const handleRating = (value: number) => {
    const newRatings = [...ratings];
    if (step === 'importance') {
      newRatings[currentDomain].importance = value;
      setRatings(newRatings);
      setTimeout(() => setStep('current'), 300);
    } else {
      newRatings[currentDomain].current = value;
      setRatings(newRatings);

      if (currentDomain < ratings.length - 1) {
        setTimeout(() => {
          setCurrentDomain(currentDomain + 1);
          setStep('importance');
        }, 300);
      } else {
        setTimeout(() => setCompleted(true), 300);
      }
    }
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-electric-blue text-white text-center py-12">
          <Target size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">Your Bull's Eye</h1>
          <p className="text-xl opacity-90 font-body mb-8">See how close you are to living your values</p>
        </div>

        {/* Interactive Bullseye Visualization */}
        <div className="card bg-parchment relative" style={{ height: '500px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Concentric circles */}
            {[1, 2, 3, 4, 5].reverse().map((ring) => (
              <div
                key={ring}
                className="absolute rounded-full border-4 border-midnight-purple opacity-20"
                style={{
                  width: `${ring * 20}%`,
                  height: `${ring * 20}%`,
                }}
              ></div>
            ))}

            {/* Center bullseye */}
            <div className="absolute w-4 h-4 rounded-full bg-midnight-purple animate-pulse"></div>

            {/* Plot points */}
            {ratings.map((rating, idx) => {
              const angle = (idx * Math.PI * 2) / ratings.length - Math.PI / 2;
              const distance = ((6 - rating.current) / 5) * 45; // 0-50% radius
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <div
                  key={idx}
                  className={`absolute ${rating.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-xl hover:scale-125 transition-all animate-bounce-subtle cursor-pointer`}
                  style={{
                    left: `calc(50% + ${x}%)`,
                    top: `calc(50% + ${y}%)`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${idx * 0.2}s`,
                  }}
                  title={`${rating.domain}: ${rating.current}/5`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend and Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ratings.map((rating, idx) => {
            const gap = rating.importance - rating.current;
            return (
              <div key={idx} className="card hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${rating.color} text-white flex items-center justify-center font-bold text-sm`}>
                      {idx + 1}
                    </div>
                    <span className="font-subheader uppercase text-midnight-purple">{rating.domain}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-body">Importance:</span>
                    <span className="font-bold text-midnight-purple">{rating.importance}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-body">Current Living:</span>
                    <span className="font-bold text-midnight-purple">{rating.current}/5</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600 font-body">Gap:</span>
                    <span className={`font-bold ${gap > 2 ? 'text-inferno-red' : gap > 1 ? 'text-electric-blue' : 'text-lime-green'}`}>
                      {gap > 0 ? `${gap} point${gap > 1 ? 's' : ''}` : 'Aligned ✓'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Reflection</h3>
          <p className="text-gray-700 font-body mb-3">
            The closer your points are to the center, the more aligned your actions are with your values.
            Points further from the center indicate areas where you might want to focus more attention.
          </p>
          <p className="text-gray-700 font-body">
            <strong>Next step:</strong> Choose one domain with the largest gap and identify one small action you could take this week to move closer to the bullseye.
          </p>
        </div>

        <ExerciseBackButton label="Complete Exercise" variant="primary" />
      </div>
    );
  }

  const current = ratings[currentDomain];
  const question = step === 'importance'
    ? `How important is ${current.domain} to you?`
    : `How well are you currently living this value?`;
  const subtext = step === 'importance'
    ? 'Rate how much this area matters in your life'
    : 'Rate how closely your actions align with this value';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-electric-blue flex items-center justify-center">
          <Target size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Bull's Eye Exercise</h1>
          <p className="text-gray-600 font-body">Plot your values alignment</p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-subheader uppercase text-midnight-purple">Progress</span>
          <span className="font-body text-gray-600">
            {currentDomain + 1} / {ratings.length} - {step === 'importance' ? 'Importance' : 'Current Living'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-electric-blue h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentDomain + (step === 'current' ? 0.5 : 0)) / ratings.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      <div className="card bg-midnight-purple border-2 border-midnight-purple animate-slide-in-up">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full ${current.color} mx-auto mb-4 flex items-center justify-center shadow-xl animate-bounce-subtle`}>
            <Target size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-header text-midnight-purple mb-2">{current.domain}</h2>
          <p className="text-lg text-gray-700 font-body mb-1">{question}</p>
          <p className="text-sm text-gray-600 font-body">{subtext}</p>
        </div>

        <div className="space-y-4">
          <p className="text-center font-subheader uppercase text-sm text-gray-600">
            {step === 'importance' ? '1 (Not Important) to 5 (Extremely Important)' : '1 (Not at all) to 5 (Completely Aligned)'}
          </p>
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleRating(num)}
                className={`${current.color} text-white font-bold py-6 rounded-lg hover:scale-110 hover:shadow-lg transition-all active:scale-95 text-2xl`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
