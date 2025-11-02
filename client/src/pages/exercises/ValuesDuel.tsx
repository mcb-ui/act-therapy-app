import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Value {
  name: string;
  description: string;
  example: string;
}

const allValues: Value[] = [
  { name: 'Adventure', description: 'To seek out new, exciting, or challenging experiences.', example: 'Trying a new restaurant or taking a different route home from work.' },
  { name: 'Beauty', description: 'To appreciate and cultivate beauty in my life (art, nature, etc.).', example: 'Stopping for 30 seconds to truly look at a beautiful sunset or flower.' },
  { name: 'Charity', description: 'To give resources (money, time) to help those in need.', example: 'Setting up a small, recurring monthly donation to a cause I believe in.' },
  { name: 'Citizenship', description: 'To be a responsible and engaged member of my society.', example: 'Staying informed and voting in a local election.' },
  { name: 'Community', description: 'To be part of and contribute to a group or "tribe."', example: 'Attending a local town hall meeting or community garden event.' },
  { name: 'Contribution', description: 'To make a positive difference in the world or my community.', example: 'Picking up a piece of trash on the sidewalk and throwing it away.' },
  { name: 'Environmentalism', description: 'To protect and care for the natural world.', example: 'Making a conscious effort to use a reusable water bottle today.' },
  { name: 'Freedom', description: 'To have independence of choice and action.', example: 'Choosing to spend my free time on a personal hobby.' },
  { name: 'Fun', description: 'To experience enjoyment, amusement, and lighthearted pleasure.', example: 'Scheduling 30 minutes of non-productive "play time" (like a game).' },
  { name: 'Humility', description: 'To be modest and recognize my own limitations.', example: 'When complimented, I will just say "Thank you" instead of deflecting.' },
  { name: 'Humour', description: 'To find, create, and share amusement and laughter.', example: 'Sending a funny (and appropriate) meme to a group chat.' },
  { name: 'Justice', description: 'To stand up for fairness, equity, and what is right.', example: 'Reading an article to better understand a social issue I am unfamiliar with.' },
  { name: 'Meaning', description: 'To find significance and purpose in life\'s events.', example: 'Journaling about a recent challenge and what I might learn from it.' },
  { name: 'Nature', description: 'To connect with and spend time in the natural environment.', example: 'Opening a window to listen to the birds or stepping outside to feel the air.' },
  { name: 'Cleanliness/Order', description: 'To create a pleasant, organized, and uncluttered physical space.', example: 'Taking 5 minutes to clear one surface (like the coffee table).' },
  { name: 'Play', description: 'To engage in activities purely for enjoyment and recreation.', example: 'Doodling in a notebook for 10 minutes with no specific goal.' },
  { name: 'Security', description: 'To create a life that feels safe, stable, and protected.', example: 'Reviewing my monthly budget to ensure I am on track with my financial plan.' },
  { name: 'Simplicity', description: 'To live in a way that is uncluttered, frugal, or minimalist.', example: 'Donating one item of clothing I no longer wear.' },
  { name: 'Solitude', description: 'To spend time alone for peace, reflection, and recharging.', example: 'Taking a 10-minute walk by myself, without my phone.' },
  { name: 'Spirituality', description: 'To connect with something larger than myself (e.g., God, nature, purpose).', example: 'Spending two minutes in quiet meditation or prayer.' },
  { name: 'Authenticity', description: 'To be true to myself and my values.', example: 'Expressing an honest opinion, even if it is unpopular.' },
  { name: 'Balance', description: 'To achieve harmony between different aspects of life.', example: 'Scheduling dedicated time for both work and personal activities this week.' },
  { name: 'Bravery', description: 'To face challenges, difficulties, and fears with courage.', example: 'Trying something new that makes me slightly uncomfortable, like a public speaking club.' },
  { name: 'Compassion', description: 'To show empathy and concern for others\' suffering.', example: 'Listening actively to a friend in need without judgment.' },
  { name: 'Creativity', description: 'To imagine and develop original ideas or things.', example: 'Spending 15 minutes brainstorming new ways to approach a task.' },
  { name: 'Curiosity', description: 'To have a strong desire to know or learn things.', example: 'Looking up an unfamiliar word or concept I encountered today.' },
  { name: 'Dedication', description: 'To be committed to a task or purpose.', example: 'Working consistently on a long-term project for at least an hour today.' },
  { name: 'Dependability', description: 'To be reliable and trustworthy.', example: 'Fulfilling a promise I made to someone, no matter how small.' },
  { name: 'Discipline', description: 'To exercise self-control and adherence to a set of rules.', example: 'Sticking to my planned workout routine even when I do not feel like it.' },
  { name: 'Empathy', description: 'To understand and share the feelings of another.', example: 'Imagining how someone else might feel in a difficult situation.' },
  { name: 'Excellence', description: 'To strive for high quality and outstanding achievement.', example: 'Taking extra time to review my work before submitting it.' },
  { name: 'Fairness', description: 'To treat all people equally and justly.', example: 'Ensuring I give everyone a chance to speak in a group discussion.' },
  { name: 'Forgiveness', description: 'To pardon someone for an offense or perceived wrongdoing.', example: 'Letting go of a small grudge I have been holding.' },
  { name: 'Generosity', description: 'To be liberal in giving or sharing.', example: 'Offering to help a colleague with their workload.' },
  { name: 'Growth', description: 'To develop and improve oneself, personally or professionally.', example: 'Reading a chapter of a non-fiction book related to my personal development.' },
  { name: 'Honesty', description: 'To be truthful and sincere.', example: 'Admitting a mistake I made directly and openly.' },
  { name: 'Hope', description: 'To have a feeling of expectation and desire for a certain thing to happen.', example: 'Maintaining a positive outlook when facing a minor setback.' },
  { name: 'Independence', description: 'To be self-reliant and free from external control.', example: 'Making a decision for myself without seeking others\' constant approval.' },
  { name: 'Ingenuity', description: 'To be clever, original, and inventive.', example: 'Finding a creative solution to a minor household problem.' },
  { name: 'Integrity', description: 'To be honest and have strong moral principles.', example: 'Standing by my word, even when it is inconvenient.' },
  { name: 'Joy', description: 'To experience great pleasure and happiness.', example: 'Actively seeking out an activity that brings me pure delight today.' },
  { name: 'Kindness', description: 'To be friendly, generous, and considerate.', example: 'Holding a door open for someone or offering a genuine compliment.' },
  { name: 'Knowledge', description: 'To seek and accumulate facts, information, and skills.', example: 'Dedicating 15 minutes to learning about a topic I know little about.' },
  { name: 'Leadership', description: 'To guide, direct, or influence others.', example: 'Taking initiative to organize a small team task.' },
  { name: 'Loyalty', description: 'To show faithfulness and commitment.', example: 'Standing up for a friend or colleague who is not present.' },
  { name: 'Mindfulness', description: 'To be aware or conscious of something.', example: 'Taking three deep breaths and focusing on the present moment.' },
  { name: 'Optimism', description: 'To be hopeful and confident about the future.', example: 'Looking for the positive aspect in a challenging situation.' },
  { name: 'Patience', description: 'To endure difficult circumstances without complaint.', example: 'Waiting calmly in a long queue without becoming frustrated.' },
  { name: 'Perseverance', description: 'To persist in doing something despite difficulty or delay in achieving success.', example: 'Continuing to work on a task even after encountering an obstacle.' },
  { name: 'Prudence', description: 'To act with careful good judgment.', example: 'Thinking through the potential consequences before making a small decision.' },
  { name: 'Purpose', description: 'To have a strong intention or reason for acting or existing.', example: 'Reflecting on how my daily tasks align with my long-term goals.' },
  { name: 'Resourcefulness', description: 'To be able to find quick and clever ways to overcome difficulties.', example: 'Using existing items at home to fix a minor issue instead of buying something new.' },
  { name: 'Respect', description: 'To have due regard for the feelings, wishes, or rights of others.', example: 'Listening attentively without interrupting when someone is speaking.' },
  { name: 'Responsibility', description: 'To be accountable for one\'s actions.', example: 'Following through on a commitment I made, even if it is inconvenient.' },
  { name: 'Self-Control', description: 'To exercise restraint over one\'s own impulses, emotions, or desires.', example: 'Resisting the urge to immediately check my phone during a conversation.' },
  { name: 'Service', description: 'To assist or benefit someone or something.', example: 'Offering to help a neighbor with a small chore.' },
  { name: 'Sincerity', description: 'To be free from deception, hypocrisy, or pretense.', example: 'Expressing my true feelings in a heartfelt conversation.' },
  { name: 'Strength', description: 'To have the capacity to withstand force or pressure.', example: 'Pushing through a challenging part of a workout or task.' },
  { name: 'Support', description: 'To give assistance to, especially financially.', example: 'Encouraging a friend in their endeavors.' },
  { name: 'Tenacity', description: 'To persist in maintaining, adhering to, or seeking something valued.', example: 'Refusing to give up on a difficult problem until I find a solution.' },
  { name: 'Thoughtfulness', description: 'To be considerate of others.', example: 'Sending a quick text to check in on someone I know is having a tough time.' },
  { name: 'Tolerance', description: 'To accept the existence of opinions or behavior that one dislikes or disagrees with.', example: 'Listening to a differing viewpoint with an open mind.' },
  { name: 'Trust', description: 'To have firm belief in the reliability, truth, ability, or strength of someone or something.', example: 'Believing in a friend\'s capability to overcome a challenge.' },
  { name: 'Understanding', description: 'To comprehend or grasp the meaning of something.', example: 'Asking clarifying questions to fully comprehend another person\'s perspective.' },
  { name: 'Unity', description: 'To be in agreement or harmony.', example: 'Working collaboratively with others towards a shared objective.' },
  { name: 'Valor', description: 'To have great courage, especially in battle.', example: 'Standing up for someone who is being unfairly treated.' },
  { name: 'Vision', description: 'To have the ability to think about or plan the future with imagination and wisdom.', example: 'Spending 10 minutes visualizing my desired outcome for a project.' },
  { name: 'Vitality', description: 'To have the state of being strong and active; energy.', example: 'Engaging in an activity that genuinely energizes me.' },
  { name: 'Warmth', description: 'To show kindness, friendliness, or affection.', example: 'Offering a genuine smile and a friendly greeting to someone I encounter.' },
  { name: 'Wisdom', description: 'To have the quality of having experience, knowledge, and good judgment.', example: 'Reflecting on past experiences to inform current decisions.' },
  { name: 'Wonder', description: 'To feel admiration and amazement.', example: 'Taking a moment to appreciate the intricacies of something ordinary, like a leaf.' },
  { name: 'Accomplishment', description: 'To achieve or complete successfully.', example: 'Celebrating a small personal victory at the end of the day.' },
  { name: 'Calmness', description: 'To be peaceful and free from agitation.', example: 'Practicing a short meditation when feeling stressed.' },
  { name: 'Connection', description: 'To establish a relationship with someone or something.', example: 'Having a meaningful conversation with a loved one.' },
  { name: 'Dignity', description: 'To be worthy of honor and respect.', example: 'Carrying myself with self-respect in all interactions.' },
  { name: 'Eloquence', description: 'To be fluent or persuasive in speaking or writing.', example: 'Practicing clear and articulate communication in a conversation.' },
  { name: 'Excitement', description: 'To feel a state of eagerness and lively interest.', example: 'Planning a small, enjoyable event to look forward to.' },
  { name: 'Gratitude', description: 'To feel thankfulness and appreciation.', example: 'Writing down three things I am grateful for today.' },
  { name: 'Harmony', description: 'To be in agreement or accord.', example: 'Resolving a minor conflict through calm discussion.' },
  { name: 'Innovation', description: 'To introduce new methods, ideas, or products.', example: 'Brainstorming a fresh approach to a routine task.' },
  { name: 'Joyfulness', description: 'To experience great pleasure and happiness.', example: 'Laughing wholeheartedly at a funny story or situation.' },
  { name: 'Magnanimity', description: 'To be generous or forgiving, especially towards a rival or less powerful person.', example: 'Offering help to someone who has previously caused a minor inconvenience.' },
  { name: 'Mirth', description: 'To experience amusement, especially as expressed in laughter.', example: 'Watching a comedic show or video to genuinely laugh.' },
  { name: 'Nurturing', description: 'To care for and encourage the growth or development of.', example: 'Spending time supporting a plant or a pet\'s well-being.' },
  { name: 'Orderliness', description: 'To be neat and systematic.', example: 'Organizing a small drawer or shelf for 10 minutes.' },
  { name: 'Peace', description: 'To have freedom from disturbance; tranquility.', example: 'Finding a quiet moment to sit in silence.' },
  { name: 'Poise', description: 'To have graceful and elegant bearing in a person.', example: 'Maintaining composure in a slightly stressful situation.' },
  { name: 'Presence', description: 'To be fully engaged and attentive in the current moment.', example: 'Putting away my phone and giving full attention during a conversation.' },
  { name: 'Propriety', description: 'To conform to conventionally accepted standards of behavior and morals.', example: 'Acting in a respectful manner in a formal setting.' },
  { name: 'Receptiveness', description: 'To be willing to consider new ideas or suggestions.', example: 'Listening openly to feedback without immediately becoming defensive.' },
  { name: 'Relaxation', description: 'To release from tension and anxiety.', example: 'Taking a 15-minute break to do something completely unwinding.' },
  { name: 'Self-Awareness', description: 'To have conscious knowledge of one\'s own character, feelings, motives, and desires.', example: 'Reflecting on my emotions after a significant event.' },
  { name: 'Self-Respect', description: 'To have regard for one\'s own dignity and honor.', example: 'Setting a boundary that protects my personal time.' },
  { name: 'Serenity', description: 'To be calm, peaceful, and untroubled.', example: 'Practicing a quiet moment of meditation or deep breathing.' },
  { name: 'Spontaneity', description: 'To perform an action as a result of a sudden inner impulse.', example: 'Deciding to do something unexpected and fun on a whim.' },
  { name: 'Stability', description: 'To be the state of being steady and not likely to change.', example: 'Sticking to a consistent daily routine for a week.' },
  { name: 'Steadfastness', description: 'To be resolutely or dutifully firm and unwavering.', example: 'Maintaining my commitment to a long-term goal despite challenges.' },
  { name: 'Synergy', description: 'To have the interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects.', example: 'Collaborating effectively on a group task, valuing everyone\'s input.' },
  { name: 'Tranquility', description: 'To be the quality or state of being tranquil; calm.', example: 'Spending time in a quiet, peaceful environment.' },
  { name: 'Trustworthiness', description: 'To be able to be relied on as honest or truthful.', example: 'Keeping a promise, even if it is a small one.' },
  { name: 'Versatility', description: 'To be able to adapt or be adapted to many different functions or activities.', example: 'Trying a new skill or hobby outside my usual comfort zone.' },
  { name: 'Zest', description: 'To have great enthusiasm and energy.', example: 'Approaching a new task with a positive and energetic attitude.' },
];

