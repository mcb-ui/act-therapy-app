import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  ListTodo,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import { exerciseById } from '../data/exerciseCatalog';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { api } from '../lib/api';
import { buildPracticeFlowModel, type ExerciseRecommendation } from '../lib/practiceFlow';
import { formatPracticeSessionAge, getPracticeSessionExercise } from '../lib/practiceSession';
import { getFavorites, getProgress, type Favorite, type ProgressEntry } from '../utils/exerciseTracking';

interface CoachSuggestion {
  exerciseId: string;
  reason: string;
}

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
  suggestion?: CoachSuggestion | null;
}

interface ValueRecord {
  id: string;
  category: string;
  description: string;
  importance: number;
  alignment: number;
}

interface ActionRecord {
  id: string;
  valueId?: string | null;
  title: string;
  description?: string | null;
  completed: boolean;
  dueDate?: string | null;
}

interface CoachContext {
  primaryRecommendation: ExerciseRecommendation | null;
  topValue: ValueRecord | null;
  activeActionCount: number;
  overdueActionCount: number;
  lastSessionTitle: string | null;
}

const COACH_STORAGE_KEY = 'act-coach-messages';

const defaultMessages: Message[] = [
  {
    id: '1',
    role: 'coach',
    content:
      "I'm your ACT coach. Bring me the thought, emotion, situation, or decision that is pulling at you, and we'll turn it into one useful next move.",
    timestamp: new Date(),
    suggestion: null,
  },
];

function loadSavedMessages(): Message[] {
  if (typeof window === 'undefined') {
    return defaultMessages;
  }

  try {
    const raw = window.localStorage.getItem(COACH_STORAGE_KEY);

    if (!raw) {
      return defaultMessages;
    }

    const parsed = JSON.parse(raw) as Array<Omit<Message, 'timestamp'> & { timestamp: string }>;

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultMessages;
    }

    return parsed.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
      suggestion: message.suggestion ?? null,
    }));
  } catch {
    return defaultMessages;
  }
}

const isOverdue = (dueDate: string | null | undefined) => {
  if (!dueDate) {
    return false;
  }

  const dueTime = new Date(dueDate).getTime();

  return !Number.isNaN(dueTime) && dueTime < Date.now();
};

const createCoachContext = (
  primaryRecommendation: ExerciseRecommendation | null,
  values: ValueRecord[],
  actions: ActionRecord[],
  lastSessionTitle: string | null
): CoachContext => {
  const topValue =
    [...values].sort((left, right) => {
      if (right.importance !== left.importance) {
        return right.importance - left.importance;
      }

      return left.alignment - right.alignment;
    })[0] ?? null;
  const activeActions = actions.filter((action) => !action.completed);

  return {
    primaryRecommendation,
    topValue,
    activeActionCount: activeActions.length,
    overdueActionCount: activeActions.filter((action) => isOverdue(action.dueDate)).length,
    lastSessionTitle,
  };
};

