import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Plus, Trash2, CheckCircle } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';

interface ValueAction {
  id: string;
  value: string;
  actions: string[];
}

export default function ValuesInAction() {
  const [valueActions, setValueActions] = useState<ValueAction[]>([
    { id: '1', value: '', actions: [''] },
  ]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { document.title = 'Values in Action | ACT Therapy'; }, []);

  const updateValue = (id: string, value: string) => {
    setValueActions(valueActions.map(va =>
      va.id === id ? { ...va, value } : va
    ));
  };

  const updateAction = (id: string, index: number, action: string) => {
    setValueActions(valueActions.map(va =>
      va.id === id ? {
        ...va,
        actions: va.actions.map((a, i) => i === index ? action : a)
      } : va
    ));
  };

  const addAction = (id: string) => {
    setValueActions(valueActions.map(va =>
      va.id === id ? { ...va, actions: [...va.actions, ''] } : va
    ));
  };

  const removeAction = (id: string, index: number) => {
    setValueActions(valueActions.map(va =>
      va.id === id ? {
        ...va,
        actions: va.actions.filter((_, i) => i !== index)
      } : va
    ));
  };

  const addValueSet = () => {
    const newId = (parseInt(valueActions[valueActions.length - 1].id) + 1).toString();
    setValueActions([...valueActions, { id: newId, value: '', actions: [''] }]);
  };

  const removeValueSet = (id: string) => {
    if (valueActions.length > 1) {
      setValueActions(valueActions.filter(va => va.id !== id));
    }
  };

  const handleComplete = () => {
    setCompleted(true);
  };

  const colors = ['bg-electric-blue', 'bg-brand-pink', 'bg-lime-green', 'bg-midnight-purple', 'bg-inferno-red'];

  if (completed) {
    const filledValues = valueActions.filter(va => va.value && va.actions.some(a => a.trim()));

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-electric-blue text-white text-center py-12">
          <Zap size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">Values in Action</h1>
          <p className="text-xl opacity-90 font-body">Your action plan for living your values</p>
        </div>

        <div className="space-y-6">
          {filledValues.map((va, idx) => (
            <div
              key={va.id}
              className="card animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${colors[idx % colors.length]} flex items-center justify-center flex-shrink-0`}>
                  <Zap size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-header text-midnight-purple">{va.value}</h2>
              </div>

              <div className="space-y-3 ml-15">
                <h3 className="font-subheader uppercase text-gray-600 text-sm mb-2">Action Steps:</h3>
                {va.actions.filter(a => a.trim()).map((action, actionIdx) => (
                  <div
                    key={actionIdx}
                    className="flex items-start space-x-3 animate-slide-in-up"
                    style={{ animationDelay: `${(idx * 0.1) + (actionIdx * 0.05)}s` }}
                  >
                    <CheckCircle size={20} className="text-lime-green flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 font-body flex-1">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Take Action This Week</h3>
          <p className="text-gray-700 font-body mb-3">
            You've identified concrete ways to live your values. Now it's time to commit!
          </p>
          <ul className="space-y-2 text-gray-700 font-body">
            <li className="flex items-start">
              <span className="text-lime-green mr-2">•</span>
              <span>Choose ONE action from your list to complete this week</span>
            </li>
            <li className="flex items-start">
              <span className="text-lime-green mr-2">•</span>
              <span>Schedule it in your calendar - treat it like an important appointment</span>
            </li>
            <li className="flex items-start">
              <span className="text-lime-green mr-2">•</span>
              <span>Notice how taking values-based action affects your sense of meaning and purpose</span>
            </li>
          </ul>
        </div>

        <Link to="/" className="btn-primary w-full">
          Complete Exercise
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader
        icon={<Zap size={24} className="text-white" />}
        title="Values in Action"
        subtitle="Connect values to concrete actions"
        exerciseId="values-in-action"
        exerciseName="Values in Action"
      />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Instructions</h3>
        <p className="text-gray-700 font-body">
          For each value that's important to you, write 2-5 specific actions you could take to live that value more fully.
          Be concrete! Instead of "be healthier," try "go for a 20-minute walk 3x per week."
        </p>
      </div>

      <div className="space-y-6">
        {valueActions.map((va, idx) => (
          <div
            key={va.id}
            className="card hover-lift animate-slide-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-full ${colors[idx % colors.length]} flex items-center justify-center flex-shrink-0 animate-pulse-slow`}>
                <Zap size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={va.value}
                  onChange={(e) => updateValue(va.id, e.target.value)}
                  placeholder="Enter a value (e.g., Family, Health, Creativity)"
                  className="input-field w-full text-lg font-subheader"
                />
              </div>
              {valueActions.length > 1 && (
                <button
                  onClick={() => removeValueSet(va.id)}
                  className="p-2 text-inferno-red hover:bg-inferno-red hover:text-white rounded-lg transition-all"
                  title="Remove this value"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="ml-15 space-y-3">
              <h3 className="font-subheader uppercase text-gray-600 text-sm">Action Steps:</h3>
              {va.actions.map((action, actionIdx) => (
                <div key={actionIdx} className="flex items-start space-x-2">
                  <span className="text-midnight-purple font-bold mt-2 flex-shrink-0">{actionIdx + 1}.</span>
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => updateAction(va.id, actionIdx, e.target.value)}
                    placeholder="Specific action you could take..."
                    className="input-field flex-1"
                  />
                  {va.actions.length > 1 && (
                    <button
                      onClick={() => removeAction(va.id, actionIdx)}
                      className="p-2 text-gray-400 hover:text-inferno-red transition-all mt-1"
                      title="Remove action"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              {va.actions.length < 5 && (
                <button
                  onClick={() => addAction(va.id)}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                >
                  <Plus size={16} />
                  <span>Add Action</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addValueSet}
        className="btn-secondary w-full flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Another Value</span>
      </button>

      <button
        onClick={handleComplete}
        disabled={!valueActions.some(va => va.value && va.actions.some(a => a.trim()))}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        View Action Plan
      </button>
    </div>
  );
}
