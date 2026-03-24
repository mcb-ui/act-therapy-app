import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';

// Improvement #5: Fix deprecated onKeyPress → onKeyDown
// Improvement #16: Page title
// Improvement #36: More coach response patterns
// Improvement #37: Conversation persistence in localStorage
// Improvement #38: Clear chat button

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string; // ISO string for serialization
}

const STORAGE_KEY = 'act-coach-messages';

const initialMessage: Message = {
  id: '1',
  role: 'coach',
  content: "Hello! I'm your ACT coach. I'm here to help you apply ACT principles to your daily life. What would you like to work on today?",
  timestamp: new Date().toISOString(),
};

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [initialMessage];
      }
    }
    return [initialMessage];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    document.title = 'ACT Coach | ACT Therapy';
    scrollToBottom();
  }, [messages]);

  // Improvement #37: Persist conversation
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Improvement #36: More response patterns
  const getCoachResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Values-related
    if (lowerMessage.includes('value') || lowerMessage.includes('important') || lowerMessage.includes('matter')) {
      return "Values are like a compass - they guide your direction in life. Can you tell me about one area of your life where you'd like to be more aligned with your values? (Family, Work, Health, Relationships, etc.)";
    }

    // Anxiety/worry
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('nervous') || lowerMessage.includes('panic')) {
      return "I hear you're experiencing anxiety. In ACT, we don't try to eliminate anxiety - instead, we learn to make room for it while still moving toward what matters. Can you identify what this anxiety is trying to tell you it wants to protect you from?";
    }

    // Stress
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm') || lowerMessage.includes('burned out') || lowerMessage.includes('burnout')) {
      return "Stress often shows up when we care deeply about something. Rather than fighting the stress, let's explore: what values are underneath this stress? What matters to you about the situation causing it? Sometimes stress is a signpost pointing toward what's important.";
    }

    // Sleep
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('can\'t sleep') || lowerMessage.includes('tired')) {
      return "Sleep difficulties often involve a busy mind. Try this ACT-based approach: Instead of trying to force sleep, practice noticing your thoughts as passing events. Imagine placing each thought on a leaf floating down a stream. The goal isn't to stop thinking - it's to change your relationship with those thoughts.";
    }

    // Relationships
    if (lowerMessage.includes('relationship') || lowerMessage.includes('partner') || lowerMessage.includes('friend') || lowerMessage.includes('family') || lowerMessage.includes('lonely')) {
      return "Relationships are often deeply connected to our values. In ACT, we focus on being the kind of person we want to be in relationships, rather than trying to control how others behave. What kind of friend/partner/family member do you want to be? What qualities do you want to bring to your relationships?";
    }

    // Self-compassion
    if (lowerMessage.includes('hate myself') || lowerMessage.includes('not good enough') || lowerMessage.includes('failure') || lowerMessage.includes('worthless') || lowerMessage.includes('self-esteem')) {
      return "I hear pain in what you're sharing, and I want you to know that's a very human experience. In ACT, we practice self-compassion - not because we're broken and need fixing, but because we're human and deserve kindness. Try this: Would you say what you just said to a close friend? What would you say to them instead?";
    }

    // Thoughts
    if (lowerMessage.includes('thought') || lowerMessage.includes('think')) {
      return "In ACT, we practice cognitive defusion - noticing thoughts as mental events rather than facts. Try this: Take that thought and add 'I'm having the thought that...' before it. How does that change your relationship with it?";
    }

    // Emotions/feelings
    if (lowerMessage.includes('feel') || lowerMessage.includes('emotion') || lowerMessage.includes('sad') || lowerMessage.includes('angry') || lowerMessage.includes('depressed')) {
      return "Thank you for sharing that feeling with me. In ACT, we practice acceptance - making room for difficult emotions rather than fighting them. On a scale of 1-10, how willing are you to have this feeling if it meant you could do something important to you?";
    }

    // Present moment
    if (lowerMessage.includes('present') || lowerMessage.includes('mindful') || lowerMessage.includes('now') || lowerMessage.includes('distract')) {
      return "Being present is a powerful skill! Let's try a quick grounding exercise: Can you notice 3 things you can see right now, 2 things you can hear, and 1 thing you can feel (like your feet on the floor)?";
    }

    // Action/goals
    if (lowerMessage.includes('goal') || lowerMessage.includes('action') || lowerMessage.includes('motivation') || lowerMessage.includes('procrastinat')) {
      return "Committed action is about taking steps aligned with your values - even when motivation is low! In ACT, we don't wait to feel motivated. What's one small, concrete action you could take in the next 5 minutes that would move you toward what matters most?";
    }

    // Fear/avoidance
    if (lowerMessage.includes('fear') || lowerMessage.includes('avoid') || lowerMessage.includes('scared') || lowerMessage.includes('afraid')) {
      return "Fear often shows up when something meaningful is at stake. In ACT, we practice willingness - being open to discomfort in the service of our values. What would you do if fear wasn't in charge? What valued action is fear keeping you from?";
    }

    // Stuck/help
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help') || lowerMessage.includes('don\'t know')) {
      return "Feeling stuck is actually a great place to start. It shows you care about moving forward. Let's explore this: If you weren't stuck, what would be different? What would you be doing?";
    }

    // Gratitude/positive
    if (lowerMessage.includes('grateful') || lowerMessage.includes('thank') || lowerMessage.includes('better') || lowerMessage.includes('good')) {
      return "That's wonderful to hear! Noticing what's going well is an important part of being present. In ACT, we hold space for both the difficult AND the positive. What values were you living out in that positive experience?";
    }

    // Default responses
    const defaultResponses = [
      "That's an important insight. Can you tell me more about how this affects your daily life?",
      "I appreciate you sharing that. How does this relate to what truly matters to you - your values?",
      "That sounds challenging. What have you noticed about how you typically respond to this?",
      "Thank you for being open. What would it be like to make room for this experience while still taking action toward your goals?",
      "I hear you. In ACT, we focus on what you can control - your actions. What's one small step you could take right now?",
      "That's interesting. If you could step back and observe this situation from the perspective of your 'observer self,' what might you notice?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate coach "thinking"
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: getCoachResponse(currentInput),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Improvement #38: Clear chat
  const handleClearChat = () => {
    setMessages([{ ...initialMessage, timestamp: new Date().toISOString() }]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    "I'm feeling anxious about work",
    "Help me clarify my values",
    "I can't stop worrying",
    "I want to be more present",
    "How do I set better goals?",
    "I'm feeling stuck and overwhelmed",
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-electric-blue flex items-center justify-center shadow-lg animate-pulse-slow">
            <Bot size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-header text-midnight-purple flex items-center space-x-2">
              <span>ACT Coach</span>
              <Sparkles size={24} className="text-electric-blue" />
            </h1>
            <p className="text-gray-600 font-body">Your personal guide to practicing ACT</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <div className="text-xs font-subheader uppercase text-gray-500 mb-1">Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-lime-green rounded-full animate-pulse"></div>
                <span className="text-sm font-body text-gray-700">Online</span>
              </div>
            </div>
            {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-400 hover:text-inferno-red transition-colors rounded-lg hover:bg-gray-100"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 card overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 animate-slide-in-up ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'coach'
                  ? 'bg-electric-blue'
                  : 'bg-parchment'
              }`}
            >
              {message.role === 'coach' ? (
                <Bot size={20} className="text-white" />
              ) : (
                <User size={20} className="text-midnight-purple" />
              )}
            </div>

            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'coach'
                  ? 'bg-midnight-purple border-2 border-electric-blue'
                  : 'bg-parchment border-2 border-midnight-purple'
              }`}
            >
              <p className="font-body text-gray-800 leading-relaxed">{message.content}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3 animate-slide-in-up">
            <div className="w-10 h-10 rounded-full bg-electric-blue flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div className="bg-midnight-purple border-2 border-electric-blue rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="mb-4">
          <p className="text-sm font-subheader text-gray-600 uppercase mb-2">Suggested topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 bg-parchment text-midnight-purple rounded-lg font-body text-sm hover:bg-electric-blue hover:text-white transition-all hover:scale-105"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="card">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="input-field flex-1"
            disabled={isTyping}
            aria-label="Chat message"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
