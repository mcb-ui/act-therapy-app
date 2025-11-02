import { useState } from 'react';
import { Target, CheckCircle } from 'lucide-react';

export default function SMARTGoals() {
  const [goal, setGoal] = useState({ specific: '', measurable: '', achievable: '', relevant: '', timeBound: '' });
  const [completed, setCompleted] = useState(false);

  const allFilled = Object.values(goal).every(v => v.trim());

  const generateSMARTGoal = () => {
    return `${goal.specific} - I'll measure success by ${goal.measurable}. This is achievable because ${goal.achievable}. It matters because ${goal.relevant}. I'll complete this by ${goal.timeBound}.`;
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-gradient-to-br from-lime-green to-electric-blue text-white text-center py-12">
          <CheckCircle size={80} className="mx-auto mb-6" />
          <h1 className="text-4xl font-header mb-4">SMART Goal Created!</h1>
        </div>

        <div className="card bg-parchment border-2 border-midnight-purple">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Your SMART Goal</h3>
          <p className="text-lg text-gray-800 font-body leading-relaxed">{generateSMARTGoal()}</p>
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Next Steps</h3>
          <ul className="space-y-2 text-gray-700 font-body">
            <li>• Write this goal down where you'll see it daily</li>
            <li>• Break it into weekly action steps</li>
            <li>• Schedule time in your calendar for these steps</li>
            <li>• Track your progress and adjust as needed</li>
          </ul>
        </div>

        <button onClick={() => window.history.back()} className="btn-primary w-full">Complete Exercise</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-green to-electric-blue flex items-center justify-center">
          <Target size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">SMART Goals</h1>
          <p className="text-gray-600 font-body">Set effective, actionable goals</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">What Makes a Goal SMART?</h3>
        <p className="text-gray-700 font-body">
          SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound. This framework
          transforms vague wishes into concrete action plans.
        </p>
      </div>

      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-electric-blue text-white flex items-center justify-center font-bold">S</div>
            <h3 className="font-subheader uppercase text-midnight-purple">Specific</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2 font-body">What exactly will you do?</p>
          <input
            type="text"
            value={goal.specific}
            onChange={(e) => setGoal({ ...goal, specific: e.target.value })}
            placeholder="e.g., 'Exercise 3 times per week' not just 'get healthy'"
            className="input-field w-full"
          />
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold">M</div>
            <h3 className="font-subheader uppercase text-midnight-purple">Measurable</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2 font-body">How will you know you've succeeded?</p>
          <input
            type="text"
            value={goal.measurable}
            onChange={(e) => setGoal({ ...goal, measurable: e.target.value })}
            placeholder="e.g., 'Completing 30-minute workouts on Mon/Wed/Fri'"
            className="input-field w-full"
          />
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-lime-green text-white flex items-center justify-center font-bold">A</div>
            <h3 className="font-subheader uppercase text-midnight-purple">Achievable</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2 font-body">Why is this realistic for you?</p>
          <input
            type="text"
            value={goal.achievable}
            onChange={(e) => setGoal({ ...goal, achievable: e.target.value })}
            placeholder="e.g., 'I have a gym membership and can wake up 30 min earlier'"
            className="input-field w-full"
          />
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-midnight-purple text-white flex items-center justify-center font-bold">R</div>
            <h3 className="font-subheader uppercase text-midnight-purple">Relevant</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2 font-body">Why does this matter to you? What value does it serve?</p>
          <input
            type="text"
            value={goal.relevant}
            onChange={(e) => setGoal({ ...goal, relevant: e.target.value })}
            placeholder="e.g., 'Health is a core value - I want energy to play with my kids'"
            className="input-field w-full"
          />
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-inferno-red text-white flex items-center justify-center font-bold">T</div>
            <h3 className="font-subheader uppercase text-midnight-purple">Time-Bound</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2 font-body">By when will you achieve this?</p>
          <input
            type="text"
            value={goal.timeBound}
            onChange={(e) => setGoal({ ...goal, timeBound: e.target.value })}
            placeholder="e.g., 'End of next month' or 'December 31st'"
            className="input-field w-full"
          />
        </div>
      </div>

      <button
        onClick={() => setCompleted(true)}
        disabled={!allFilled}
        className="btn-primary w-full disabled:opacity-50"
      >
        Create SMART Goal
      </button>
    </div>
  );
}
