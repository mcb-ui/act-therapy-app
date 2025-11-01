import { useState } from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function AcceptanceExercise() {
  const [currentStep, setCurrentStep] = useState(0);
  const [emotion, setEmotion] = useState('');
  const [resistance, setResistance] = useState(5);
  const [willingness, setWillingness] = useState(5);
  const [completed, setCompleted] = useState(false);

  const metaphors = [
    {
      title: 'The Quicksand Metaphor',
      content:
        "Struggling in quicksand only makes you sink faster. The same is true with difficult emotions - the more we fight them, the more stuck we become. Acceptance means stopping the struggle, staying still, and allowing the emotion to be there.",
    },
    {
      title: 'The Beach Ball Metaphor',
      content:
        "Imagine trying to hold a beach ball underwater at a pool party. It takes enormous effort, and the moment you relax, it pops up anyway - often hitting you in the face! Accepting emotions is like letting the ball float - it's there, but it's not a problem.",
    },
    {
      title: 'The Unwanted Party Guest',
      content:
        "Difficult emotions are like unwanted guests at a party. You can spend all your energy trying to force them out the door, or you can acknowledge they're there and continue enjoying your party. Acceptance doesn't mean you like them - it means you stop fighting them.",
    },
  ];

  const steps = [
    {
      title: 'Identify the Emotion',
      content: 'What difficult emotion or experience are you dealing with right now?',
      component: (
        <div>
          <textarea
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="input-field"
            rows={4}
            placeholder="Describe the emotion, physical sensation, or experience..."
          />
        </div>
      ),
    },
    {
      title: 'Notice Resistance',
      content: 'How much are you struggling against or trying to avoid this experience?',
      component: (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resistance Level: {resistance}/10
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={resistance}
              onChange={(e) => setResistance(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No resistance</span>
              <span>Maximum resistance</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Notice: Is struggling against this emotion helping or making it worse?
          </p>
        </div>
      ),
    },
    {
      title: 'Explore Metaphors',
      content: 'These metaphors illustrate how acceptance works:',
      component: (
        <div className="space-y-4">
          {metaphors.map((metaphor, index) => (
            <div key={index} className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h4 className="font-semibold text-pink-900 mb-2">{metaphor.title}</h4>
              <p className="text-pink-800 text-sm">{metaphor.content}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Practice Willingness',
      content: 'How willing are you to make room for this experience?',
      component: (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Willingness Level: {willingness}/10
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={willingness}
              onChange={(e) => setWillingness(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Not willing</span>
              <span>Completely willing</span>
            </div>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <p className="text-pink-900 font-medium mb-2">Willingness Statement:</p>
            <p className="text-pink-800">
              "I'm willing to have this {emotion || 'experience'}, just as it is, not as I wish
              it to be, so that I can continue moving toward what matters to me."
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setCompleted(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/progress',
        {
          exerciseId: 'acceptance-exercise',
          completed: true,
          notes: `Emotion: ${emotion}, Resistance: ${resistance}, Willingness: ${willingness}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setEmotion('');
    setResistance(5);
    setWillingness(5);
    setCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
          <Heart size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acceptance</h1>
          <p className="text-gray-600">Make room for difficult experiences</p>
        </div>
      </div>

      <div className="card bg-pink-50 border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-2">What is Acceptance?</h3>
        <p className="text-pink-800">
          Acceptance means opening up and making room for difficult feelings, sensations,
          thoughts, and urges - allowing them to come and go without struggling with them.
          It's not about liking or wanting them, but about dropping the struggle.
        </p>
      </div>

      {!completed ? (
        <>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {steps.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        index === currentStep
                          ? 'bg-pink-600 text-white'
                          : index < currentStep
                          ? 'bg-pink-200 text-pink-800'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 ${
                          index < currentStep ? 'bg-pink-200' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 mb-6">{steps[currentStep].content}</p>

            <div className="mb-6">{steps[currentStep].component}</div>

            <div className="flex justify-between">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-secondary"
                >
                  Previous
                </button>
              )}
              <button onClick={handleNext} className="btn-primary ml-auto flex items-center space-x-2">
                <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="card bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-12">
          <Heart size={64} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Exercise Complete!</h2>
          <p className="text-pink-100 mb-6 max-w-md mx-auto">
            Remember: Acceptance is a practice, not a one-time event. Keep coming back to
            willingness whenever you notice yourself struggling.
          </p>
          <button onClick={handleReset} className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50">
            Start New Practice
          </button>
        </div>
      )}

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Key Points About Acceptance:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-pink-600 mr-2">•</span>
            <span>Acceptance is not approval, liking, or wanting</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-600 mr-2">•</span>
            <span>It's about letting go of the struggle, not letting go of yourself</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-600 mr-2">•</span>
            <span>Pain is inevitable; suffering (struggling with pain) is optional</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-600 mr-2">•</span>
            <span>Willingness is something you practice moment by moment</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
