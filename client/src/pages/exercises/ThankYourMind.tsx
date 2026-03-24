import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';

interface ThankYouMessage {
  id: string;
  thought: string;
  thankYou: string;
  timestamp: Date;
}

export default function ThankYourMind() {
  useEffect(() => { document.title = 'Thank Your Mind | ACT Therapy'; }, []);
  const [thought, setThought] = useState('');
  const [messages, setMessages] = useState<ThankYouMessage[]>([]);

  const thankYouTemplates = [
    "Thank you, mind, for that thought!",
    "Thanks for sharing, mind!",
    "I appreciate your input, mind!",
    "Thank you for trying to protect me, mind!",
    "Thanks, mind, but I've got this!",
    "Interesting thought, mind. Thank you!",
  ];

  const handleThankMind = () => {
    if (thought.trim()) {
      const randomThankYou = thankYouTemplates[Math.floor(Math.random() * thankYouTemplates.length)];
      const newMessage: ThankYouMessage = {
        id: Date.now().toString(),
        thought: thought,
        thankYou: randomThankYou,
        timestamp: new Date(),
      };
      setMessages([newMessage, ...messages]);
      setThought('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<MessageCircle size={24} className="text-white" />} title="Thank Your Mind" subtitle="A playful defusion technique" exerciseId="thank-your-mind" exerciseName="Thank Your Mind" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How it Works</h3>
        <p className="text-gray-700 font-body mb-2">
          Your mind is constantly generating thoughts - it's just doing its job! When an unhelpful thought appears,
          instead of fighting it or believing it, try saying "Thank you, mind!" with a light, playful tone.
        </p>
        <p className="text-gray-700 font-body">
          This simple phrase acknowledges the thought without getting hooked by it. It creates space between you
          and your thoughts, reminding you that you are not your mind - you are the one observing it.
        </p>
      </div>

      {/* Input Section */}
      <div className="card">
        <label className="font-subheader uppercase text-midnight-purple text-sm mb-2 block">
          What is your mind telling you?
        </label>
        <div className="flex space-x-3">
          <input
            type="text"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleThankMind()}
            placeholder="e.g., 'You're going to mess this up' or 'Nobody likes you'"
            className="input-field flex-1"
          />
          <button
            onClick={handleThankMind}
            disabled={!thought.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ThumbsUp size={18} />
            <span>Thank Mind</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {messages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="card text-center bg-lime-green bg-opacity-10 animate-slide-in-up">
            <div className="text-4xl font-bold text-midnight-purple">{messages.length}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Thoughts Thanked</div>
          </div>
          <div className="card text-center bg-brand-pink bg-opacity-10 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl">🙏</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Gratitude Practice</div>
          </div>
          <div className="card text-center bg-electric-blue bg-opacity-10 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl">😌</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Defusion Active</div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className="card hover-lift animate-slide-in-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {/* Mind's thought */}
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-midnight-purple flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🧠</span>
              </div>
              <div className="flex-1">
                <div className="bg-midnight-purple bg-opacity-10 rounded-lg p-3">
                  <p className="text-gray-800 font-body italic">"{msg.thought}"</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Mind</span>
              </div>
            </div>

            {/* Your response */}
            <div className="flex items-start space-x-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-lime-green flex items-center justify-center flex-shrink-0">
                <ThumbsUp size={18} className="text-white" />
              </div>
              <div className="flex-1 text-right">
                <div className="bg-lime-green bg-opacity-20 rounded-lg p-3 inline-block">
                  <p className="text-gray-800 font-body font-semibold">{msg.thankYou}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">You</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="card text-center py-12 bg-parchment bg-opacity-30">
          <MessageCircle size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-body mb-2">
            Your mind will keep talking - that's its job!
          </p>
          <p className="text-gray-600 font-body">
            Start by entering a thought above and thanking your mind for it
          </p>
        </div>
      )}

      {messages.length >= 5 && (
        <div className="card bg-lime-green text-white animate-slide-in-up">
          <h3 className="font-subheader mb-2 uppercase">Great Practice!</h3>
          <p className="font-body mb-3">
            You've thanked your mind {messages.length} times! Notice how this creates a playful, friendly
            relationship with your thoughts instead of a combative one.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="font-body mb-2"><strong>Key Insights:</strong></p>
            <ul className="space-y-1 text-sm font-body">
              <li>• Your mind produces thoughts automatically - it's not the enemy</li>
              <li>• You can notice thoughts without believing or fighting them</li>
              <li>• Gratitude creates space and lightness around difficult thoughts</li>
              <li>• You are not your thoughts - you are the one observing them</li>
            </ul>
          </div>
        </div>
      )}

      <Link to="/" className="btn-secondary w-full">Back to Dashboard</Link>
    </div>
  );
}
