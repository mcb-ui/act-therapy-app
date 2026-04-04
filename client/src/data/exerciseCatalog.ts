import { Brain, CheckSquare, Heart, type LucideIcon, Target, Zap } from 'lucide-react';
import type { ProgressEntry } from '../utils/exerciseTracking';

export type ProcessId = 'values' | 'defusion' | 'mindfulness' | 'acceptance' | 'action';

export interface ProcessMeta {
  id: ProcessId;
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  accent: string;
}

export interface ExerciseMeta {
  id: string;
  title: string;
  route: string;
  description: string;
  componentPath: string;
  processId: ProcessId | null;
  trackIds: string[];
  showCompletionDock: boolean;
  countTowardProgress: boolean;
  countTowardCategoryStats: boolean;
}

export interface LearningModuleMeta {
  id: string;
  title: string;
  description: string;
  duration: string;
  colorClass: string;
  emoji: string;
  exerciseIds: string[];
}

export const processCatalog: ProcessMeta[] = [
  {
    id: 'values',
    title: 'Values Clarification',
    description: 'Identify and explore what truly matters to you in life.',
    icon: Target,
    colorClass: 'bg-electric-blue',
    accent: '#1F8996',
  },
  {
    id: 'defusion',
    title: 'Cognitive Defusion',
    description: 'Learn to observe thoughts without being controlled by them.',
    icon: Brain,
    colorClass: 'bg-midnight-purple',
    accent: '#442567',
  },
  {
    id: 'mindfulness',
    title: 'Present Moment',
    description: 'Develop awareness and connection to the here and now.',
    icon: Zap,
    colorClass: 'bg-lime-green',
    accent: '#66A7A8',
  },
  {
    id: 'acceptance',
    title: 'Acceptance',
    description: 'Practice opening up to difficult emotions and experiences.',
    icon: Heart,
    colorClass: 'bg-brand-pink',
    accent: '#8C8199',
  },
  {
    id: 'action',
    title: 'Committed Action',
    description: 'Set goals and take steps aligned with your values.',
    icon: CheckSquare,
    colorClass: 'bg-inferno-red',
    accent: '#C27240',
  },
];

