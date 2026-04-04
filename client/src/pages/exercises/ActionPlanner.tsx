import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Check, CheckSquare, Plus, X } from 'lucide-react';
import ConfirmDialog from '../../components/ConfirmDialog';
import ExerciseShell from '../../components/ExerciseShell';
import { useAppToast } from '../../contexts/ToastContext';
import { useExerciseDraft } from '../../hooks/useExerciseDraft';
import { api, getApiErrorMessage } from '../../lib/api';

interface ActionRecord {
  id: string;
  valueId?: string | null;
  title: string;
  description?: string | null;
  completed: boolean;
  dueDate?: string | null;
}

interface ValueRecord {
  id: string;
  category: string;
  description: string;
}

const emptyForm = {
  title: '',
  description: '',
  valueId: '',
  dueDate: '',
};

const isOverdue = (dueDate: string | null | undefined) => {
  if (!dueDate) {
    return false;
  }

  return new Date(dueDate).getTime() < Date.now();
};

export default function ActionPlanner() {
  const { success, error: showError } = useAppToast();
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [values, setValues] = useState<ValueRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<ActionRecord | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const {
    value: formData,
    setValue: setFormData,
    clearDraft,
    draftStatus,
    hasStoredDraft,
  } = useExerciseDraft('act-action-form-draft', emptyForm);

  useEffect(() => {
    void fetchData();
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

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const [actionsResponse, valuesResponse] = await Promise.all([
        api.get<ActionRecord[]>('/actions'),
        api.get<ValueRecord[]>('/values'),
      ]);
      setActions(actionsResponse.data);
      setValues(valuesResponse.data);
    } catch (err) {
      showError(getApiErrorMessage(err, 'Could not load your action planner.'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    clearDraft();
    setShowForm(false);
  };

  const openFreshForm = () => {
    clearDraft();
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await api.post<ActionRecord>('/actions', formData);
      setActions((current) => [response.data, ...current]);
      success('Action created.');
      resetForm();
    } catch (err) {
      showError(getApiErrorMessage(err, 'Could not create this action.'));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleComplete = async (action: ActionRecord) => {
    try {
      const response = await api.put<ActionRecord>(`/actions/${action.id}`, {
        ...action,
        completed: !action.completed,
      });
      setActions((current) =>
        current.map((candidate) => (candidate.id === action.id ? response.data : candidate))
      );
      success(action.completed ? 'Action moved back to active.' : 'Action completed.');
    } catch (err) {
      showError(getApiErrorMessage(err, 'Could not update this action.'));
    }
  };

  const restoreAction = async (action: ActionRecord) => {
    try {
      const createResponse = await api.post<ActionRecord>('/actions', {
        valueId: action.valueId ?? '',
        title: action.title,
        description: action.description ?? '',
        dueDate: action.dueDate ?? '',
      });

      let restoredAction = createResponse.data;

      if (action.completed) {
        const updateResponse = await api.put<ActionRecord>(`/actions/${restoredAction.id}`, {
          ...restoredAction,
          completed: true,
        });
        restoredAction = updateResponse.data;
      }

      setActions((current) => [restoredAction, ...current]);
      success('Action restored.');
    } catch (err) {
      showError(getApiErrorMessage(err, 'Could not restore this action.'));
    }
  };

  const confirmDelete = async () => {
    if (!actionToDelete) {
      return;
    }

    const deletedAction = actionToDelete;
    setActionToDelete(null);
    setActions((current) => current.filter((action) => action.id !== deletedAction.id));

    try {
      await api.delete(`/actions/${deletedAction.id}`);
      success('Action deleted.', {
        actionLabel: 'Undo',
        duration: 7000,
        onAction: async () => restoreAction(deletedAction),
      });
    } catch (err) {
      setActions((current) => [deletedAction, ...current]);
      showError(getApiErrorMessage(err, 'Could not delete this action.'));
    }
  };

  const pendingActions = useMemo(
    () =>
      actions
        .filter((action) => !action.completed)
        .sort((left, right) => {
          if (!left.dueDate) {
            return 1;
          }

          if (!right.dueDate) {
            return -1;
          }

          return new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
        }),
    [actions]
  );

  const completedActions = useMemo(
    () => actions.filter((action) => action.completed),
    [actions]
  );

  const overdueCount = pendingActions.filter((action) => isOverdue(action.dueDate)).length;

  const nextAction = pendingActions[0] ?? null;

  const getValueForAction = (valueId?: string | null) => values.find((value) => value.id === valueId);

  const footer = (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between">
      <button
        type="button"
        onClick={showForm ? resetForm : openFreshForm}
        className="btn-primary md:min-w-[13rem]"
      >
        {showForm ? 'Close Action Form' : 'Create New Action'}
      </button>
      <Link to="/progress" className="btn-secondary text-center md:min-w-[13rem]">
        Review Progress
      </Link>
    </div>
  );

  return (
    <>
      <ExerciseShell
        exerciseId="action"
        estimatedDuration="8 min"
        intro="Translate values into one concrete next step, then keep shaping that step based on what real life gives you back."
        whyItMatters="Committed action is where ACT stops being a concept. Small, repeatable moves matter more than perfect plans."
        draftStatus={draftStatus}
        headerActions={
          <button
            type="button"
            onClick={showForm ? resetForm : openFreshForm}
            className="btn-primary"
          >
            <span className="inline-flex items-center gap-2">
              <Plus size={18} />
              {showForm ? 'Close Form' : 'New Action'}
            </span>
          </button>
        }
        footer={footer}
      >
        {!isLoading && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card">
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Active
              </p>
              <p className="mt-2 font-header text-4xl text-midnight-purple">{pendingActions.length}</p>
            </div>
            <div className="card">
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Completed
              </p>
              <p className="mt-2 font-header text-4xl text-midnight-purple">{completedActions.length}</p>
            </div>
            <div className="card">
              <p className="font-subheader text-xs uppercase tracking-[0.18em] text-gray-500">
                Overdue
              </p>
              <p className="mt-2 font-header text-4xl text-midnight-purple">{overdueCount}</p>
            </div>
          </div>
        )}

        {nextAction && (
          <div className="card bg-lime-green/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-subheader text-xs uppercase tracking-[0.18em] text-lime-green">
                  Today&apos;s next move
                </p>
                <h2 className="mt-2 font-subheader text-xl uppercase text-midnight-purple">
                  {nextAction.title}
                </h2>
                <p className="mt-2 font-body text-sm leading-6 text-gray-600">
                  {nextAction.description ?? 'A small next step is already enough to build momentum.'}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                <p className="font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  Due
                </p>
                <p className="mt-1 font-body text-midnight-purple">
                  {nextAction.dueDate ? new Date(nextAction.dueDate).toLocaleDateString() : 'Anytime'}
                </p>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div ref={formRef} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-subheader text-xs uppercase tracking-[0.18em] text-electric-blue">
                  Action Draft
                </p>
                <h2 className="mt-2 font-subheader text-xl uppercase text-midnight-purple">
                  Create a new action
                </h2>
              </div>
              {hasStoredDraft ? (
                <span className="rounded-full bg-midnight-purple/5 px-3 py-1 font-subheader text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  Draft resumed
                </span>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                  Link to a value
                </label>
                <select
                  value={formData.valueId}
                  onChange={(e) => setFormData((current) => ({ ...current, valueId: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Not linked to a specific value</option>
                  {values.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.category} - {value.description.slice(0, 50)}
                    </option>
                  ))}
                </select>
                {values.length === 0 && (
                  <p className="mt-2 font-body text-sm text-gray-500">
                    Want tighter alignment? Add a value first in{' '}
                    <Link to="/exercises/values" className="text-electric-blue underline-offset-2 hover:underline">
                      Values Clarification
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                  Action title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Text my sister and ask for a walk this week."
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                  Details
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, description: e.target.value }))
                  }
                  className="input-field"
                  rows={3}
                  placeholder="What would make this more likely to happen?"
                />
              </div>

              <div>
                <label className="mb-2 block font-subheader text-xs uppercase tracking-[0.18em] text-gray-600">
                  Due date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((current) => ({ ...current, dueDate: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Create Action'}
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
              <div key={index} className="h-36 animate-pulse rounded-[1.5rem] bg-white/70 shadow-lg" />
            ))}
          </div>
        ) : (
          <>
            <section>
              <h2 className="mb-4 font-subheader text-xl uppercase text-midnight-purple">
                Active Actions ({pendingActions.length})
              </h2>
              {pendingActions.length === 0 ? (
                <div className="card py-10 text-center">
                  <CheckSquare size={44} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-body text-gray-600">
                    No active actions yet. Create one small next step to keep your values in motion.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingActions.map((action) => {
                    const linkedValue = getValueForAction(action.valueId);
                    const overdue = isOverdue(action.dueDate);

                    return (
                      <div key={action.id} className="card">
                        <div className="flex items-start gap-4">
                          <button
                            type="button"
                            onClick={() => void toggleComplete(action)}
                            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-lime-green text-lime-green transition hover:bg-lime-green hover:text-white"
                          >
                            <Check size={16} />
                          </button>

                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="font-subheader text-sm uppercase text-midnight-purple">
                                {action.title}
                              </h3>
                              {linkedValue && (
                                <span className="rounded-full bg-electric-blue/10 px-3 py-1 text-[11px] font-subheader uppercase tracking-[0.16em] text-electric-blue">
                                  {linkedValue.category}
                                </span>
                              )}
                              {overdue && (
                                <span className="rounded-full bg-inferno-red/10 px-3 py-1 text-[11px] font-subheader uppercase tracking-[0.16em] text-inferno-red">
                                  Overdue
                                </span>
                              )}
                            </div>

                            {action.description && (
                              <p className="font-body text-sm leading-6 text-gray-600">
                                {action.description}
                              </p>
                            )}

                            <div className="mt-3 flex items-center gap-2 font-body text-sm text-gray-500">
                              <Calendar size={14} />
                              <span>
                                {action.dueDate
                                  ? new Date(action.dueDate).toLocaleDateString()
                                  : 'No due date'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActionToDelete(action)}
                            className="rounded-2xl p-3 text-inferno-red transition hover:bg-inferno-red/10"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {completedActions.length > 0 && (
              <section>
                <h2 className="mb-4 font-subheader text-xl uppercase text-midnight-purple">
                  Completed ({completedActions.length})
                </h2>
                <div className="grid gap-4">
                  {completedActions.map((action) => {
                    const linkedValue = getValueForAction(action.valueId);

                    return (
                      <div key={action.id} className="card bg-midnight-purple/5">
                        <div className="flex items-start gap-4">
                          <button
                            type="button"
                            onClick={() => void toggleComplete(action)}
                            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-lime-green text-white"
                          >
                            <Check size={16} />
                          </button>
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="font-subheader text-sm uppercase text-midnight-purple line-through opacity-70">
                                {action.title}
                              </h3>
                              {linkedValue && (
                                <span className="rounded-full bg-electric-blue/10 px-3 py-1 text-[11px] font-subheader uppercase tracking-[0.16em] text-electric-blue">
                                  {linkedValue.category}
                                </span>
                              )}
                            </div>
                            {action.description && (
                              <p className="font-body text-sm leading-6 text-gray-500">
                                {action.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setActionToDelete(action)}
                            className="rounded-2xl p-3 text-inferno-red transition hover:bg-inferno-red/10"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </ExerciseShell>

      <ConfirmDialog
        open={Boolean(actionToDelete)}
        title="Delete this action?"
        description="Deleting removes it from your current commitments, but you can undo immediately if you change your mind."
        confirmLabel="Delete Action"
        tone="danger"
        onCancel={() => setActionToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
