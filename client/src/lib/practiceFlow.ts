import {
  exerciseById,
  getExerciseCompletionMap,
  getExercisesByIds,
  getExercisesByProcess,
  learningModules,
  processCatalog,
  type ExerciseMeta,
  type LearningModuleMeta,
  type ProcessMeta,
  type ExerciseCompletionState,
  type ProcessId,
} from '../data/exerciseCatalog';
import type { Favorite, ProgressEntry } from '../utils/exerciseTracking';

export interface ValueSignal {
  id?: string;
  category: string;
  description: string;
  importance: number;
  alignment: number;
}

export interface ActionSignal {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  dueDate?: string | null;
  valueId?: string | null;
}

export interface ExerciseRecommendation {
  exercise: ExerciseMeta;
  reason: string;
  label: string;
}

export interface ProcessProgressState {
  id: ProcessId;
  title: string;
  description: string;
  icon: ProcessMeta['icon'];
  colorClass: ProcessMeta['colorClass'];
  completedCount: number;
  totalCount: number;
  completionRatio: number;
  nextExercise: ExerciseMeta | null;
  continueExercise: ExerciseMeta | null;
}

export interface ModuleRecommendation {
  module: LearningModuleMeta;
  nextExercise: ExerciseMeta | null;
  reason: string;
  progressLabel: string;
}

export interface PracticeFlowModel {
  primaryRecommendation: ExerciseRecommendation | null;
  quickResumeRecommendation: ExerciseRecommendation | null;
  moduleRecommendation: ModuleRecommendation | null;
  rankedProcesses: ProcessProgressState[];
}

interface ModuleProgressState {
  module: LearningModuleMeta;
  exercises: ExerciseMeta[];
  completedCount: number;
  totalCount: number;
  completionRatio: number;
  nextExercise: ExerciseMeta | null;
}

const findExercise = (exerciseId: string) => {
  const exercise = exerciseById.get(exerciseId);

  if (!exercise) {
    throw new Error(`Unknown exercise id: ${exerciseId}`);
  }

  return exercise;
};

const foundationalExercises = {
  values: findExercise('values'),
  valuesInAction: findExercise('values-in-action'),
  action: findExercise('action'),
};

const isOverdue = (dueDate: string | null | undefined) => {
  if (!dueDate) {
    return false;
  }

  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) {
    return false;
  }

  return due.getTime() < Date.now();
};

const getTopValueGap = (values: ValueSignal[]) =>
  [...values].sort(
    (left, right) =>
      right.importance - right.alignment - (left.importance - left.alignment)
  )[0] ?? null;

const pickBestProcessExercise = (
  processId: ProcessId,
  completionMap: Map<string, ExerciseCompletionState>,
  favoriteIds: Set<string>
) => {
  const exercises = getExercisesByProcess(processId);
  const rankedExercises = [...exercises].sort((left, right) => {
    const leftCompletion = completionMap.get(left.id);
    const rightCompletion = completionMap.get(right.id);

    const leftContinuationScore =
      Number(Boolean(leftCompletion?.hasRemainingTracks && leftCompletion.completedTrackCount > 0)) * 10;
    const rightContinuationScore =
      Number(Boolean(rightCompletion?.hasRemainingTracks && rightCompletion.completedTrackCount > 0)) * 10;

    if (rightContinuationScore !== leftContinuationScore) {
      return rightContinuationScore - leftContinuationScore;
    }

    const favoriteDelta = Number(favoriteIds.has(right.id)) - Number(favoriteIds.has(left.id));
    if (favoriteDelta !== 0) {
      return favoriteDelta;
    }

    return exercises.indexOf(left) - exercises.indexOf(right);
  });

  return {
    nextExercise:
      rankedExercises.find((exercise) => !completionMap.get(exercise.id)?.isCompleted) ?? null,
    continueExercise:
      rankedExercises.find((exercise) => {
        const completion = completionMap.get(exercise.id);
        return Boolean(completion?.hasRemainingTracks && completion.completedTrackCount > 0);
      }) ?? null,
  };
};

