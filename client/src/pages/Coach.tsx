import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'coach',
      content: "Hello! I'm your ACT coach. I'm here to help you apply ACT principles to your daily life. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCoachResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Values-related
    if (lowerMessage.includes('value') || lowerMessage.includes('important') || lowerMessage.includes('matter')) {
      return "Values are like a compass - they guide your direction in life. Can you tell me about one area of your life where you'd like to be more aligned with your values? (Family, Work, Health, Relationships, etc.)";
    }

    // Anxiety/worry
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('nervous')) {
      return "I hear you're experiencing anxiety. In ACT, we don't try to eliminate anxiety - instead, we learn to make room for it while still moving toward what matters. Can you identify what this anxiety is trying to tell you it wants to protect you from?";
    }

    // Thoughts
    if (lowerMessage.includes('thought') || lowerMessage.includes('think')) {
      return "In ACT, we practice cognitive defusion - noticing thoughts as mental events rather than facts. Try this: Take that thought and add 'I'm having the thought that...' before it. How does that change your relationship with it?";
    }

    // Emotions/feelings
    if (lowerMessage.includes('feel') || lowerMessage.includes('emotion') || lowerMessage.includes('sad') || lowerMessage.includes('angry')) {
      return "Thank you for sharing that feeling with me. In ACT, we practice acceptance - making room for difficult emotions rather than fighting them. On a scale of 1-10, how willing are you to have this feeling if it meant you could do something important to you?";
    }

    // Present moment
    if (lowerMessage.includes('present') || lowerMessage.includes('mindful') || lowerMessage.includes('now')) {
      return "Being present is a powerful skill! Let's try a quick grounding exercise: Can you notice 3 things you can see right now, 2 things you can hear, and 1 thing you can feel (like your feet on the floor)?";
    }

    // Action/goals
    if (lowerMessage.includes('goal') || lowerMessage.includes('action') || lowerMessage.includes('do')) {
      return "Committed action is about taking steps aligned with your values! What's one small, concrete action you could take today that would move you toward what matters most to you?";
    }

    // Stuck/help
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help') || lowerMessage.includes('don\'t know')) {
      return "Feeling stuck is actually a great place to start. It shows you care about moving forward. Let's explore this: If you weren't stuck, what would be different? What would you be doing?";
    }

    // Default responses
    const defaultResponses = [
      "That's an important insight. Can you tell me more about how this affects your daily life?",
      "I appreciate you sharing that. How does this relate to what truly matters to you - your values?",
      "That sounds challenging. What have you noticed about how you typically respond to this?",
      "Thank you for being open. What would it be like to make room for this experience while still taking action toward your goals?",
      "I hear you. In ACT, we focus on what you can control - your actions. What's one small step you could take right now?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate coach "thinking"
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: getCoachResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const suggestedPrompts = [
    "I'm feeling anxious about work",
    "Help me clarify my values",
    "I can't stop worrying",
    "I want to be more present",
    "How do I set better goals?",
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue to-midnight-purple flex items-center justify-center shadow-lg animate-pulse-slow">
            <Bot size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-header text-midnight-purple flex items-center space-x-2">
              <span>ACT Coach</span>
              <Sparkles size={24} className="text-electric-blue" />
            </h1>
            <p className="text-gray-600 font-body">Your personal guide to practicing ACT</p>
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-subheader uppercase text-gray-500 mb-1">Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-lime-green rounded-full animate-pulse"></div>
              <span className="text-sm font-body text-gray-700">Online</span>
            </div>
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
                  ? 'bg-gradient-to-br from-electric-blue to-midnight-purple'
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
                  ? 'bg-gradient-to-br from-electric-blue-50 to-midnight-purple-50 border-2 border-electric-blue'
                  : 'bg-parchment border-2 border-midnight-purple'
              }`}
            >
              <p className="font-body text-gray-800 leading-relaxed">{message.content}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3 animate-slide-in-up">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-midnight-purple flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div className="bg-gradient-to-br from-electric-blue-50 to-midnight-purple-50 border-2 border-electric-blue rounded-2xl px-4 py-3">
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
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="input-field flex-1"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