export const exerciseCatalog: ExerciseMeta[] = [
  {
    id: 'intro-act',
    title: 'Introduction to ACT',
    route: '/exercises/intro-act',
    description: 'Learn the foundations of Acceptance and Commitment Therapy.',
    componentPath: './pages/exercises/IntroACT.tsx',
    processId: null,
    trackIds: ['intro-act'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: false,
  },
  {
    id: 'values',
    title: 'Values Clarification',
    route: '/exercises/values',
    description: 'Define what truly matters to you and rate how closely you are living it.',
    componentPath: './pages/exercises/ValuesExercise.tsx',
    processId: 'values',
    trackIds: ['values'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: false,
  },
  {
    id: 'values-duel',
    title: 'Values Duel',
    route: '/exercises/values-duel',
    description: 'Discover your top 5 core values through guided choices.',
    componentPath: './pages/exercises/ValuesDuel.tsx',
    processId: 'values',
    trackIds: ['values-duel'],
    showCompletionDock: false,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'values-compass',
    title: 'Values Compass',
    route: '/exercises/values-compass',
    description: 'Rate eight life directions with an interactive values compass.',
    componentPath: './pages/exercises/ValuesCompass.tsx',
    processId: 'values',
    trackIds: ['values-compass'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'bulls-eye',
    title: "Bull's Eye",
    route: '/exercises/bulls-eye',
    description: 'See how close your daily actions are to your chosen values.',
    componentPath: './pages/exercises/BullsEye.tsx',
    processId: 'values',
    trackIds: ['bulls-eye'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'life-domains',
    title: 'Life Domains',
    route: '/exercises/life-domains',
    description: 'Assess satisfaction across the life areas that matter most.',
    componentPath: './pages/exercises/LifeDomains.tsx',
    processId: 'values',
    trackIds: ['life-domains'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'what-matters',
    title: 'What Matters Most',
    route: '/exercises/what-matters',
    description: 'Clarify the values you most want to stand for.',
    componentPath: './pages/exercises/WhatMatters.tsx',
    processId: 'values',
    trackIds: ['what-matters'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'values-in-action',
    title: 'Values in Action',
    route: '/exercises/values-in-action',
    description: 'Translate values into specific actions you can take this week.',
    componentPath: './pages/exercises/ValuesInAction.tsx',
    processId: 'values',
    trackIds: ['values-in-action'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'defusion',
    title: 'Cognitive Defusion',
    route: '/exercises/defusion',
    description: 'Practice stepping back from thoughts using several defusion techniques.',
    componentPath: './pages/exercises/DefusionExercise.tsx',
    processId: 'defusion',
    trackIds: ['defusion-1', 'defusion-2', 'defusion-3', 'defusion-4', 'defusion-5', 'defusion-6'],
    showCompletionDock: false,
    countTowardProgress: true,
    countTowardCategoryStats: false,
  },
  {
    id: 'leaves-stream',
    title: 'Leaves on a Stream',
    route: '/exercises/leaves-stream',
    description: 'Notice thoughts and let them drift by without chasing them.',
    componentPath: './pages/exercises/LeavesStream.tsx',
    processId: 'defusion',
    trackIds: ['leaves-stream'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'silly-voice',
    title: 'Silly Voice',
    route: '/exercises/silly-voice',
    description: 'Use playful exaggeration to reduce thought stickiness.',
    componentPath: './pages/exercises/SillyVoice.tsx',
    processId: 'defusion',
    trackIds: ['silly-voice'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'thought-labels',
    title: 'Thought Labels',
    route: '/exercises/thought-labels',
    description: 'Categorize difficult thoughts to create distance from them.',
    componentPath: './pages/exercises/ThoughtLabels.tsx',
    processId: 'defusion',
    trackIds: ['thought-labels'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'thank-your-mind',
    title: 'Thank Your Mind',
    route: '/exercises/thank-your-mind',
    description: 'Acknowledge the mind’s attempts to help without obeying every thought.',
    componentPath: './pages/exercises/ThankYourMind.tsx',
    processId: 'defusion',
    trackIds: ['thank-your-mind'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'passengers-on-bus',
    title: 'Passengers on the Bus',
    route: '/exercises/passengers-on-bus',
    description: 'Explore the classic ACT metaphor for valued direction in the presence of inner noise.',
    componentPath: './pages/exercises/PassengersOnBus.tsx',
    processId: 'defusion',
    trackIds: ['passengers-on-bus'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'clouds-in-sky',
    title: 'Clouds in the Sky',
    route: '/exercises/clouds-in-sky',
    description: 'Practice watching thoughts pass through awareness like clouds.',
    componentPath: './pages/exercises/CloudsInSky.tsx',
    processId: 'defusion',
    trackIds: ['clouds-in-sky'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'mindfulness',
    title: 'Present Moment Awareness',
    route: '/exercises/mindfulness',
    description: 'Choose a mindfulness practice and record time spent in the present moment.',
    componentPath: './pages/exercises/MindfulnessExercise.tsx',
    processId: 'mindfulness',
    trackIds: ['mindfulness-breathing', 'mindfulness-5-senses', 'mindfulness-body-scan'],
    showCompletionDock: false,
    countTowardProgress: true,
    countTowardCategoryStats: false,
  },
  {
    id: 'mindful-walking',
    title: 'Mindful Walking',
    route: '/exercises/mindful-walking',
    description: 'Use movement as an anchor for awareness.',
    componentPath: './pages/exercises/MindfulWalking.tsx',
    processId: 'mindfulness',
    trackIds: ['mindful-walking'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'eating-meditation',
    title: 'Eating Meditation',
    route: '/exercises/eating-meditation',
    description: 'Slow down and reconnect with sensory experience through mindful eating.',
    componentPath: './pages/exercises/EatingMeditation.tsx',
    processId: 'mindfulness',
    trackIds: ['eating-meditation'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'sound-awareness',
    title: 'Sound Awareness',
    route: '/exercises/sound-awareness',
    description: 'Use listening as a doorway into present-moment contact.',
    componentPath: './pages/exercises/SoundAwareness.tsx',
    processId: 'mindfulness',
    trackIds: ['sound-awareness'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'breath-counting',
    title: 'Breath Counting',
    route: '/exercises/breath-counting',
    description: 'Strengthen attention by returning again and again to the breath.',
    componentPath: './pages/exercises/BreathCounting.tsx',
    processId: 'mindfulness',
    trackIds: ['breath-counting'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'progressive-muscle-relaxation',
    title: 'Progressive Muscle Relaxation',
    route: '/exercises/progressive-muscle-relaxation',
    description: 'Notice tension and release with deliberate body awareness.',
    componentPath: './pages/exercises/ProgressiveMuscleRelaxation.tsx',
    processId: 'mindfulness',
    trackIds: ['progressive-muscle-relaxation'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'acceptance',
    title: 'Acceptance',
    route: '/exercises/acceptance',
    description: 'Explore willingness and make room for difficult experiences.',
    componentPath: './pages/exercises/AcceptanceExercise.tsx',
    processId: 'acceptance',
    trackIds: ['acceptance-exercise'],
    showCompletionDock: false,
    countTowardProgress: true,
    countTowardCategoryStats: false,
  },
  {
    id: 'tug-of-war',
    title: 'Tug of War',
    route: '/exercises/tug-of-war',
    description: 'Notice how struggle can pull you further from what matters.',
    componentPath: './pages/exercises/TugOfWar.tsx',
    processId: 'acceptance',
    trackIds: ['tug-of-war'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'willingness-scale',
    title: 'Willingness Scale',
    route: '/exercises/willingness-scale',
    description: 'Rate how willing you are to make room for feelings in the service of values.',
    componentPath: './pages/exercises/WillingnessScale.tsx',
    processId: 'acceptance',
    trackIds: ['willingness-scale'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'expansion',
    title: 'Expansion',
    route: '/exercises/expansion',
    description: 'Expand around difficult emotions instead of shrinking away from them.',
    componentPath: './pages/exercises/Expansion.tsx',
    processId: 'acceptance',
    trackIds: ['expansion'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'emotional-surfing',
    title: 'Emotional Surfing',
    route: '/exercises/emotional-surfing',
    description: 'Ride emotional waves without letting them choose your direction.',
    componentPath: './pages/exercises/EmotionalSurfing.tsx',
    processId: 'acceptance',
    trackIds: ['emotional-surfing'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'guest-house',
    title: 'Guest House',
    route: '/exercises/guest-house',
    description: 'Practice welcoming inner experiences with less resistance.',
    componentPath: './pages/exercises/GuestHouse.tsx',
    processId: 'acceptance',
    trackIds: ['guest-house'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'action',
    title: 'Committed Action',
    route: '/exercises/action',
    description: 'Turn values into actions, plans, and next steps.',
    componentPath: './pages/exercises/ActionPlanner.tsx',
    processId: 'action',
    trackIds: ['action'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: false,
  },
  {
    id: 'smart-goals',
    title: 'SMART Goals',
    route: '/exercises/smart-goals',
    description: 'Create a goal that is specific, measurable, and realistic.',
    componentPath: './pages/exercises/SMARTGoals.tsx',
    processId: 'action',
    trackIds: ['smart-goals'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'barrier-busting',
    title: 'Barrier Busting',
    route: '/exercises/barrier-busting',
    description: 'Prepare for obstacles with flexible, value-aligned responses.',
    componentPath: './pages/exercises/BarrierBusting.tsx',
    processId: 'action',
    trackIds: ['barrier-busting'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'values-based-scheduling',
    title: 'Values-Based Scheduling',
    route: '/exercises/values-based-scheduling',
    description: 'Make time for the life you actually want to build.',
    componentPath: './pages/exercises/ValuesBasedScheduling.tsx',
    processId: 'action',
    trackIds: ['values-based-scheduling'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'committed-action-tracker',
    title: 'Committed Action Tracker',
    route: '/exercises/committed-action-tracker',
    description: 'Track meaningful actions and notice the momentum you are building.',
    componentPath: './pages/exercises/CommittedActionTracker.tsx',
    processId: 'action',
    trackIds: ['committed-action-tracker'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
  {
    id: 'valued-living-questionnaire',
    title: 'Valued Living Questionnaire',
    route: '/exercises/valued-living-questionnaire',
    description: 'Compare what matters to you with how consistently you are living it.',
    componentPath: './pages/exercises/ValuedLivingQuestionnaire.tsx',
    processId: 'action',
    trackIds: ['valued-living-questionnaire'],
    showCompletionDock: true,
    countTowardProgress: true,
    countTowardCategoryStats: true,
  },
];

export const learningModules: LearningModuleMeta[] = [
  {
    id: 'foundation',
    title: 'Foundation: Understanding ACT',
    description: 'Learn the basics of ACT and orient to the full model.',
    duration: '45 mins',
    colorClass: 'from-electric-blue to-midnight-purple',
    emoji: '📚',
    exerciseIds: ['intro-act', 'values-duel', 'values-compass', 'life-domains'],
  },
  {
    id: 'mindfulness',
    title: 'Module 1: Present Moment Awareness',
    description: 'Develop mindfulness and stay grounded in the now.',
    duration: '60 mins',
    colorClass: 'from-lime-green to-electric-blue',
    emoji: '🧘',
    exerciseIds: [
      'mindfulness',
      'breath-counting',
      'sound-awareness',
      'mindful-walking',
      'eating-meditation',
      'progressive-muscle-relaxation',
    ],
  },
  {
    id: 'defusion',
    title: 'Module 2: Cognitive Defusion',
    description: 'Learn to observe thoughts without being controlled by them.',
    duration: '55 mins',
    colorClass: 'from-midnight-purple to-brand-pink',
    emoji: '🧠',
    exerciseIds: [
      'defusion',
      'silly-voice',
      'thought-labels',
      'thank-your-mind',
      'leaves-stream',
      'passengers-on-bus',
      'clouds-in-sky',
    ],
  },
  {
    id: 'acceptance',
    title: 'Module 3: Acceptance & Willingness',
    description: 'Open up to difficult experiences with more compassion and choice.',
    duration: '50 mins',
    colorClass: 'from-brand-pink to-inferno-red',
    emoji: '❤️',
    exerciseIds: [
      'acceptance',
      'tug-of-war',
      'expansion',
      'willingness-scale',
      'emotional-surfing',
      'guest-house',
    ],
  },
  {
    id: 'action',
    title: 'Module 4: Values & Committed Action',
    description: 'Clarify values and convert them into practical next steps.',
    duration: '65 mins',
    colorClass: 'from-inferno-red to-lime-green',
    emoji: '🎯',
    exerciseIds: [
      'values',
      'what-matters',
      'bulls-eye',
      'values-in-action',
      'action',
      'smart-goals',
      'barrier-busting',
      'values-based-scheduling',
      'committed-action-tracker',
      'valued-living-questionnaire',
    ],
  },
];

export const exerciseById = new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise]));
export const exerciseByRoute = new Map(exerciseCatalog.map((exercise) => [exercise.route, exercise]));
export const totalTrackableExercises = exerciseCatalog.filter((exercise) => exercise.countTowardProgress).length;

export const getExercisesByProcess = (processId: ProcessId) =>
  exerciseCatalog.filter(
    (exercise) => exercise.processId === processId && exercise.countTowardCategoryStats
  );

export const getExercisesByIds = (exerciseIds: string[]) =>
  exerciseIds
    .map((exerciseId) => exerciseById.get(exerciseId))
    .filter((exercise): exercise is ExerciseMeta => Boolean(exercise));

export const getCompletedExerciseIds = (progressEntries: ProgressEntry[]) => {
  const completedProgressIds = new Set(
    progressEntries.filter((entry) => entry.completed).map((entry) => entry.exerciseId)
  );

  return new Set(
    exerciseCatalog
      .filter((exercise) => exercise.trackIds.some((trackId) => completedProgressIds.has(trackId)))
      .map((exercise) => exercise.id)
  );
};

export const getCompletedProgressIdSet = (progressEntries: ProgressEntry[]) =>
  new Set(progressEntries.filter((entry) => entry.completed).map((entry) => entry.exerciseId));

export interface ExerciseCompletionState {
  exerciseId: string;
  completedTrackIds: string[];
  completedTrackCount: number;
  totalTrackCount: number;
  completionRatio: number;
  isStarted: boolean;
  isCompleted: boolean;
  isFullyCompleted: boolean;
  hasRemainingTracks: boolean;
  nextTrackId: string | null;
}

export const getExerciseCompletionState = (
  exercise: ExerciseMeta,
  progressEntries: ProgressEntry[]
): ExerciseCompletionState => {
  const completedProgressIds = getCompletedProgressIdSet(progressEntries);
  const completedTrackIds = exercise.trackIds.filter((trackId) => completedProgressIds.has(trackId));
  const completedTrackCount = completedTrackIds.length;
  const totalTrackCount = exercise.trackIds.length;

  return {
    exerciseId: exercise.id,
    completedTrackIds,
    completedTrackCount,
    totalTrackCount,
    completionRatio: completedTrackCount / Math.max(totalTrackCount, 1),
    isStarted: completedTrackCount > 0,
    isCompleted: completedTrackCount > 0,
    isFullyCompleted: completedTrackCount === totalTrackCount,
    hasRemainingTracks: completedTrackCount < totalTrackCount,
    nextTrackId: exercise.trackIds.find((trackId) => !completedProgressIds.has(trackId)) ?? null,
  };
};

export const getExerciseCompletionMap = (progressEntries: ProgressEntry[]) =>
  new Map(
    exerciseCatalog.map((exercise) => [
      exercise.id,
      getExerciseCompletionState(exercise, progressEntries),
    ])
  );
