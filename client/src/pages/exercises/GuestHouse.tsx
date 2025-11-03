import { useState } from 'react';
import { Home, Plus } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  message: string;
}

export default function GuestHouse() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState({ name: '', message: '' });

  const addGuest = () => {
    if (newGuest.name.trim()) {
      setGuests([...guests, { id: Date.now().toString(), ...newGuest }]);
      setNewGuest({ name: '', message: '' });
    }
  };

  const guestColors = ['bg-electric-blue', 'bg-brand-pink', 'bg-lime-green', 'bg-midnight-purple', 'bg-inferno-red'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <Home size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">The Guest House</h1>
          <p className="text-gray-600 font-body">Welcome all visitors</p>
        </div>
      </div>

      <div className="card bg-parchment border-2 border-midnight-purple">
        <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Rumi's Poem</h3>
        <div className="text-gray-800 font-body italic space-y-2 text-sm leading-relaxed">
          <p>This being human is a guest house.</p>
          <p>Every morning a new arrival.</p>
          <p>A joy, a depression, a meanness,</p>
          <p>some momentary awareness comes as an unexpected visitor.</p>
          <p className="mt-4">Welcome and entertain them all!</p>
          <p>Even if they're a crowd of sorrows,</p>
          <p>who violently sweep your house empty of its furniture,</p>
          <p>still, treat each guest honorably.</p>
          <p>They may be clearing you out for some new delight.</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">The Practice</h3>
        <p className="text-gray-700 font-body">
          Your mind is like a guest house. Thoughts, feelings, and memories arrive like guests. Some are pleasant,
          some difficult. Instead of slamming the door on unwanted guests, practice welcoming them all.
          They're just visitors - they'll leave when they're ready.
        </p>
      </div>

      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple mb-3">Your Guests Today</h3>
        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            placeholder="Guest name (e.g., 'Anxiety', 'Grief', 'Anger', 'Joy')"
            className="input-field w-full"
          />
          <input
            type="text"
            value={newGuest.message}
            onChange={(e) => setNewGuest({ ...newGuest, message: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addGuest()}
            placeholder="What is this guest bringing? (optional)"
            className="input-field w-full"
          />
          <button
            onClick={addGuest}
            disabled={!newGuest.name.trim()}
            className="btn-secondary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Plus size={18} />
            <span>Welcome This Guest</span>
          </button>
        </div>

        {guests.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="font-subheader uppercase text-midnight-purple text-sm">Current Guests ({guests.length})</h4>
            {guests.map((guest, idx) => (
              <div
                key={guest.id}
                className={`${guestColors[idx % guestColors.length]} bg-opacity-20 border-2 ${guestColors[idx % guestColors.length].replace('bg-', 'border-')} rounded-lg p-4 animate-slide-in-up`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">👋</div>
                  <div className="flex-1">
                    <div className="font-header text-lg text-midnight-purple mb-1">{guest.name}</div>
                    {guest.message && (
                      <div className="text-gray-700 font-body text-sm italic">"{guest.message}"</div>
                    )}
                    <div className="text-xs text-gray-600 font-body mt-2">
                      "Welcome, {guest.name}. I make room for you. You may stay as long as you need, and leave when you're ready."
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {guests.length >= 3 && (
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Beautiful Practice</h3>
          <p className="text-gray-700 font-body mb-3">
            You've welcomed {guests.length} guests. Notice how it feels to greet difficult emotions
            with hospitality instead of resistance.
          </p>
          <p className="text-gray-700 font-body">
            <strong>Remember:</strong> Welcoming doesn't mean liking. It means making room. When you stop
            fighting your guests, you have more energy for living your life.
          </p>
        </div>
      )}

      <button onClick={() => window.history.back()} className="btn-secondary w-full">
        Back to Exercises
      </button>
    </div>
  );
}
