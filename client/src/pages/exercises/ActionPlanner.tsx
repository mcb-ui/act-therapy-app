import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CheckSquare, Plus, Check, X, Calendar } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';

interface Action {
  id: string;
  valueId?: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
}

interface Value {
  id: string;
  category: string;
  description: string;
}

export default function ActionPlanner() {
  const [actions, setActions] = useState<Action[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    valueId: '',
    dueDate: '',
  });

  useEffect(() => { document.title = 'Action Planner | ACT Therapy'; }, []);

  useEffect(() => {
    fetchActions();
    fetchValues();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await api.get('/actions');
      setActions(response.data);
    } catch (error) {
      console.error('Failed to fetch actions:', error);
    }
  };

  const fetchValues = async () => {
    try {
      const response = await api.get('/values');
      setValues(response.data);
    } catch (error) {
      console.error('Failed to fetch values:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/actions', formData);
      setFormData({ title: '', description: '', valueId: '', dueDate: '' });
      setShowForm(false);
      fetchActions();
    } catch (error) {
      console.error('Failed to create action:', error);
    }
  };

  const toggleComplete = async (action: Action) => {
    try {
      await api.put(`/actions/${action.id}`, { ...action, completed: !action.completed });
      fetchActions();
    } catch (error) {
      console.error('Failed to update action:', error);
    }
  };

  const deleteAction = async (id: string) => {
    if (!confirm('Delete this action?')) return;
    try {
      await api.delete(`/actions/${id}`);
      fetchActions();
    } catch (error) {
      console.error('Failed to delete action:', error);
    }
  };

  const getValueForAction = (valueId?: string) => {
    return values.find((v) => v.id === valueId);
  };

  const pendingActions = actions.filter((a) => !a.completed);
  const completedActions = actions.filter((a) => a.completed);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ExerciseHeader icon={<CheckSquare size={24} className="text-white" />} title="Committed Action" subtitle="Take steps aligned with your values" exerciseId="action-planner" exerciseName="Action Planner" />

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Action</span>
        </button>
      </div>

      <div className="card bg-green-50 border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">What is Committed Action?</h3>
        <p className="text-green-800">
          Committed action means taking effective action guided by your values. It's not about
          perfection - it's about consistently taking steps in valued directions, learning from
          experience, and adjusting as needed.
        </p>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Action</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Value (Optional)
              </label>
              <select
                value={formData.valueId}
                onChange={(e) => setFormData({ ...formData, valueId: e.target.value })}
                className="input-field"
              >
                <option value="">Not linked to a specific value</option>
                {values.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.category} - {value.description.substring(0, 50)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="e.g., Call a friend I haven't spoken to..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={2}
                placeholder="Any additional details or notes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Action
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', description: '', valueId: '', dueDate: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Active Actions ({pendingActions.length})
        </h2>
        {pendingActions.length === 0 ? (
          <div className="card text-center py-8">
            <CheckSquare size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No active actions. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingActions.map((action) => {
              const linkedValue = getValueForAction(action.valueId);
              return (
                <div key={action.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleComplete(action)}
                      className="mt-1 w-6 h-6 border-2 border-green-500 rounded flex items-center justify-center hover:bg-green-50"
                    >
                      {action.completed && <Check size={16} className="text-green-600" />}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      {action.description && (
                        <p className="text-gray-600 text-sm mb-2">{action.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        {linkedValue && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {linkedValue.category}
                          </span>
                        )}
                        {action.dueDate && (
                          <span className="flex items-center text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            {new Date(action.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAction(action.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {completedActions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Completed ({completedActions.length})
          </h2>
          <div className="space-y-3">
            {completedActions.map((action) => {
              const linkedValue = getValueForAction(action.valueId);
              return (
                <div key={action.id} className="card bg-gray-50 opacity-75">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleComplete(action)}
                      className="mt-1 w-6 h-6 bg-green-500 rounded flex items-center justify-center"
                    >
                      <Check size={16} className="text-white" />
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-600 line-through mb-1">
                        {action.title}
                      </h3>
                      {linkedValue && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {linkedValue.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteAction(action.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Tips for Committed Action:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>Make actions specific and achievable</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>Link actions to your values to stay motivated</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>If you don't complete an action, learn from it and try again</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>Focus on what you can control, not outcomes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
