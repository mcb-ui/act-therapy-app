import { useState } from 'react';
import { Compass, ChevronRight } from 'lucide-react';

export default function ValuesCompass() {
  const [currentDirection, setCurrentDirection] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  const directions = [
    { id: 'north', label: 'Family', angle: 0, color: 'bg-electric-blue', question: 'How important is family in your life?' },
    { id: 'northeast', label: 'Relationships', angle: 45, color: 'bg-brand-pink', question: 'How much do friendships matter to you?' },
    { id: 'east', label: 'Career', angle: 90, color: 'bg-midnight-purple', question: 'How important is your work/career?' },
    { id: 'southeast', label: 'Personal Growth', angle: 135, color: 'bg-lime-green', question: 'How much do you value learning and growth?' },
    { id: 'south', label: 'Health', angle: 180, color: 'bg-inferno-red', question: 'How important is physical/mental health?' },
    { id: 'southwest', label: 'Leisure', angle: 225, color: 'bg-parchment', question: 'How much do you value fun and recreation?' },
    { id: 'west', label: 'Community', angle: 270, color: 'bg-electric-blue', question: 'How important is giving back/community?' },
    { id: 'northwest', label: 'Spirituality', angle: 315, color: 'bg-midnight-purple', question: 'How much does spirituality/meaning matter?' },
  ];

  const handleRating = (value: number) => {
    const direction = directions[currentDirection];
    setRatings({ ...ratings, [direction.id]: value });

    if (currentDirection < directions.length - 1) {
      setTimeout(() => setCurrentDirection(currentDirection + 1), 300);
    } else {
      setTimeout(() => setCompleted(true), 300);
    }
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-gradient-to-br from-electric-blue to-midnight-purple text-white text-center py-12">
          <Compass size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">Your Values Compass</h1>
          <p className="text-xl opacity-90 font-body mb-8">Here's your complete values map</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {directions.map((dir) => (
            <div key={dir.id} className="card hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${dir.color}`}></div>
                  <span className="font-subheader uppercase text-midnight-purple">{dir.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${dir.color} h-2 rounded-full transition-all`}
                      style={{ width: `${(ratings[dir.id] || 0) * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-midnight-purple w-8">{ratings[dir.id]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => window.history.back()} className="btn-primary w-full">
          Complete Exercise
        </button>
      </div>
    );
  }

  const current = directions[currentDirection];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue to-midnight-purple flex items-center justify-center">
          <Compass size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Values Compass</h1>
          <p className="text-gray-600 font-body">Navigate your life directions</p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-subheader uppercase text-midnight-purple">Progress</span>
          <span className="font-body text-gray-600">{currentDirection + 1} / {directions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-electric-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentDirection + 1) / directions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-white to-parchment-50 border-2 border-midnight-purple animate-slide-in-up">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full ${current.color} mx-auto mb-4 flex items-center justify-center shadow-xl animate-bounce-subtle`}>
            <Compass size={48} className="text-white" style={{ transform: `rotate(${current.angle}deg)` }} />
          </div>
          <h2 className="text-3xl font-header text-midnight-purple mb-2">{current.label}</h2>
          <p className="text-lg text-gray-700 font-body">{current.question}</p>
        </div>

        <div className="space-y-4">
          <p className="text-center font-subheader uppercase text-sm text-gray-600">Rate from 1 (Not Important) to 10 (Extremely Important)</p>
          <div className="grid grid-cols-10 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => handleRating(num)}
                className={`${current.color} text-white font-bold py-4 rounded-lg hover:scale-110 hover:shadow-lg transition-all active:scale-95`}
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
