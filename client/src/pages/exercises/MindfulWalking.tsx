import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footprints, Play, Pause, CheckCircle } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';

export default function MindfulWalking() {
  useEffect(() => { document.title = 'Mindful Walking | ACT Therapy'; }, []);
  const [currentStep, setCurrentStep] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  const steps = [
    {
      phase: 'Preparation',
      instruction: 'Stand still and notice your body',
      details: 'Feel your feet on the ground. Notice your posture. Take a deep breath.',
      duration: 10,
    },
    {
      phase: 'Lifting',
      instruction: 'Slowly lift your right foot',
      details: 'Notice the sensation of lifting. Feel the shift in weight. Observe the movement.',
      duration: 8,
    },
    {
      phase: 'Moving',
      instruction: 'Move your foot forward',
      details: 'Feel the foot moving through space. Notice any sensations in your leg.',
      duration: 8,
    },
    {
      phase: 'Placing',
      instruction: 'Place your foot down',
      details: 'Feel the heel touch first, then the rest of the foot. Notice the contact with the ground.',
      duration: 8,
    },
    {
      phase: 'Shifting',
      instruction: 'Shift your weight forward',
      details: 'Feel the weight transfer from back foot to front foot. Notice the balance.',
      duration: 8,
    },
    {
      phase: 'Lifting',
      instruction: 'Slowly lift your left foot',
      details: 'Notice the sensation of lifting. Feel the shift in weight. Observe the movement.',
      duration: 8,
    },
    {
      phase: 'Moving',
      instruction: 'Move your foot forward',
      details: 'Feel the foot moving through space. Notice any sensations in your leg.',
      duration: 8,
    },
    {
      phase: 'Placing',
      instruction: 'Place your foot down',
      details: 'Feel the heel touch first, then the rest of the foot. Notice the contact with the ground.',
      duration: 8,
    },
  ];

  useEffect(() => {
    if (isWalking) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isWalking]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps(completedSteps + 1);
    } else {
      // Cycle back to step 1 (after preparation)
      setCurrentStep(1);
      setCompletedSteps(completedSteps + 1);
    }
  };

  const current = steps[currentStep];
  const minutes = Math.floor(sessionTime / 60);
  const seconds = sessionTime % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Footprints size={24} className="text-white" />} title="Mindful Walking" subtitle="Bring awareness to each step" exerciseId="mindful-walking" exerciseName="Mindful Walking" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">About This Practice</h3>
        <p className="text-gray-700 font-body">
          Mindful walking brings full awareness to the simple act of walking. Instead of walking on autopilot,
          you pay attention to each sensation, each movement, each step. This anchors you in the present moment.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center bg-lime-green bg-opacity-10">
          <div className="text-3xl font-bold text-midnight-purple">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs font-subheader uppercase text-gray-600">Session Time</div>
        </div>
        <div className="card text-center bg-electric-blue bg-opacity-10">
          <div className="text-3xl font-bold text-midnight-purple">{completedSteps}</div>
          <div className="text-xs font-subheader uppercase text-gray-600">Steps Taken</div>
        </div>
        <div className="card text-center bg-brand-pink bg-opacity-10">
          <div className="text-3xl">{isWalking ? '🚶' : '🧘'}</div>
          <div className="text-xs font-subheader uppercase text-gray-600">{isWalking ? 'Walking' : 'Still'}</div>
        </div>
      </div>

      {/* Main Practice Card */}
      <div className="card bg-white border-2 border-midnight-purple animate-slide-in-up">
        <div className="text-center mb-6">
          <div className="inline-block bg-lime-green text-white px-4 py-1 rounded-full text-sm font-subheader uppercase mb-4">
            {current.phase}
          </div>
          <h2 className="text-3xl font-header text-midnight-purple mb-2">{current.instruction}</h2>
          <p className="text-gray-700 font-body text-lg">{current.details}</p>
        </div>

        {/* Foot visualization */}
        <div className="flex justify-center items-end space-x-12 my-8">
          <div
            className={`transition-all duration-500 ${
              currentStep % 2 === 1 ? 'transform translate-y-0 scale-110' : 'transform translate-y-4'
            }`}
          >
            <div className="text-7xl">👣</div>
            <div className="text-center text-sm font-body text-gray-600 mt-2">Right</div>
          </div>
          <div
            className={`transition-all duration-500 ${
              currentStep % 2 === 0 && currentStep > 0 ? 'transform translate-y-0 scale-110' : 'transform translate-y-4'
            }`}
          >
            <div className="text-7xl">👣</div>
            <div className="text-center text-sm font-body text-gray-600 mt-2">Left</div>
          </div>
        </div>

        {/* Progress through current cycle */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1 font-body text-gray-600">
            <span>Step Progress</span>
            <span>{currentStep + 1} / {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-lime-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setIsWalking(!isWalking)}
            className="btn-secondary flex items-center space-x-2 flex-1"
          >
            {isWalking ? <Pause size={18} /> : <Play size={18} />}
            <span>{isWalking ? 'Pause' : 'Start'} Practice</span>
          </button>
          <button
            onClick={handleNextStep}
            disabled={!isWalking}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-parchment border-2 border-midnight-purple">
        <h3 className="font-subheader text-midnight-purple mb-3 uppercase">How to Practice</h3>
        <ol className="space-y-2 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-lime-green mr-2 font-bold">1.</span>
            <span>Find a space where you can walk slowly for 10-20 steps (a hallway or room works great)</span>
          </li>
          <li className="flex items-start">
            <span className="text-lime-green mr-2 font-bold">2.</span>
            <span>Walk MUCH slower than normal - this helps you notice sensations you usually miss</span>
          </li>
          <li className="flex items-start">
            <span className="text-lime-green mr-2 font-bold">3.</span>
            <span>Follow each instruction, bringing your full attention to that part of the step</span>
          </li>
          <li className="flex items-start">
            <span className="text-lime-green mr-2 font-bold">4.</span>
            <span>When your mind wanders (and it will!), gently bring attention back to your feet</span>
          </li>
          <li className="flex items-start">
            <span className="text-lime-green mr-2 font-bold">5.</span>
            <span>Practice for 5-10 minutes, or as long as feels comfortable</span>
          </li>
        </ol>
      </div>

      {completedSteps >= 20 && (
        <div className="card bg-lime-green text-white animate-slide-in-up">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle size={32} />
            <h3 className="font-subheader uppercase text-xl">Excellent Practice!</h3>
          </div>
          <p className="font-body mb-3">
            You've completed {completedSteps} mindful steps in {minutes} minutes and {seconds} seconds.
            Notice how it feels to bring this much attention to a simple, everyday activity.
          </p>
          <p className="font-body italic">
            Try bringing this same quality of awareness to other daily activities - eating, washing dishes, brushing teeth.
            Any moment can become a meditation.
          </p>
        </div>
      )}

      <Link to="/" className="btn-secondary w-full">Back to Dashboard</Link>
    </div>
  );
}