const getRankedProcesses = (
  progressEntries: ProgressEntry[],
  favorites: Favorite[]
): ProcessProgressState[] => {
  const completionMap = getExerciseCompletionMap(progressEntries);
  const favoriteIds = new Set(favorites.map((favorite) => favorite.exerciseId));

  return processCatalog
    .map((process) => {
      const exercises = getExercisesByProcess(process.id);
      const completedCount = exercises.filter(
        (exercise) => completionMap.get(exercise.id)?.isCompleted
      ).length;
      const completionRatio = completedCount / Math.max(exercises.length, 1);
      const { nextExercise, continueExercise } = pickBestProcessExercise(
        process.id,
        completionMap,
        favoriteIds
      );

      return {
        id: process.id,
        title: process.title,
        description: process.description,
        icon: process.icon,
        colorClass: process.colorClass,
        completedCount,
        totalCount: exercises.length,
        completionRatio,
        nextExercise,
        continueExercise,
      };
    })
    .sort((left, right) => {
      if (left.completionRatio !== right.completionRatio) {
        return left.completionRatio - right.completionRatio;
      }

      return left.completedCount - right.completedCount;
    });
};

const getModuleProgressStates = (progressEntries: ProgressEntry[]) => {
  const completionMap = getExerciseCompletionMap(progressEntries);

  return learningModules.map<ModuleProgressState>((module) => {
    const exercises = getExercisesByIds(module.exerciseIds);
    const completedCount = exercises.filter(
      (exercise) => completionMap.get(exercise.id)?.isCompleted
    ).length;
    const nextExercise =
      exercises.find((exercise) => !completionMap.get(exercise.id)?.isCompleted) ?? null;

    return {
      module,
      exercises,
      completedCount,
      totalCount: exercises.length,
      completionRatio: completedCount / Math.max(exercises.length, 1),
      nextExercise,
    };
  });
};

const getPrimaryRecommendation = (
  rankedProcesses: ProcessProgressState[],
  progressEntries: ProgressEntry[],
  favorites: Favorite[],
  values: ValueSignal[],
  actions: ActionSignal[]
): ExerciseRecommendation | null => {
  const completionMap = getExerciseCompletionMap(progressEntries);
  const favoriteIds = new Set(favorites.map((favorite) => favorite.exerciseId));
  const activeActions = actions.filter((action) => !action.completed);
  const overdueActions = activeActions.filter((action) => isOverdue(action.dueDate));
  const topValueGap = getTopValueGap(values);

  if (values.length === 0) {
    return {
      exercise: foundationalExercises.values,
      reason: 'Your next best step is to define what matters before you optimize anything else.',
      label: 'Build direction',
    };
  }

  if (activeActions.length === 0) {
    return {
      exercise: foundationalExercises.action,
      reason: 'You have values on paper, but no active commitment translating them into behavior.',
      label: 'Create commitment',
    };
  }

  if (overdueActions.length > 0) {
    return {
      exercise: foundationalExercises.action,
      reason: 'You already have commitments that need tightening. Clean the plan before adding more.',
      label: 'Repair follow-through',
    };
  }

  if (topValueGap && topValueGap.importance - topValueGap.alignment >= 3) {
    return {
      exercise: foundationalExercises.valuesInAction,
      reason: `${topValueGap.category} matters a lot to you, but your current alignment is lagging behind.`,
      label: 'Close a values gap',
    };
  }

  const resumableExercise = [...completionMap.entries()]
    .flatMap(([exerciseId, completion]) => {
      const exercise = exerciseById.get(exerciseId);

      return exercise ? [{ exercise, completion }] : [];
    })
    .filter(
      (item) =>
        item.completion.totalTrackCount > 1 &&
        item.completion.completedTrackCount > 0 &&
        item.completion.hasRemainingTracks
    )
    .sort((left, right) => right.completion.completionRatio - left.completion.completionRatio)[0];

  if (resumableExercise) {
    return {
      exercise: resumableExercise.exercise,
      reason: `You already started this multi-step practice. One more rep will deepen the skill instead of scattering your focus.`,
      label: 'Deepen a started practice',
    };
  }

  const weakestProcess = rankedProcesses[0];
  if (weakestProcess?.nextExercise) {
    return {
      exercise: weakestProcess.nextExercise,
      reason: `${weakestProcess.title} is the lightest-practiced ACT process in your journey right now.`,
      label: 'Balance your ACT skills',
    };
  }

  const favoriteIncomplete = [...favoriteIds]
    .map((exerciseId) => exerciseById.get(exerciseId))
    .find((exercise) => exercise && !completionMap.get(exercise.id)?.isCompleted);

  if (favoriteIncomplete) {
    return {
      exercise: favoriteIncomplete,
      reason: 'You already flagged this as worth coming back to. Use that signal.',
      label: 'Return to a favorite',
    };
  }

  return {
    exercise: foundationalExercises.action,
    reason: 'When the practice library is broadly complete, the next move is to keep values alive through action.',
    label: 'Integrate the work',
  };
};

