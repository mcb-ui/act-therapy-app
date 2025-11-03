import { useState } from 'react';
import { ListChecks, Plus, Check, X } from 'lucide-react';

interface Action {
  id: string;
  value: string;
  action: string;
  completed: boolean;
  date: string;
}

export default function CommittedActionTracker() {
  const [actions, setActions] = useState<Action[]>([]);
  const [newAction, setNewAction] = useState({ value: '', action: '' });

  const addAction = () => {
    if (newAction.value && newAction.action) {
      setActions([...actions, {
        id: Date.now().toString(),
        ...newAction,
        completed: false,
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewAction({ value: '', action: '' });
    }
  };

  const toggleAction = (id: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const colors = ['bg-electric-blue', 'bg-brand-pink', 'bg-lime-green', 'bg-midnight-purple', 'bg-inferno-red'];
  const completed = actions.filter(a => a.completed).length;
  const completionRate = actions.length > 0 ? Math.round((completed / actions.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-lime-green flex items-center justify-center">
          <ListChecks size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Committed Action Tracker</h1>
          <p className="text-gray-600 font-body">Track your values-based actions</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <p className="text-gray-700 font-body">
          Committed action means doing what matters even when it's difficult. Track your valued actions to build
          momentum and celebrate progress toward the life you want to live.
        </p>
      </div>

      {actions.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center bg-lime-green bg-opacity-10">
            <div className="text-3xl font-bold text-midnight-purple">{completed}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Completed</div>
          </div>
          <div className="card text-center bg-electric-blue bg-opacity-10">
            <div className="text-3xl font-bold text-midnight-purple">{actions.length - completed}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">In Progress</div>
          </div>
          <div className="card text-center bg-brand-pink bg-opacity-10">
            <div className="text-3xl font-bold text-midnight-purple">{completionRate}%</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Success Rate</div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple mb-3">Add Committed Action</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newAction.value}
            onChange={(e) => setNewAction({ ...newAction, value: e.target.value })}
            placeholder="What value does this serve? (e.g., 'Connection', 'Growth')"
            className="input-field w-full"
          />
          <input
            type="text"
            value={newAction.action}
            onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addAction()}
            placeholder="Specific action you'll take (e.g., 'Call an old friend')"
            className="input-field w-full"
          />
          <button
            onClick={addAction}
            disabled={!newAction.value || !newAction.action}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Plus size={18} />
            <span>Add Action</span>
          </button>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="card">
          <h3 className="font-subheader uppercase text-midnight-purple mb-3">Your Actions ({actions.length})</h3>
          <div className="space-y-2">
            {actions.map((action, idx) => (
              <div
                key={action.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  action.completed
                    ? 'bg-lime-green bg-opacity-10 border-lime-green'
                    : `${colors[idx % colors.length]} bg-opacity-10 ${colors[idx % colors.length].replace('bg-', 'border-')}`
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleAction(action.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      action.completed
                        ? 'bg-lime-green border-lime-green'
                        : 'border-gray-400 hover:border-lime-green'
                    }`}
                  >
                    {action.completed && <Check size={16} className="text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className={`font-body text-gray-800 ${action.completed ? 'line-through opacity-60' : ''}`}>
                      {action.action}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600 font-subheader uppercase">Value: {action.value}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{action.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed >= 3 && (
        <div className="card bg-lime-green text-white">
          <h3 className="font-subheader mb-2 uppercase">Momentum Building! 🎉</h3>
          <p className="font-body">
            You've completed {completed} valued actions. Each action, no matter how small,
            is a step toward the life you want to live. Keep going!
          </p>
        </div>
      )}

      <button onClick={() => window.history.back()} className="btn-secondary w-full">
        Back to Exercises
      </button>
    </div>
  );
}