const getCoachResponse = (userMessage: string, context: CoachContext): string => {
  const lowerMessage = userMessage.toLowerCase();
  const focusTitle = context.primaryRecommendation?.exercise.title;
  const topValueName = context.topValue?.category;

  if (lowerMessage.includes('what should i practice') || lowerMessage.includes('what do i do next')) {
    return focusTitle
      ? `${focusTitle} is the cleanest next rep right now. ${context.primaryRecommendation?.reason} What would make it easy enough to do today instead of later?`
      : "Start with one short practice that feels doable today. Momentum matters more than picking the perfect exercise.";
  }

  if (lowerMessage.includes('value') || lowerMessage.includes('important') || lowerMessage.includes('matter')) {
    return topValueName
      ? `${topValueName} already looks important in your practice. What would living that value look like in behavior this week, not just in intention?`
      : "Values are directions, not goals. Pick one life area that matters and describe the kind of person you want to be there.";
  }

  if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('nervous')) {
    return topValueName
      ? `Anxiety usually shows up around something that matters. If ${topValueName} is still important, what valued move would be worth making even with anxiety in the room?`
      : "ACT does not ask you to eliminate anxiety first. It asks whether you can make room for it and still move one inch toward what matters.";
  }

  if (lowerMessage.includes('thought') || lowerMessage.includes('think') || lowerMessage.includes('story')) {
    return "Treat the thought as a mental event, not a command. Try saying, 'I'm noticing my mind is telling me...' and see if that creates even a little more room to choose.";
  }

  if (
    lowerMessage.includes('feel') ||
    lowerMessage.includes('emotion') ||
    lowerMessage.includes('sad') ||
    lowerMessage.includes('angry')
  ) {
    return "Instead of asking how to get rid of the feeling, ask what happens if you soften around it for one minute. What would you do next if the feeling did not get the final vote?";
  }

  if (lowerMessage.includes('present') || lowerMessage.includes('mindful') || lowerMessage.includes('now')) {
    return "Come back to the moment before you solve it. Name three things you can see, two things you can hear, and one sensation in your body. Then decide what matters next.";
  }

  if (lowerMessage.includes('goal') || lowerMessage.includes('action') || lowerMessage.includes('do')) {
    if (context.overdueActionCount > 0) {
      return `You already have ${context.overdueActionCount} overdue commitment${context.overdueActionCount === 1 ? '' : 's'}. Before adding more, ask: what needs to be simplified, rescheduled, or made smaller so follow-through becomes realistic?`;
    }

    return "Make the action small, visible, and schedulable. If it still feels heavy, it is probably too big for a next step.";
  }

  if (
    lowerMessage.includes('stuck') ||
    lowerMessage.includes('help') ||
    lowerMessage.includes("don't know") ||
    lowerMessage.includes('overwhelmed')
  ) {
    return focusTitle
      ? `When you're stuck, reduce the problem to one useful rep. ${focusTitle} is a strong next move because ${context.primaryRecommendation?.reason.toLowerCase()}`
      : "When things feel muddy, reduce the horizon. What is one move you could complete in under ten minutes that would make the day slightly more aligned?";
  }

  return focusTitle
    ? `The thread I hear is this: something matters, and your mind is making the next move feel heavier than it needs to. ${focusTitle} is the best next practice because ${context.primaryRecommendation?.reason.toLowerCase()}`
    : "Stay close to behavior. What is one small thing you can do today that your future self would recognize as moving toward what matters?";
};

