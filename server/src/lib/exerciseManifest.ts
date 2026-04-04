export interface ExerciseManifestEntry {
  id: string;
  processId: 'values' | 'defusion' | 'mindfulness' | 'acceptance' | 'action' | null;
  trackIds: string[];
  countTowardProgress: boolean;
}

export const exerciseManifest: ExerciseManifestEntry[] = [
  { id: 'intro-act', processId: null, trackIds: ['intro-act'], countTowardProgress: true },
  { id: 'values', processId: 'values', trackIds: ['values'], countTowardProgress: true },
  { id: 'values-duel', processId: 'values', trackIds: ['values-duel'], countTowardProgress: true },
  { id: 'values-compass', processId: 'values', trackIds: ['values-compass'], countTowardProgress: true },
  { id: 'bulls-eye', processId: 'values', trackIds: ['bulls-eye'], countTowardProgress: true },
  { id: 'life-domains', processId: 'values', trackIds: ['life-domains'], countTowardProgress: true },
  { id: 'what-matters', processId: 'values', trackIds: ['what-matters'], countTowardProgress: true },
  { id: 'values-in-action', processId: 'values', trackIds: ['values-in-action'], countTowardProgress: true },
  {
    id: 'defusion',
    processId: 'defusion',
    trackIds: ['defusion-1', 'defusion-2', 'defusion-3', 'defusion-4', 'defusion-5', 'defusion-6'],
    countTowardProgress: true,
  },
  { id: 'leaves-stream', processId: 'defusion', trackIds: ['leaves-stream'], countTowardProgress: true },
  { id: 'silly-voice', processId: 'defusion', trackIds: ['silly-voice'], countTowardProgress: true },
  { id: 'thought-labels', processId: 'defusion', trackIds: ['thought-labels'], countTowardProgress: true },
  { id: 'thank-your-mind', processId: 'defusion', trackIds: ['thank-your-mind'], countTowardProgress: true },
  { id: 'passengers-on-bus', processId: 'defusion', trackIds: ['passengers-on-bus'], countTowardProgress: true },
  { id: 'clouds-in-sky', processId: 'defusion', trackIds: ['clouds-in-sky'], countTowardProgress: true },
  {
    id: 'mindfulness',
    processId: 'mindfulness',
    trackIds: ['mindfulness-breathing', 'mindfulness-5-senses', 'mindfulness-body-scan'],
    countTowardProgress: true,
  },
  { id: 'mindful-walking', processId: 'mindfulness', trackIds: ['mindful-walking'], countTowardProgress: true },
  { id: 'eating-meditation', processId: 'mindfulness', trackIds: ['eating-meditation'], countTowardProgress: true },
  { id: 'sound-awareness', processId: 'mindfulness', trackIds: ['sound-awareness'], countTowardProgress: true },
  { id: 'breath-counting', processId: 'mindfulness', trackIds: ['breath-counting'], countTowardProgress: true },
  {
    id: 'progressive-muscle-relaxation',
    processId: 'mindfulness',
    trackIds: ['progressive-muscle-relaxation'],
    countTowardProgress: true,
  },
  { id: 'acceptance', processId: 'acceptance', trackIds: ['acceptance-exercise'], countTowardProgress: true },
  { id: 'tug-of-war', processId: 'acceptance', trackIds: ['tug-of-war'], countTowardProgress: true },
  { id: 'willingness-scale', processId: 'acceptance', trackIds: ['willingness-scale'], countTowardProgress: true },
  { id: 'expansion', processId: 'acceptance', trackIds: ['expansion'], countTowardProgress: true },
  { id: 'emotional-surfing', processId: 'acceptance', trackIds: ['emotional-surfing'], countTowardProgress: true },
  { id: 'guest-house', processId: 'acceptance', trackIds: ['guest-house'], countTowardProgress: true },
  { id: 'action', processId: 'action', trackIds: ['action'], countTowardProgress: true },
  { id: 'smart-goals', processId: 'action', trackIds: ['smart-goals'], countTowardProgress: true },
  { id: 'barrier-busting', processId: 'action', trackIds: ['barrier-busting'], countTowardProgress: true },
  {
    id: 'values-based-scheduling',
    processId: 'action',
    trackIds: ['values-based-scheduling'],
    countTowardProgress: true,
  },
  {
    id: 'committed-action-tracker',
    processId: 'action',
    trackIds: ['committed-action-tracker'],
    countTowardProgress: true,
  },
  {
    id: 'valued-living-questionnaire',
    processId: 'action',
    trackIds: ['valued-living-questionnaire'],
    countTowardProgress: true,
  },
];

export const totalTrackableExercises = exerciseManifest.filter(
  (exercise) => exercise.countTowardProgress
).length;

export const trackIdToExerciseId = new Map(
  exerciseManifest.flatMap((exercise) => exercise.trackIds.map((trackId) => [trackId, exercise.id] as const))
);
