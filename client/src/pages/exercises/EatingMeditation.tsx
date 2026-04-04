import { useState } from 'react';
import { Apple, ChevronRight, CheckCircle } from 'lucide-react';
import ExerciseBackButton from '../../components/ExerciseBackButton';

export default function EatingMeditation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      sense: 'Sight',
      icon: '👁️',
      color: 'bg-electric-blue',
      instruction: 'Look at the food',
      details: 'Before eating, really look at it. Notice the colors, shapes, textures. See it as if for the first time. What do you notice visually?',
      prompts: ['What colors do you see?', 'What is the shape and texture?', 'Notice any reflections or patterns'],
    },
    {
      sense: 'Touch',
      icon: '✋',
      color: 'bg-brand-pink',
      instruction: 'Feel the food',
      details: 'Pick it up. Notice the temperature, weight, texture in your hand. Is it smooth or rough? Heavy or light? Warm or cool?',
      prompts: ['How does the temperature feel?', 'Notice the weight in your hand', 'Explore the texture with your fingers'],
    },
    {
      sense: 'Smell',
      icon: '👃',
      color: 'bg-midnight-purple',
      instruction: 'Smell the food',
      details: 'Bring it close to your nose. Breathe in the aroma. What scents do you notice? Does it trigger any memories or sensations?',
      prompts: ['What aromas do you detect?', 'Does the smell change as you breathe?', 'Notice any reactions in your body'],
    },
    {
      sense: 'Awareness',
      icon: '🧘',
      color: 'bg-lime-green',
      instruction: 'Notice your intention',
      details: 'Before taking a bite, notice the intention to eat. Your hand moving toward your mouth. The anticipation. The preparation.',
      prompts: ['Notice the impulse to eat', 'Feel your arm lifting', 'Observe any anticipation or salivation'],
    },
    {
      sense: 'Taste',
      icon: '👅',
      color: 'bg-inferno-red',
      instruction: 'Take one small bite',
      details: 'Place a small piece in your mouth. Don\'t chew yet - just notice it on your tongue. What taste sensations arise?',
      prompts: ['Notice the first burst of flavor', 'How does it feel on your tongue?', 'Resist the urge to chew immediately'],
    },
    {
      sense: 'Texture',
      icon: '🦷',
      color: 'bg-electric-blue',
      instruction: 'Chew slowly',
      details: 'Begin to chew slowly and deliberately. Notice how the texture changes. How the flavors evolve. Count at least 20 chews.',
      prompts: ['Notice the texture changing', 'How do the flavors develop?', 'Feel the work of chewing'],
    },
    {
      sense: 'Swallowing',
      icon: '💧',
      color: 'bg-brand-pink',
      instruction: 'Notice swallowing',
      details: 'When ready to swallow, notice the intention first. Then feel the sensation of swallowing. Notice the food traveling down.',
      prompts: ['Feel the impulse to swallow', 'Notice the swallowing sensation', 'Trace the food moving down your throat'],
    },
    {
      sense: 'Aftermath',
      icon: '✨',
      color: 'bg-lime-green',
      instruction: 'After effects',
      details: 'Notice what remains. Any lingering tastes? Sensations in your mouth? How does your body feel after this one mindful bite?',
      prompts: ['What tastes linger?', 'How does your mouth feel?', 'Notice any changes in your body'],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-lime-green text-white text-center py-12">
          <CheckCircle size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">Mindful Eating Complete</h1>
          <p className="text-xl opacity-90 font-body">You've just eaten one bite mindfully</p>
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Reflection</h3>
          <p className="text-gray-700 font-body mb-3">
            That one bite probably took several minutes - much longer than usual! You may have noticed
            flavors, textures, and sensations you've never noticed before, even in familiar foods.
          </p>
          <p className="text-gray-700 font-body mb-2">
            <strong>Key insights from this practice:</strong>
          </p>
          <ul className="space-y-2 text-gray-700 font-body">
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Most of the time, we eat on autopilot, barely tasting our food</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>When we slow down and pay attention, ordinary experiences become rich and interesting</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>This quality of attention can be brought to any moment of life</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Mindfulness isn't about thinking - it's about experiencing through your senses</span>
            </li>
          </ul>
        </div>

        <div className="card bg-parchment border-2 border-midnight-purple">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Take It Further</h3>
          <p className="text-gray-700 font-body">
            Try eating one meal this week with this level of awareness. You don't need to be this slow
            with every bite, but see what happens when you bring more attention to eating. You might
            enjoy your food more, eat less, or simply feel more present.
          </p>
        </div>

        <ExerciseBackButton label="Complete Exercise" variant="primary" />
      </div>
    );
  }

  const current = steps[currentStep];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-midnight-purple flex items-center justify-center">
          <Apple size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Eating Meditation</h1>
          <p className="text-gray-600 font-body">Experience one mindful bite</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Preparation</h3>
        <p className="text-gray-700 font-body">
          Choose a small piece of food (a raisin, grape, piece of chocolate, or nut works well).
          Find a quiet place where you won't be disturbed. This exercise explores eating with complete awareness.
        </p>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-subheader uppercase text-midnight-purple">Progress</span>
          <span className="font-body text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-lime-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Step Card */}
      <div className="card bg-white border-2 border-midnight-purple animate-slide-in-up">
        <div className="text-center mb-6">
          <div className={`inline-block ${current.color} text-white px-4 py-1 rounded-full text-sm font-subheader uppercase mb-4`}>
            {current.sense}
          </div>
          <div className="text-7xl mb-4">{current.icon}</div>
          <h2 className="text-3xl font-header text-midnight-purple mb-2">{current.instruction}</h2>
          <p className="text-lg text-gray-700 font-body leading-relaxed">{current.details}</p>
        </div>

        <div className="bg-electric-blue bg-opacity-5 rounded-lg p-4 mb-6">
          <h4 className="font-subheader uppercase text-midnight-purple text-sm mb-2">Explore:</h4>
          <ul className="space-y-1 text-gray-700 font-body text-sm">
            {current.prompts.map((prompt, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-lime-green mr-2">•</span>
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center space-x-2">
            <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* All Steps Overview */}
      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple text-sm mb-3">Practice Steps</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`p-2 rounded-lg text-center transition-all ${
                idx === currentStep
                  ? `${step.color} text-white scale-110`
                  : idx < currentStep
                  ? 'bg-lime-green bg-opacity-20 text-lime-green'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <div className="text-2xl">{step.icon}</div>
              <div className="text-xs mt-1">{idx + 1}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
