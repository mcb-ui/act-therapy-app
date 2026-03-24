import { useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #13 completion tracking, #28 ExerciseHeader+FavoriteButton, #45 page title

export default function Expansion() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Expansion Exercise | ACT Therapy'; }, []);

  const steps = [
    { title: 'Notice the Feeling', instruction: 'Bring to mind something that triggers a difficult emotion. Notice where you feel it in your body.', body: 'Scan your body. Where do you notice tension, tightness, heaviness, or discomfort? Do not try to change it - just notice.' },
    { title: 'Breathe Into It', instruction: 'Imagine breathing into and around the sensation.', body: 'As you breathe in, imagine the breath flowing to that area. Not to fight it or push it away, but to make space for it.' },
    { title: 'Make Space', instruction: 'Open up and make room for the sensation.', body: 'Instead of tensing around it, soften. Imagine the feeling has all the space it needs. You are not trying to like it - just making room.' },
    { title: 'Allow', instruction: 'Allow it to be there, exactly as it is.', body: 'Stop fighting. Let it be. This does not mean you want it. It means you are willing to have it while you do what matters.' },
  ];

  const current = steps[step];

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto">
        <ExerciseComplete
          exerciseId="expansion"
          exerciseName="Expansion Exercise"
          title="Expansion Complete"
          message="You practiced all 4 steps of expansion. This is a powerful skill you can use anytime."
          data={{ stepsCompleted: steps.length }}
          nextExercise={{ path: '/exercises/emotional-surfing', name: 'Emotional Surfing' }}
        >
          <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
            <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Practice Tips</h3>
            <ul className="space-y-2 text-gray-700 font-body text-sm">
              <li>• Practice with mild emotions first, then work up to stronger ones</li>
              <li>• This isn't about making feelings go away - it's about changing your relationship with them</li>
              <li>• You can expand around a feeling while still taking valued action</li>
            </ul>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Maximize2 size={24} className="text-white" />} title="Expansion Exercise" subtitle="Make space for difficult feelings" exerciseId="expansion" exerciseName="Expansion Exercise" />

      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-subheader uppercase text-midnight-purple">Progress</span>
          <span className="font-body text-gray-600">Step {step + 1} of {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-brand-pink h-2 rounded-full transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
        </div>

        <div className="text-center mb-6">
          <div className="mx-auto mb-4 rounded-full bg-brand-pink bg-opacity-20 flex items-center justify-center transition-all animate-pulse-slow" style={{ width: `${(step + 1) * 50}px`, height: `${(step + 1) * 50}px` }}>
            <div className="rounded-full bg-brand-pink bg-opacity-40 flex items-center justify-center" style={{ width: `${(step + 1) * 35}px`, height: `${(step + 1) * 35}px` }}>
              <Maximize2 size={24} className="text-brand-pink" />
            </div>
          </div>
          <h2 className="text-2xl font-header text-midnight-purple mb-2">{current.title}</h2>
          <p className="text-lg text-gray-700 font-body mb-4">{current.instruction}</p>
          <div className="bg-parchment p-4 rounded-lg">
            <p className="text-gray-800 font-body">{current.body}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-secondary">← Back</button>}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">Next Step →</button>
          ) : (
            <button onClick={() => setCompleted(true)} className="btn-primary flex-1">Save & Complete Exercise</button>
          )}
        </div>
      </div>
    </div>
  );
}
