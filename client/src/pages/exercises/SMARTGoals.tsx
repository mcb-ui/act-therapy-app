import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';
import ExerciseComplete from '../../components/ExerciseComplete';

// User Improvements: #11 completion tracking, #26 ExerciseHeader+FavoriteButton, #45 page title

export default function SMARTGoals() {
  const [goal, setGoal] = useState({ specific: '', measurable: '', achievable: '', relevant: '', timeBound: '' });
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'SMART Goals | ACT Therapy'; }, []);

  const allFilled = Object.values(goal).every(v => v.trim());
  const generateSMARTGoal = () => `${goal.specific} - I'll measure success by ${goal.measurable}. This is achievable because ${goal.achievable}. It matters because ${goal.relevant}. I'll complete this by ${goal.timeBound}.`;

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <ExerciseComplete
          exerciseId="smart-goals"
          exerciseName="SMART Goals"
          title="SMART Goal Created!"
          message="You've created a clear, actionable goal aligned with your values."
          data={goal}
          nextExercise={{ path: '/exercises/barrier-busting', name: 'Barrier Busting' }}
        >
          <div className="card bg-parchment border-2 border-midnight-purple">
            <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Your SMART Goal</h3>
            <p className="text-lg text-gray-800 font-body leading-relaxed">{generateSMARTGoal()}</p>
          </div>
          <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
            <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Next Steps</h3>
            <ul className="space-y-2 text-gray-700 font-body">
              <li>• Write this goal where you'll see it daily</li>
              <li>• Break it into weekly action steps</li>
              <li>• Schedule time in your calendar</li>
              <li>• Track progress and adjust as needed</li>
            </ul>
          </div>
        </ExerciseComplete>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Target size={24} className="text-white" />} title="SMART Goals" subtitle="Set effective, actionable goals" exerciseId="smart-goals" exerciseName="SMART Goals" />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">What Makes a Goal SMART?</h3>
        <p className="text-gray-700 font-body">Specific, Measurable, Achievable, Relevant, and Time-bound.</p>
      </div>

      <div className="space-y-4">
        {[
          { key: 'specific', letter: 'S', label: 'Specific', color: 'bg-electric-blue', question: 'What exactly will you do?', placeholder: "e.g., 'Exercise 3 times per week'" },
          { key: 'measurable', letter: 'M', label: 'Measurable', color: 'bg-brand-pink', question: 'How will you know you succeeded?', placeholder: "e.g., 'Completing 30-minute workouts'" },
          { key: 'achievable', letter: 'A', label: 'Achievable', color: 'bg-lime-green', question: 'Why is this realistic?', placeholder: "e.g., 'I have a gym membership'" },
          { key: 'relevant', letter: 'R', label: 'Relevant', color: 'bg-midnight-purple', question: 'Why does this matter? What value does it serve?', placeholder: "e.g., 'Health is a core value'" },
          { key: 'timeBound', letter: 'T', label: 'Time-Bound', color: 'bg-inferno-red', question: 'By when?', placeholder: "e.g., 'End of next month'" },
        ].map(item => (
          <div key={item.key} className="card">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center font-bold`}>{item.letter}</div>
              <h3 className="font-subheader uppercase text-midnight-purple">{item.label}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2 font-body">{item.question}</p>
            <input type="text" value={goal[item.key as keyof typeof goal]} onChange={(e) => setGoal({ ...goal, [item.key]: e.target.value })} placeholder={item.placeholder} className="input-field w-full" />
          </div>
        ))}
      </div>

      <button onClick={() => setCompleted(true)} disabled={!allFilled} className="btn-primary w-full disabled:opacity-50">Create SMART Goal</button>
    </div>
  );
}
