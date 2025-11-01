import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Plus, Edit2, Trash2 } from 'lucide-react';

interface Value {
  id: string;
  category: string;
  description: string;
  importance: number;
  alignment: number;
}

export default function ValuesExercise() {
  const [values, setValues] = useState<Value[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    importance: 5,
    alignment: 5,
  });

  const categories = [
    'Family',
    'Relationships',
    'Career',
    'Health',
    'Personal Growth',
    'Community',
    'Spirituality',
    'Recreation',
    'Creativity',
    'Environment',
  ];

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/values', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setValues(response.data);
    } catch (error) {
      console.error('Failed to fetch values:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingId) {
        await axios.put(`/api/values/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/values', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({ category: '', description: '', importance: 5, alignment: 5 });
      setShowForm(false);
      setEditingId(null);
      fetchValues();
    } catch (error) {
      console.error('Failed to save value:', error);
    }
  };

  const handleEdit = (value: Value) => {
    setFormData({
      category: value.category,
      description: value.description,
      importance: value.importance,
      alignment: value.alignment,
    });
    setEditingId(value.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this value?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/values/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchValues();
    } catch (error) {
      console.error('Failed to delete value:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Values Clarification</h1>
            <p className="text-gray-600">Define what truly matters to you</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ category: '', description: '', importance: 5, alignment: 5 });
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Value</span>
        </button>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">What are values?</h3>
        <p className="text-blue-800">
          Values are chosen life directions. They're not goals you can complete, but ongoing
          qualities you want to bring to your actions. For example, "being a loving parent" is
          a value, while "spending an hour with my kids today" is a goal aligned with that value.
        </p>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Value' : 'Add New Value'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Life Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe this value
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="e.g., Being present and supportive with my family..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How important is this? ({formData.importance}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.importance}
                onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How aligned are you currently? ({formData.alignment}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.alignment}
                onChange={(e) => setFormData({ ...formData, alignment: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Value' : 'Add Value'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ category: '', description: '', importance: 5, alignment: 5 });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {values.length === 0 ? (
          <div className="card text-center py-12">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              No values defined yet. Click "Add Value" to get started!
            </p>
          </div>
        ) : (
          values.map((value) => (
            <div key={value.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {value.category}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-4">{value.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Importance</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${value.importance * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {value.importance}/10
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Alignment</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${value.alignment * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {value.alignment}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(value)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(value.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