type Phase = 'intro' | 'duel' | 'top10' | 'complete';

const ValuesDuel: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [remainingValues, setRemainingValues] = useState<Value[]>([]);
  const [currentPair, setCurrentPair] = useState<[Value, Value] | null>(null);
  const [selectedValues, setSelectedValues] = useState<Value[]>([]);
  const [topFive, setTopFive] = useState<Value[]>([]);
  const [pairIndex, setPairIndex] = useState(0);

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start the duel
  const startDuel = () => {
    const shuffled = shuffleArray(allValues);
    setRemainingValues(shuffled);
    setPhase('duel');
    setPairIndex(0);
    setSelectedValues([]);
  };

  // Generate next pair
  useEffect(() => {
    if (phase === 'duel' && remainingValues.length > 0) {
      const startIdx = pairIndex * 2;

      // Check if we've gone through all pairs in this round
      if (startIdx >= remainingValues.length) {
        // Check if we have 10 or fewer values
        if (selectedValues.length <= 10) {
          setPhase('top10');
          return;
        }

        // Start next round with selected values
        const shuffled = shuffleArray(selectedValues);
        setRemainingValues(shuffled);
        setSelectedValues([]);
        setPairIndex(0);
        return;
      }

      // Handle odd number of values - auto-advance the last one
      if (startIdx === remainingValues.length - 1) {
        setSelectedValues([...selectedValues, remainingValues[startIdx]]);
        setPairIndex(pairIndex + 1);
        return;
      }

      // Set current pair
      setCurrentPair([remainingValues[startIdx], remainingValues[startIdx + 1]]);
    }
  }, [phase, remainingValues, pairIndex, selectedValues]);

  // Handle value selection
  const selectValue = (value: Value) => {
    setSelectedValues([...selectedValues, value]);
    setPairIndex(pairIndex + 1);

    // Add small delay for animation
    setTimeout(() => {
      setCurrentPair(null);
    }, 300);
  };

  // Handle top 5 selection
  const toggleTop5 = (value: Value) => {
    if (topFive.find(v => v.name === value.name)) {
      setTopFive(topFive.filter(v => v.name !== value.name));
    } else if (topFive.length < 5) {
      setTopFive([...topFive, value]);
    }
  };

  // Save top 5 to profile
  const saveTopFive = () => {
    localStorage.setItem('topFiveValues', JSON.stringify(topFive));
    localStorage.setItem('topFiveValuesDate', new Date().toISOString());
    setPhase('complete');
  };

  const totalComparisons = Math.ceil(allValues.length / 2);
  const currentComparison = pairIndex + 1;
  const progress = (currentComparison / totalComparisons) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-purple via-electric-blue to-inferno-red p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/exercises"
            className="flex items-center space-x-2 text-parchment hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Exercises</span>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-pink to-lime-green flex items-center justify-center mx-auto">
                  <Sparkles size={48} className="text-white" />
                </div>
              </motion.div>

              <h1 className="text-5xl font-bold text-white mb-4">Values Duel</h1>
              <p className="text-xl text-parchment mb-8 max-w-2xl mx-auto">
                Discover your core values through a series of choices. Pick one value over another until you find your top 10, then select your ultimate top 5.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">How it works:</h2>
                <div className="space-y-4 text-left text-parchment">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <p>You will see two values at a time. Choose the one that matters MORE to you.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <p>Continue choosing until you narrow down to your top 10 values.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <p>From those 10, select your ultimate top 5 core values.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <p>Your top 5 will be saved to your profile and displayed at the top.</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startDuel}
                className="px-12 py-4 bg-gradient-to-r from-lime-green to-brand-pink text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-lime-green/50 transition-all"
              >
                Start Values Duel
              </motion.button>
            </motion.div>
          )}

          {/* Duel Phase */}
          {phase === 'duel' && currentPair && (
            <motion.div
              key="duel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-parchment mb-2">
                  <span>Round Progress</span>
                  <span>{selectedValues.length} values selected</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-lime-green to-brand-pink"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white text-center mb-4">
                Which matters more to you?
              </h2>
              <p className="text-parchment text-center mb-12">
                Choose the value that resonates more deeply with who you want to be.
              </p>

              {/* Value Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {currentPair.map((value, index) => (
                  <motion.button
                    key={value.name}
                    initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectValue(value)}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-left hover:bg-white/20 transition-all border-2 border-transparent hover:border-brand-pink group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-3xl font-bold text-white group-hover:text-brand-pink transition-colors">
                        {value.name}
                      </h3>
                      <Target className="text-lime-green group-hover:scale-110 transition-transform" size={32} />
                    </div>

                    <p className="text-parchment text-lg mb-4 leading-relaxed">
                      {value.description}
                    </p>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm text-parchment/80 mb-1 font-semibold">Example Action:</p>
                      <p className="text-white/90 italic">{value.example}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Top 10 Selection Phase */}
          {phase === 'top10' && (
            <motion.div
              key="top10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-6"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-green to-electric-blue flex items-center justify-center mx-auto">
                    <Trophy size={48} className="text-white" />
                  </div>
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-4">Your Top 10 Values</h2>
                <p className="text-xl text-parchment mb-6">
                  Now select your ultimate top 5 core values from these finalists.
                </p>
                <p className="text-brand-pink font-bold text-lg">
                  Selected: {topFive.length} / 5
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                {selectedValues.map((value) => {
                  const isSelected = topFive.find(v => v.name === value.name);
                  return (
                    <motion.button
                      key={value.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleTop5(value)}
                      className={`rounded-2xl p-6 text-left transition-all border-2 ${
                        isSelected
                          ? 'bg-gradient-to-br from-lime-green to-brand-pink border-white shadow-2xl shadow-brand-pink/50'
                          : 'bg-white/10 backdrop-blur-md border-transparent hover:border-electric-blue'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-white">{value.name}</h3>
                        {isSelected && <Sparkles className="text-white" size={24} />}
                      </div>
                      <p className="text-parchment text-sm mb-3">{value.description}</p>
                      <div className="text-xs text-white/70 italic">{value.example}</div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveTopFive}
                  disabled={topFive.length !== 5}
                  className={`px-12 py-4 font-bold text-xl rounded-full shadow-2xl transition-all ${
                    topFive.length === 5
                      ? 'bg-gradient-to-r from-lime-green to-brand-pink text-white hover:shadow-lime-green/50'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {topFive.length === 5 ? 'Save My Top 5 Values' : `Select ${5 - topFive.length} More`}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Complete Phase */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="inline-block mb-8"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-lime-green via-brand-pink to-electric-blue flex items-center justify-center mx-auto">
                  <Trophy size={64} className="text-white" />
                </div>
              </motion.div>

              <h1 className="text-5xl font-bold text-white mb-6">Your Core Values</h1>
              <p className="text-xl text-parchment mb-12 max-w-2xl mx-auto">
                These are your top 5 core values. They represent what matters most to you and will guide your committed actions.
              </p>

              <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto mb-12">
                {topFive.map((value, index) => (
                  <motion.div
                    key={value.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-midnight-purple/80 to-electric-blue/80 backdrop-blur-md rounded-2xl p-8 text-left border-2 border-white/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-brand-pink flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">{index + 1}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{value.name}</h3>
                      </div>
                      <Sparkles className="text-lime-green" size={32} />
                    </div>
                    <p className="text-parchment text-lg mb-4 ml-16">{value.description}</p>
                    <div className="bg-white/10 rounded-xl p-4 ml-16">
                      <p className="text-sm text-brand-pink font-semibold mb-1">Your Committed Action:</p>
                      <p className="text-white italic">{value.example}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-x-4">
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-lime-green to-brand-pink text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-lime-green/50 transition-all"
                  >
                    View Dashboard
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPhase('intro');
                    setTopFive([]);
                    setSelectedValues([]);
                  }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-full border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  Retake Exercise
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ValuesDuel;