const getCoachSuggestion = (userMessage: string, context: CoachContext): CoachSuggestion | null => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('value') || lowerMessage.includes('important') || lowerMessage.includes('matter')) {
    return {
      exerciseId: 'values',
      reason: 'Use this to turn abstract priorities into concrete directions you can actually live.',
    };
  }

  if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('nervous')) {
    return {
      exerciseId: 'willingness-scale',
      reason: 'This helps you make room for anxious feelings while still choosing a valued move.',
    };
  }

  if (lowerMessage.includes('thought') || lowerMessage.includes('think') || lowerMessage.includes('story')) {
    return {
      exerciseId: 'defusion',
      reason: 'Use this when a sticky thought is acting like a command instead of background mental noise.',
    };
  }

  if (
    lowerMessage.includes('feel') ||
    lowerMessage.includes('emotion') ||
    lowerMessage.includes('sad') ||
    lowerMessage.includes('angry')
  ) {
    return {
      exerciseId: 'guest-house',
      reason: 'This practice helps you stop organizing the day around avoiding a feeling.',
    };
  }

  if (lowerMessage.includes('present') || lowerMessage.includes('mindful') || lowerMessage.includes('now')) {
    return {
      exerciseId: 'mindfulness',
      reason: 'This gives you a short reset so you can respond instead of reacting automatically.',
    };
  }

  if (lowerMessage.includes('goal') || lowerMessage.includes('action') || lowerMessage.includes('do')) {
    return {
      exerciseId: 'action',
      reason: 'Use the planner to turn motivation into one specific action that can survive real life.',
    };
  }

  if (
    lowerMessage.includes('stuck') ||
    lowerMessage.includes('help') ||
    lowerMessage.includes("don't know") ||
    lowerMessage.includes('overwhelmed')
  ) {
    return {
      exerciseId: 'values-compass',
      reason: 'When the day feels muddy, this helps you reorient around the life areas that matter most.',
    };
  }

  if (context.primaryRecommendation) {
    return {
      exerciseId: context.primaryRecommendation.exercise.id,
      reason: context.primaryRecommendation.reason,
    };
  }

  return null;
};

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>(loadSavedMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [values, setValues] = useState<ValueRecord[]>([]);
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [isContextLoading, setIsContextLoading] = useState(true);
  const [contextError, setContextError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const practiceSession = usePracticeSession();
  const lastSessionExercise = getPracticeSessionExercise(practiceSession);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    window.localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    void (async () => {
      setIsContextLoading(true);
      setContextError('');

      const [progressResult, favoritesResult, valuesResult, actionsResult] = await Promise.allSettled([
        getProgress(),
        getFavorites(),
        api.get<ValueRecord[]>('/values'),
        api.get<ActionRecord[]>('/actions'),
      ]);

      if (progressResult.status === 'fulfilled') {
        setProgressEntries(progressResult.value);
      }

      if (favoritesResult.status === 'fulfilled') {
        setFavorites(favoritesResult.value);
      }

      if (valuesResult.status === 'fulfilled') {
        setValues(valuesResult.value.data);
      }

      if (actionsResult.status === 'fulfilled') {
        setActions(actionsResult.value.data);
      }

      if (
        progressResult.status === 'rejected' ||
        favoritesResult.status === 'rejected' ||
        valuesResult.status === 'rejected' ||
        actionsResult.status === 'rejected'
      ) {
        setContextError('Some practice context could not be loaded. The coach still works, but the recommendations may be less tailored.');
      }

      setIsContextLoading(false);
    })();
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const practiceFlow = useMemo(
    () => buildPracticeFlowModel(progressEntries, favorites, values, actions),
    [progressEntries, favorites, values, actions]
  );

  const coachContext = useMemo(
    () =>
      createCoachContext(
        practiceFlow.primaryRecommendation,
        values,
        actions,
        lastSessionExercise?.title ?? null
      ),
    [actions, lastSessionExercise?.title, practiceFlow.primaryRecommendation, values]
  );

  const suggestedPrompts = useMemo(() => {
    const prompts = [
      coachContext.topValue
        ? `Help me live ${coachContext.topValue.category.toLowerCase()} better this week`
        : 'Help me clarify what matters most right now',
      coachContext.overdueActionCount > 0
        ? 'Help me fix an overdue commitment'
        : 'Help me choose one concrete action for today',
      practiceFlow.primaryRecommendation
        ? `Why is ${practiceFlow.primaryRecommendation.exercise.title} my best next practice?`
        : 'What should I practice next?',
      lastSessionExercise
        ? `Help me return to ${lastSessionExercise.title}`
        : 'I feel stuck and need a reset',
      'I feel anxious and my mind will not slow down',
    ];

    return [...new Set(prompts)];
  }, [
    coachContext.overdueActionCount,
    coachContext.topValue,
    lastSessionExercise,
    practiceFlow.primaryRecommendation,
  ]);

  const handleSend = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
      suggestion: null,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);

    typingTimeoutRef.current = window.setTimeout(() => {
      const suggestion = getCoachSuggestion(trimmedInput, coachContext);
      const coachResponse: Message = {
        id: `${Date.now()}-coach`,
        role: 'coach',
        content: getCoachResponse(trimmedInput, coachContext),
        timestamp: new Date(),
        suggestion,
      };

      setMessages((current) => [...current, coachResponse]);
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 700);
  };

  const handleResetConversation = () => {
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    window.localStorage.removeItem(COACH_STORAGE_KEY);
    setMessages(defaultMessages);
    setInput('');
    setIsTyping(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {contextError && (
        <div className="rounded-2xl border border-inferno-red/20 bg-inferno-red/5 px-5 py-4 text-sm text-inferno-red">
          {contextError}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-electric-blue shadow-lg shadow-electric-blue/15">
                  <Bot size={30} className="text-white" />
                </div>
                <div>
                  <p className="font-subheader text-[11px] uppercase tracking-[0.2em] text-electric-blue">
                    Integrated Coach
                  </p>
                  <h1 className="mt-2 font-header text-3xl text-midnight-purple">
                    Talk it through, then move.
                  </h1>
                  <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                    The coach now uses your values, commitments, recent session, and best-next-practice recommendation to keep the conversation tied to action.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetConversation}
                className="inline-flex items-center gap-2 rounded-2xl border border-midnight-purple/10 px-4 py-3 font-subheader text-[11px] uppercase tracking-[0.18em] text-midnight-purple transition hover:bg-midnight-purple hover:text-white"
              >
                <RotateCcw size={16} />
                Reset chat
              </button>
            </div>
          </div>

          <div className="card min-h-[30rem] max-h-[42rem] overflow-y-auto space-y-4">
            {messages.map((message) => {
              const suggestedExercise = message.suggestion
                ? exerciseById.get(message.suggestion.exerciseId)
                : null;

              return (
                <div key={message.id} className="animate-slide-in-up">
                  <div
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        message.role === 'coach' ? 'bg-electric-blue' : 'bg-parchment'
                      }`}
                    >
                      {message.role === 'coach' ? (
                        <Bot size={20} className="text-white" />
                      ) : (
                        <User size={20} className="text-midnight-purple" />
                      )}
                    </div>

                    <div
                      className={`max-w-[78%] rounded-2xl border-2 px-4 py-3 ${
                        message.role === 'coach'
                          ? 'border-electric-blue bg-midnight-purple'
                          : 'border-midnight-purple bg-parchment'
                      }`}
                    >
                      <p
                        className={`font-body leading-7 ${
                          message.role === 'coach' ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {message.content}
                      </p>
                      <span
                        className={`mt-2 block text-xs ${
                          message.role === 'coach' ? 'text-electric-blue/80' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {message.role === 'coach' && message.suggestion && suggestedExercise ? (
                    <div className="ml-[3.25rem] mt-3">
                      <Link
                        to={suggestedExercise.route}
                        className="block rounded-[1.35rem] border border-electric-blue/15 bg-electric-blue/5 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                          Suggested practice
                        </p>
                        <div className="mt-2 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                              {suggestedExercise.title}
                            </h3>
                            <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                              {message.suggestion.reason}
                            </p>
                          </div>
                          <ArrowRight size={16} className="mt-1 text-electric-blue" />
                        </div>
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3 animate-slide-in-up">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-blue">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="rounded-2xl border-2 border-electric-blue bg-midnight-purple px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-electric-blue animate-bounce" />
                    <div
                      className="h-2 w-2 rounded-full bg-electric-blue animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-electric-blue animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="rounded-[1.5rem] border border-midnight-purple/10 bg-white px-4 py-4 shadow-sm">
            <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
              Suggested prompts
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-xl bg-parchment px-4 py-2 font-body text-sm text-midnight-purple transition hover:bg-electric-blue hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                placeholder="Type what is happening, what your mind is saying, or what you need help deciding."
                className="input-field flex-1"
                disabled={isTyping}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                  Today&apos;s best next rep
                </p>
                <h2 className="mt-2 font-subheader text-xl uppercase text-midnight-purple">
                  {practiceFlow.primaryRecommendation?.exercise.title ?? 'Choose a practice'}
                </h2>
                <p className="mt-3 font-body text-sm leading-6 text-gray-600">
                  {isContextLoading
                    ? 'Loading your current practice context...'
                    : practiceFlow.primaryRecommendation?.reason ??
                      'Once your practice data is available, the coach will steer you toward the strongest next move.'}
                </p>
              </div>
              <Sparkles size={18} className="mt-1 text-electric-blue" />
            </div>

            {practiceFlow.primaryRecommendation && (
              <Link
                to={practiceFlow.primaryRecommendation.exercise.route}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-midnight-purple px-4 py-3 font-subheader text-[11px] uppercase tracking-[0.18em] text-white transition hover:bg-electric-blue"
              >
                Open {practiceFlow.primaryRecommendation.exercise.title}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-electric-blue/10 text-electric-blue">
                  <Target size={18} />
                </div>
                <div>
                  <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    Anchor value
                  </p>
                  <p className="mt-1 font-subheader text-sm uppercase text-midnight-purple">
                    {coachContext.topValue?.category ?? 'Not defined yet'}
                  </p>
                </div>
              </div>
              <p className="mt-3 font-body text-sm leading-6 text-gray-600">
                {coachContext.topValue?.description ??
                  'Define a value and the coach can keep the conversation tied to a direction that matters.'}
              </p>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-green/10 text-lime-green">
                  <ListTodo size={18} />
                </div>
                <div>
                  <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    Commitments
                  </p>
                  <p className="mt-1 font-subheader text-sm uppercase text-midnight-purple">
                    {coachContext.activeActionCount} active, {coachContext.overdueActionCount} overdue
                  </p>
                </div>
              </div>
              <p className="mt-3 font-body text-sm leading-6 text-gray-600">
                {coachContext.overdueActionCount > 0
                  ? 'The coach will bias toward simplifying or repairing follow-through before encouraging more planning.'
                  : 'No overdue commitments are dragging behind you right now.'}
              </p>
            </div>
          </div>

          {practiceSession && lastSessionExercise && (
            <div className="card bg-midnight-purple/5">
              <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue">
                Last session
              </p>
              <h3 className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                {lastSessionExercise.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                Opened {formatPracticeSessionAge(practiceSession.visitedAt)}. If the conversation points back there, you can jump straight in.
              </p>
              <Link
                to={practiceSession.route}
                className="mt-4 inline-flex items-center gap-2 font-subheader text-[11px] uppercase tracking-[0.18em] text-electric-blue"
              >
                Resume that practice
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
