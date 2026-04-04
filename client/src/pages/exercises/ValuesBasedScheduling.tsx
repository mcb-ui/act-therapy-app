import { useState } from 'react';
import { Calendar } from 'lucide-react';
import ExerciseBackButton from '../../components/ExerciseBackButton';

interface ScheduledAction {
  id: string;
  value: string;
  action: string;
  day: string;
  time: string;
  color: string;
}

export default function ValuesBasedScheduling() {
  const [actions, setActions] = useState<ScheduledAction[]>([]);
  const [current, setCurrent] = useState({ value: '', action: '', day: '', time: '' });

  const colors = ['bg-electric-blue', 'bg-brand-pink', 'bg-lime-green', 'bg-midnight-purple', 'bg-inferno-red'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addAction = () => {
    if (current.value && current.action && current.day && current.time) {
      setActions([...actions, { id: Date.now().toString(), ...current, color: colors[actions.length % colors.length] }]);
      setCurrent({ value: '', action: '', day: '', time: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-electric-blue flex items-center justify-center">
          <Calendar size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Values-Based Scheduling</h1>
          <p className="text-gray-600 font-body">Schedule what matters most</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <p className="text-gray-700 font-body">
          If you don't schedule your values, urgent but less important things will fill your time.
          This exercise helps you intentionally block time for what truly matters.
        </p>
      </div>

      <div className="card">
        <h3 className="font-subheader uppercase text-midnight-purple mb-3">Schedule a Valued Action</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={current.value}
            onChange={(e) => setCurrent({ ...current, value: e.target.value })}
            placeholder="Value (e.g., 'Family', 'Health', 'Creativity')"
            className="input-field w-full"
          />
          <input
            type="text"
            value={current.action}
            onChange={(e) => setCurrent({ ...current, action: e.target.value })}
            placeholder="Specific action (e.g., 'Family dinner', 'Morning run')"
            className="input-field w-full"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={current.day}
              onChange={(e) => setCurrent({ ...current, day: e.target.value })}
              className="input-field"
            >
              <option value="">Select day...</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input
              type="time"
              value={current.time}
              onChange={(e) => setCurrent({ ...current, time: e.target.value })}
              className="input-field"
            />
          </div>
          <button
            onClick={addAction}
            disabled={!current.value || !current.action || !current.day || !current.time}
            className="btn-primary w-full disabled:opacity-50"
          >
            Add to Schedule
          </button>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="card">
          <h3 className="font-subheader uppercase text-midnight-purple mb-3">Your Values-Based Week</h3>
          {days.map(day => {
            const dayActions = actions.filter(a => a.day === day);
            return dayActions.length > 0 ? (
              <div key={day} className="mb-4">
                <div className="font-subheader text-sm uppercase text-gray-600 mb-2">{day}</div>
                <div className="space-y-2">
                  {dayActions.map(action => (
                    <div key={action.id} className={`${action.color} bg-opacity-20 border-2 ${action.color.replace('bg-', 'border-')} p-3 rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-body text-gray-800">{action.action}</div>
                          <div className="text-xs text-gray-600">Value: {action.value}</div>
                        </div>
                        <div className={`${action.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                          {action.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })}
        </div>
      )}

      {actions.length >= 3 && (
        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Next Step</h3>
          <p className="text-gray-700 font-body">
            Put these {actions.length} valued actions in your actual calendar right now. Treat them as seriously
            as any other appointment. Your values deserve scheduled time.
          </p>
        </div>
      )}

      <ExerciseBackButton label="Back to Modules" />
    </div>
  );
}
