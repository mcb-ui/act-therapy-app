import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Plus, Target, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/ConfirmDialog';
import ExerciseShell from '../../components/ExerciseShell';
import { useAppToast } from '../../contexts/ToastContext';
import { useExerciseDraft } from '../../hooks/useExerciseDraft';
import { api, getApiErrorMessage } from '../../lib/api';

interface ValueRecord {
  id: string;
  category: string;
  description: string;
  importance: number;
  alignment: number;
}

const emptyForm = {
  category: '',
  description: '',
  importance: 5,
  alignment: 5,
};

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

const sortValues = (values: ValueRecord[]) =>
  [...values].sort((left, right) => {
    if (right.importance !== left.importance) {
      return right.importance - left.importance;
    }

    return left.alignment - right.alignment;
  });

export default function ValuesExercise() {
  const { success, error: showError } = useAppToast();
  const [values, setValues] = useState<ValueRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<ValueRecord | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const {
    value: formData,
    setValue: setFormData,
    clearDraft,
    draftStatus,
    hasStoredDraft,
  } = useExerciseDraft('act-values-form-draft', emptyForm);

  useEffect(() => {
    void fetchValues();
  }, []);

  useEffect(() => {
    if (hasStoredDraft) {
      setShowForm(true);
    }
  }, [hasStoredDraft]);

  useEffect(() => {
    if (showForm) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showForm]);

  const fetchValues = async () => {
    setIsLoading(true);

    try {
      const response = await api.get<ValueRecord[]>('/values');
      setValues(sortValues(response.data));
    } catch (err) {
      showError(getApiErrorMessage(err, 'Could not load your values.'));
    } finally {
      setIsLoading(false);
    }
  };

  const valuesSummary = useMemo(() => {
    if (values.length === 0) {
      return null;
    }

    const totalImportance = values.reduce((sum, value) => sum + value.importance, 0);
    const totalAlignment = values.reduce((sum, value) => sum + value.alignment, 0);
    const biggestGap = [...values].sort(
      (left, right) =>
        right.importance - right.alignment - (left.importance - left.alignment)
    )[0];

    return {
      count: values.length,
      averageImportance: (totalImportance / values.length).toFixed(1),
      averageAlignment: (totalAlignment / values.length).toFixed(1),
      biggestGap,
    };
  }, [values]);

  const resetForm = () => {
    clearDraft();
    setEditingId(null);
    setShowForm(false);
  };

  const openFreshForm = () => {
    if (editingId) {
      setEditingId(null);
      setFormData(emptyForm);
      clearDraft();
    }

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
        const response = await api.put<ValueRecord>(`/values/${editingId}`, formData);
        setValues((current) =>
          sortValues(current.map((value) => (value.id === editingId ? response.data : value)))
        );
        success('Value updated.');
      } else {
        const response = await api.post<ValueRecord>('/values', formData);
        setValues((current) => sortValues([response.data, ...current]));
        success('Value added.');
      }

      resetForm();
    } catch (err) {
      showError(getApiErrorMessage(err, 'Could not save this value.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (value: ValueRecord) => {
    setFormData({
      category: value.category,
      description: value.description,
      importance: value.importance,
      alignment: value.alignment,
    });
    setEditingId(value.id);
    setShowForm(true);
  };

  const restoreDeletedValue = async (value: ValueRecord) => {
    try {
      const response = await api.post<ValueRecord>('/values', {
        category: value.category,
        description: value.description,
        importance: value.importance,
        alignment: value.alignment,
      });
      setValues((current) => sortValues([response.data, ...current]));
      success('Value restored.');
    } catch (err) {
      showError(getApiErrorMessage(err, 'Could not restore this value.'));
    }
  };

  const confirmDelete = async () => {
    if (!valueToDelete) {
      return;
    }

    const deletedValue = valueToDelete;
    setValueToDelete(null);
    setValues((current) => current.filter((value) => value.id !== deletedValue.id));

    try {
      await api.delete(`/values/${deletedValue.id}`);
      success('Value deleted.', {
        actionLabel: 'Undo',
        duration: 7000,
        onAction: async () => restoreDeletedValue(deletedValue),
      });
    } catch (err) {
      setValues((current) => sortValues([deletedValue, ...current]));
      showError(getApiErrorMessage(err, 'Could not delete this value.'));
    }
  };

  const footer = (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between">
      <button
        type="button"
        onClick={showForm ? resetForm : openFreshForm}
        className="btn-primary md:min-w-[13rem]"
      >
        {showForm ? 'Close Value Form' : 'Add or Edit Values'}
      </button>
      <Link
        to="/exercises/action"
        className="btn-secondary text-center md:min-w-[13rem]"
      >
        Turn Values Into Action
      </Link>
    </div>
  );

  return (
    <>
      <ExerciseShell
        exerciseId="values"
        estimatedDuration="12 min"
        intro="Clarify what you want to stand for, then notice the gap between what matters and how daily life is actually unfolding."
        whyItMatters="Values are directions, not finish lines. When you know what matters most, difficult thoughts and feelings stop deciding the whole day for you."
        draftStatus={draftStatus}
        headerActions={
          <button
            type="button"
            onClick={showForm ? resetForm : openFreshForm}
            className="btn-primary"
          >
            <span className="inline-flex items-center gap-2">
              <Plus size={18} />
              {showForm ? 'Close Form' : 'Add Value'}
            </span>
          </button>
        }
        footer={footer}
      >
        {valuesSummary && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card">
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Values Logged
              </p>
              <p className="mt-2 font-header text-4xl text-midnight-purple">{valuesSummary.count}</p>
            </div>
            <div className="card">
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Average Importance
              </p>
              <p className="mt-2 font-header text-4xl text-midnight-purple">
                {valuesSummary.averageImportance}
              </p>
            </div>
            <div className="card">
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Biggest Gap
              </p>
              <p className="mt-2 font-subheader text-sm uppercase text-midnight-purple">
                {valuesSummary.biggestGap.category}
              </p>
              <p className="mt-1 font-body text-sm text-gray-600">
                {valuesSummary.biggestGap.importance - valuesSummary.biggestGap.alignment} point gap
              </p>
            </div>
          </div>
        )}

        {showForm && (
          <div ref={formRef} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-subheader text-xs uppercase tracking-[0.18em] text-electric-blue">
                  Working Draft
                </p>
                <h2 className="mt-2 font-subheader text-xl uppercase text-midnight-purple">
                  {editingId ? 'Edit Value' : 'Add a new value'}
                </h2>
              </div>
              {hasStoredDraft && !editingId ? (
                <span className="rounded-full bg-midnight-purple/5 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  Draft resumed
                </span>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                  Life category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((current) => ({ ...current, category: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                  Describe this value
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, description: e.target.value }))
                  }
                  className="input-field"
                  rows={4}
                  placeholder="e.g. Being present, encouraging, and emotionally available with my family."
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-midnight-purple/5 p-4">
                  <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                    Importance {formData.importance}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.importance}
                    onChange={(e) =>
                      setFormData((current) => ({
                        ...current,
                        importance: Number.parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-electric-blue"
                  />
                </div>

                <div className="rounded-2xl bg-midnight-purple/5 p-4">
                  <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                    Current alignment {formData.alignment}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.alignment}
                    onChange={(e) =>
                      setFormData((current) => ({
                        ...current,
                        alignment: Number.parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-lime-green"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update Value' : 'Add Value'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-[1.5rem] bg-white/70 shadow-lg" />
            ))}
          </div>
        ) : values.length === 0 ? (
          <div className="card py-12 text-center">
            <Target size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="font-body text-gray-600">
              No values defined yet. Add one value to start building a clearer direction.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {values.map((value) => {
              const gap = value.importance - value.alignment;

              return (
                <div key={value.id} className="card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-electric-blue/10 px-3 py-1 text-xs font-subheader uppercase tracking-[0.16em] text-electric-blue">
                          {value.category}
                        </span>
                        <span className="rounded-full bg-midnight-purple/5 px-3 py-1 text-xs font-subheader uppercase tracking-[0.16em] text-gray-500">
                          Gap {gap}
                        </span>
                      </div>
                      <p className="font-body leading-7 text-gray-700">{value.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(value)}
                        className="rounded-2xl p-3 text-electric-blue transition hover:bg-electric-blue/10"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setValueToDelete(value)}
                        className="rounded-2xl p-3 text-inferno-red transition hover:bg-inferno-red/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center justify-between font-body text-sm text-gray-600">
                        <span>Importance</span>
                        <span>{value.importance}/10</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-100">
                        <div
                          className="h-3 rounded-full bg-electric-blue"
                          style={{ width: `${value.importance * 10}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between font-body text-sm text-gray-600">
                        <span>Current alignment</span>
                        <span>{value.alignment}/10</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-100">
                        <div
                          className="h-3 rounded-full bg-lime-green"
                          style={{ width: `${value.alignment * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="card bg-midnight-purple/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Next Step
              </p>
              <h2 className="mt-2 font-header text-2xl text-midnight-purple">
                Convert insight into one real commitment.
              </h2>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-gray-600">
                Values become useful when they shape behavior. Once this feels clear enough, open the action planner and make one small next move.
              </p>
            </div>
            <Link to="/exercises/action" className="btn-secondary text-center">
              Open Committed Action
            </Link>
          </div>
        </div>
      </ExerciseShell>

      <ConfirmDialog
        open={Boolean(valueToDelete)}
        title="Delete this value?"
        description="Deleting a value removes it from your dashboard and action planning context. You can still undo right after deletion."
        confirmLabel="Delete Value"
        tone="danger"
        onCancel={() => setValueToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
