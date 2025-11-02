import { BookOpen, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function IntroACT() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completed, setCompleted] = useState(false);

  const sections = [
    {
      title: 'What is ACT?',
      content: 'Acceptance and Commitment Therapy (ACT) is an evidence-based psychological intervention that helps you create a rich and meaningful life while accepting the pain that inevitably comes with it.',
      image: '🧠',
    },
    {
      title: 'The Goal',
      content: 'ACT aims to help you develop psychological flexibility - the ability to stay in contact with the present moment and, based on what the situation affords, change or persist in behavior in the service of chosen values.',
      image: '🎯',
    },
    {
      title: 'Six Core Processes',
      content: 'ACT uses six core therapeutic processes: Acceptance, Cognitive Defusion, Being Present, Self-as-Context, Values, and Committed Action. Together, these create psychological flexibility.',
      image: '⬡',
    },
    {
      title: 'How ACT Helps',
      content: 'Instead of trying to eliminate difficult thoughts and feelings, ACT teaches you to change your relationship with them. You learn to make room for painful feelings and thoughts, and move forward with your life.',
      image: '💪',
    },
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-gradient-to-br from-lime-green to-electric-blue text-white text-center py-16 animate-slide-in-up">
          <CheckCircle size={80} className="mx-auto mb-6" />
          <h1 className="text-4xl font-header mb-4">Great Start!</h1>
          <p className="text-xl font-body mb-8 opacity-90">
            You've completed the introduction to ACT
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-white text-electric-blue px-8 py-3 rounded-lg font-subheader uppercase hover:scale-105 transition-all"
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue to-midnight-purple flex items-center justify-center">
          <BookOpen size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Introduction to ACT</h1>
          <p className="text-gray-600 font-body">Learn the foundations of ACT therapy</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-subheader uppercase text-midnight-purple">Progress</span>
          <span className="font-body text-gray-600">
            {currentSection + 1} / {sections.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-electric-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="card animate-slide-in-up">
        <div className="text-center mb-6">
          <div className="text-7xl mb-4">{sections[currentSection].image}</div>
          <h2 className="text-3xl font-header text-midnight-purple mb-4">
            {sections[currentSection].title}
          </h2>
        </div>
        <p className="text-lg text-gray-700 font-body leading-relaxed mb-8">
          {sections[currentSection].content}
        </p>
        <button onClick={handleNext} className="btn-primary w-full">
          {currentSection === sections.length - 1 ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
