import { useEffect, useState } from 'react';
import { Bus, MapPin, Plus, X } from 'lucide-react';
import ExerciseBackButton from '../../components/ExerciseBackButton';

interface Passenger {
  id: string;
  name: string;
  message: string;
  color: string;
}

export default function PassengersOnBus() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [newPassenger, setNewPassenger] = useState({ name: '', message: '' });
  const [destination, setDestination] = useState('');
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState(0);

  const passengerColors = [
    'bg-electric-blue',
    'bg-brand-pink',
    'bg-midnight-purple',
    'bg-inferno-red',
    'bg-lime-green',
  ];

  const addPassenger = () => {
    if (newPassenger.name.trim() && newPassenger.message.trim()) {
      const passenger: Passenger = {
        id: Date.now().toString(),
        name: newPassenger.name,
        message: newPassenger.message,
        color: passengerColors[passengers.length % passengerColors.length],
      };
      setPassengers([...passengers, passenger]);
      setNewPassenger({ name: '', message: '' });
    }
  };

  const removePassenger = (id: string) => {
    setPassengers(passengers.filter(p => p.id !== id));
  };

  const startJourney = () => {
    setIsJourneyStarted(true);
  };

  useEffect(() => {
    if (!isJourneyStarted) {
      return;
    }

    const interval = window.setInterval(() => {
      setJourneyProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          return prev;
        }

        return prev + 1;
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [isJourneyStarted]);

  if (journeyProgress === 100) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-electric-blue text-white text-center py-12">
          <MapPin size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">You've Arrived!</h1>
          <p className="text-xl opacity-90 font-body mb-8">You reached your valued destination: {destination}</p>
        </div>

        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Key Insights</h3>
          <ul className="space-y-3 text-gray-700 font-body">
            <li className="flex items-start">
              <span className="text-lime-green mr-2 text-xl">•</span>
              <span>
                You drove the bus even with {passengers.length} difficult passenger{passengers.length !== 1 ? 's' : ''} onboard.
                They were loud, uncomfortable, but they didn't control the steering wheel.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-lime-green mr-2 text-xl">•</span>
              <span>
                You didn't have to make the passengers leave or be quiet. You let them be there while
                you focused on your valued direction.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-lime-green mr-2 text-xl">•</span>
              <span>
                In real life, difficult thoughts and feelings (your passengers) will show up. Your job
                isn't to remove them - it's to keep driving toward what matters.
              </span>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Your Passengers</h3>
          <div className="space-y-2">
            {passengers.map(p => (
              <div key={p.id} className={`${p.color} text-white p-3 rounded-lg`}>
                <div className="font-bold">{p.name}</div>
                <div className="text-sm opacity-90 italic">"{p.message}"</div>
              </div>
            ))}
          </div>
        </div>

        <ExerciseBackButton label="Complete Exercise" variant="primary" />
      </div>
    );
  }

  if (isJourneyStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-white text-center py-8">
          <Bus size={80} className="mx-auto mb-4 text-electric-blue animate-bounce-subtle" />
          <h1 className="text-3xl font-header text-midnight-purple mb-2">Driving to: {destination}</h1>
          <p className="text-gray-600 font-body">Keep driving, even with difficult passengers aboard...</p>
        </div>

        {/* Progress Bar */}
        <div className="card">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-subheader uppercase text-midnight-purple">Journey Progress</span>
            <span className="font-body text-gray-600">{journeyProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-electric-blue h-4 rounded-full transition-all duration-100"
              style={{ width: `${journeyProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Passengers Being Loud */}
        <div className="space-y-3">
          {passengers.map((p, idx) => (
            <div
              key={p.id}
              className={`card ${p.color} text-white animate-slide-in-up hover:scale-105 transition-all`}
              style={{
                animationDelay: `${idx * 0.2}s`,
                opacity: 0.8 + Math.random() * 0.2,
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">😰</div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="text-sm italic opacity-90">"{p.message}"</div>
                </div>
                <div className="text-2xl animate-pulse">🗣️</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <p className="text-gray-700 font-body italic text-center">
            "The passengers are being loud and uncomfortable, but I'm still driving toward what matters..."
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-electric-blue flex items-center justify-center">
          <Bus size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Passengers on the Bus</h1>
          <p className="text-gray-600 font-body">An ACT metaphor for defusion</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">The Metaphor</h3>
        <p className="text-gray-700 font-body mb-2">
          Imagine you're the driver of a bus, heading toward a valued destination. Your difficult thoughts
          and feelings are passengers on the bus - some are loud, critical, anxious, or angry.
        </p>
        <p className="text-gray-700 font-body">
          The passengers might yell at you to turn around or take a different route. But here's the key:
          <strong> You're the driver. You choose the direction.</strong> The passengers can be there,
          making noise, but you don't have to do what they say.
        </p>
      </div>

      {/* Set Destination */}
      <div className="card">
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block flex items-center space-x-2">
          <MapPin size={16} />
          <span>Where are you driving? (Your valued direction)</span>
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g., 'Being a caring parent' or 'Building my business'"
          className="input-field w-full"
        />
      </div>

      {/* Add Passengers */}
      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple mb-3 flex items-center space-x-2">
          <span>Your Difficult Passengers</span>
          <span className="text-xs text-gray-600 font-body normal-case">
            ({passengers.length} aboard)
          </span>
        </h3>

        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={newPassenger.name}
            onChange={(e) => setNewPassenger({ ...newPassenger, name: e.target.value })}
            placeholder="Passenger name (e.g., 'The Critic', 'Anxiety', 'Self-Doubt')"
            className="input-field w-full"
          />
          <input
            type="text"
            value={newPassenger.message}
            onChange={(e) => setNewPassenger({ ...newPassenger, message: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && addPassenger()}
            placeholder="What does this passenger say? (e.g., 'You'll fail!', 'Turn back!')"
            className="input-field w-full"
          />
          <button
            onClick={addPassenger}
            disabled={!newPassenger.name.trim() || !newPassenger.message.trim()}
            className="btn-secondary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>Add Passenger</span>
          </button>
        </div>

        {/* Passenger List */}
        {passengers.length > 0 && (
          <div className="space-y-2">
            {passengers.map((p, idx) => (
              <div
                key={p.id}
                className={`${p.color} text-white p-3 rounded-lg flex items-start space-x-3 animate-slide-in-up`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="text-2xl flex-shrink-0">😰</div>
                <div className="flex-1">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm opacity-90 italic">"{p.message}"</div>
                </div>
                <button
                  onClick={() => removePassenger(p.id)}
                  className="text-white hover:text-inferno-red transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Start Journey */}
      <button
        onClick={startJourney}
        disabled={!destination.trim() || passengers.length === 0}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <Bus size={20} />
        <span>Start Driving Toward Your Destination</span>
      </button>

      {(!destination.trim() || passengers.length === 0) && (
        <p className="text-sm text-gray-600 text-center font-body">
          {!destination.trim() ? 'Set your destination first. ' : ''}
          {passengers.length === 0 ? 'Add at least one difficult passenger.' : ''}
        </p>
      )}
    </div>
  );
}