const getQuickResumeRecommendation = (
  primaryRecommendation: ExerciseRecommendation | null,
  rankedProcesses: ProcessProgressState[],
  progressEntries: ProgressEntry[],
  favorites: Favorite[]
): ExerciseRecommendation | null => {
  const completionMap = getExerciseCompletionMap(progressEntries);
  const primaryExerciseId = primaryRecommendation?.exercise.id;
  const favoriteIds = new Set(favorites.map((favorite) => favorite.exerciseId));

  const resumableExercise = [...completionMap.entries()]
    .flatMap(([exerciseId, completion]) => {
      const exercise = exerciseById.get(exerciseId);

      return exercise ? [{ exercise, completion }] : [];
    })
    .filter(
      (item) =>
        item.exercise.id !== primaryExerciseId &&
        item.completion.totalTrackCount > 1 &&
        item.completion.completedTrackCount > 0 &&
        item.completion.hasRemainingTracks
    )
    .sort((left, right) => right.completion.completionRatio - left.completion.completionRatio)[0];

  if (resumableExercise) {
    return {
      exercise: resumableExercise.exercise,
      reason: `${resumableExercise.completion.completedTrackCount}/${resumableExercise.completion.totalTrackCount} internal practices are already done here.`,
      label: 'Resume what is underway',
    };
  }

  const favoriteIncomplete = [...favoriteIds]
    .map((exerciseId) => exerciseById.get(exerciseId))
    .find(
      (exercise) => exercise && exercise.id !== primaryExerciseId && !completionMap.get(exercise.id)?.isCompleted
    );

  if (favoriteIncomplete) {
    return {
      exercise: favoriteIncomplete,
      reason: 'You marked this as a favorite, so it should stay one tap away from action.',
      label: 'Fast access',
    };
  }

  const nextProcessExercise = rankedProcesses.find(
    (process) => process.nextExercise && process.nextExercise.id !== primaryExerciseId
  )?.nextExercise;

  if (!nextProcessExercise) {
    return null;
  }

  return {
    exercise: nextProcessExercise,
    reason: 'If you finish the primary recommendation, this is the cleanest follow-on rep.',
    label: 'Second best next step',
  };
};

const getModuleRecommendation = (
  primaryRecommendation: ExerciseRecommendation | null,
  progressEntries: ProgressEntry[]
): ModuleRecommendation | null => {
  const moduleStates = getModuleProgressStates(progressEntries);
  const startedModule = [...moduleStates]
    .filter((module) => module.completedCount > 0 && module.completedCount < module.totalCount)
    .sort((left, right) => right.completionRatio - left.completionRatio)[0];

  if (startedModule) {
    return {
      module: startedModule.module,
      nextExercise: startedModule.nextExercise,
      reason: 'Resume the pathway you already started before opening a new one.',
      progressLabel: `${startedModule.completedCount}/${startedModule.totalCount} complete`,
    };
  }

  if (primaryRecommendation) {
    const moduleForPrimary = moduleStates.find((state) =>
      state.module.exerciseIds.includes(primaryRecommendation.exercise.id)
    );

    if (moduleForPrimary) {
      return {
        module: moduleForPrimary.module,
        nextExercise: primaryRecommendation.exercise,
        reason: `This module contains your best next exercise: ${primaryRecommendation.exercise.title}.`,
        progressLabel: `${moduleForPrimary.completedCount}/${moduleForPrimary.totalCount} complete`,
      };
    }
  }

  const firstIncomplete = moduleStates.find((module) => module.completedCount < module.totalCount);

  if (!firstIncomplete) {
    return null;
  }

  return {
    module: firstIncomplete.module,
    nextExercise: firstIncomplete.nextExercise,
    reason: 'This is the next unfinished pathway in your structured learning journey.',
    progressLabel: `${firstIncomplete.completedCount}/${firstIncomplete.totalCount} complete`,
  };
};

export const buildPracticeFlowModel = (
  progressEntries: ProgressEntry[],
  favorites: Favorite[],
  values: ValueSignal[],
  actions: ActionSignal[]
): PracticeFlowModel => {
  const rankedProcesses = getRankedProcesses(progressEntries, favorites);
  const primaryRecommendation = getPrimaryRecommendation(
    rankedProcesses,
    progressEntries,
    favorites,
    values,
    actions
  );
  const quickResumeRecommendation = getQuickResumeRecommendation(
    primaryRecommendation,
    rankedProcesses,
    progressEntries,
    favorites
  );
  const moduleRecommendation = getModuleRecommendation(primaryRecommendation, progressEntries);

  return {
    primaryRecommendation,
    quickResumeRecommendation,
    moduleRecommendation,
    rankedProcesses,
  };
};
