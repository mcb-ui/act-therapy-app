import { useMemo, useState } from 'react';
import { Eye, Anchor, Compass, Feather, Sparkles, CheckCircle2 } from 'lucide-react';
import FavoriteButton from '../../components/FavoriteButton';
import { markExerciseComplete, saveExerciseData } from '../../utils/exerciseTracking';

interface PerspectiveMoment {
  id: string;
  label: string;
  experience: string;
  observerNote: string;
  takeaway: string;
}

interface AnchorOption {
  id: string;
  title: string;
  description: string;
  cue: string;
}

const anchorOptions: AnchorOption[] = [
  {
    id: 'breath',
    title: 'Breath Beacon',
    description: 'Return to a steady inhale and exhale to remind yourself you are the one who notices the breath.',
    cue: 'Softly count your breath and imagine the observer resting in the gap between inhale and exhale.',
  },
  {
    id: 'body',
    title: 'Body Postcard',
    description: 'Check in with posture and points of contact to locate yourself in the present moment.',
    cue: 'Feel the weight of your body in the chair and sense the observing self holding the whole experience.',
  },
  {
    id: 'values',
    title: 'Values Compass',
    description: 'Use a chosen value as a North Star that the observing self can steer toward.',
    cue: 'Whisper the value as a word or phrase and notice how the observer gently reorients your actions.',
  },
  {
    id: 'relationships',
    title: 'Shared Humanity',
    description: 'Remember the perspective of others to expand beyond the problem story.',
    cue: 'Imagine watching the scene together with a compassionate ally standing beside you.',
  },
];

const initialMoments: PerspectiveMoment[] = [
  {
    id: 'moment-1',
    label: 'Difficult Memory',
    experience: 'A moment that still tugs at you or brings up strong emotion.',
    observerNote: "I notice that even though this memory is intense, I'm the one witnessing it now.",
    takeaway: 'What did the observing self learn about you in that memory? ',
  },
  {
    id: 'moment-2',
    label: 'Current Challenge',
    experience: 'Something happening this week that hooks you.',
    observerNote: 'From the observing self, what do you notice about your thoughts, sensations, and urges?',
    takeaway: 'How does the observer want to support you in this moment?',
  },
  {
    id: 'moment-3',
    label: 'Future Stretch',
    experience: 'An upcoming situation where you want to stay grounded.',
    observerNote: 'Imagine future-you noticing whatever shows up without getting swept away.',
    takeaway: 'What perspective or reminder will you carry into that scene?',
  },
];

const steps = [
  {
    id: 'arrive',
    title: 'Arrive in the Observing Self',
    description: 'Use breath and anchors to settle into the viewpoint that notices everything.',
  },
  {
    id: 'practice',
    title: 'Practice Flexible Perspective',
    description: 'Walk through key moments and narrate them from the observing self.',
  },
  {
    id: 'integrate',
    title: 'Integrate & Commit',
    description: 'Capture insights, anchors, and the next action that keeps you aligned.',
  },
];

export default function ObserverSelfJourney() {
  const [stepIndex, setStepIndex] = useState(0);
  const [breathCadence, setBreathCadence] = useState(4);
  const [selectedAnchors, setSelectedAnchors] = useState<string[]>(['breath']);
  const [perspectiveLevel, setPerspectiveLevel] = useState(3);
  const [moments, setMoments] = useState<PerspectiveMoment[]>(initialMoments);
  const [reflection, setReflection] = useState('');
  const [microAction, setMicroAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = isComplete
    ? 100
    : Math.round((stepIndex / (steps.length - 1)) * 100);

  const perspectiveMessage = useMemo(() => {
    switch (perspectiveLevel) {
      case 1:
        return 'Zoomed-in: The story feels close and sticky. Practice widening your view.';
      case 2:
        return 'Soft focus: You can sense some space between you and the experience.';
      case 3:
        return 'Balanced lens: The observer notices thoughts, feelings, and values at once.';
      case 4:
        return 'Panoramic: The observing self sees the full landscape and the choices ahead.';
      case 5:
        return 'Expansive: You are the sky in which all weather moves. Nothing needs to be pushed away.';
      default:
        return '';
    }
  }, [perspectiveLevel]);

  const inhaleCount = breathCadence;
  const holdCount = Math.max(2, breathCadence - 1);
  const exhaleCount = breathCadence + 1;

  const toggleAnchor = (id: string) => {
    setSelectedAnchors(prev =>
      prev.includes(id) ? prev.filter(anchor => anchor !== id) : [...prev, id]
    );
  };

  const updateMoment = (id: string, field: keyof PerspectiveMoment, value: string) => {
    setMoments(prev =>
      prev.map(moment =>
        moment.id === id
          ? { ...moment, [field]: value }
          : moment
      )
    );
  };

  const addMoment = () => {
    const nextNumber = moments.length + 1;
    setMoments(prev => [
      ...prev,
      {
        id: `moment-${nextNumber}`,
        label: `New Perspective ${nextNumber}`,
        experience: 'Describe the situation you want to view from the observing self.',
        observerNote: 'What does the observing self notice?',
        takeaway: 'What wisdom or choice becomes available?',
      },
    ]);
  };

  const handleComplete = async () => {
    try {
      setIsSaving(true);
      setError(null);

      await saveExerciseData('observer-self', 'Observer Self Journey', {
        breathCadence,
        selectedAnchors,
        perspectiveLevel,
        moments,
        reflection,
        microAction,
        completedAt: new Date().toISOString(),
      });

      await markExerciseComplete('observer-self', 100, 'Completed Observer Self Journey');
      setIsComplete(true);
    } catch (err) {
      console.error('Failed to save observer self journey', err);
      setError('We could not save your journey just yet. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="card bg-midnight-purple text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-electric-blue flex items-center justify-center shadow-lg">
              <Eye size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-header mb-2">Observer Self Journey</h1>
              <p className="text-white/80 font-body max-w-2xl">
                Strengthen the ACT process of self-as-context. Practice stepping back into the
                part of you that notices every thought, feeling, and sensation without being
                consumed by them.
              </p>
            </div>
          </div>
          <FavoriteButton
            exerciseId="observer-self"
            exerciseName="Observer Self Journey"
            className="text-white"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-subheader uppercase">
            <span>Journey Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
            <div
              className="bg-lime-green h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setStepIndex(index)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  index === stepIndex
                    ? 'bg-white text-midnight-purple border-lime-green'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                <h3 className="font-subheader text-sm uppercase">{step.title}</h3>
                <p className="text-xs font-body mt-1 opacity-80">{step.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="card border-2 border-lime-green bg-lime-green/5 flex items-start space-x-3">
          <CheckCircle2 size={28} className="text-lime-green flex-shrink-0" />
          <div>
            <h2 className="text-xl font-subheader text-midnight-purple uppercase">Journey Saved</h2>
            <p className="text-gray-700 font-body">
              Beautiful work. Your reflections were saved and the exercise is marked as complete.
              Revisit this practice whenever you want to reconnect with the observing self.
            </p>
          </div>
        </div>
      )}

      {stepIndex === 0 && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-subheader text-midnight-purple uppercase">Breath Cadence</h2>
              <Sparkles size={24} className="text-electric-blue" />
            </div>
            <p className="text-gray-600 font-body mb-6">
              Choose a count that helps you settle into the observing self. Slow, intentional breath
              widens the space between you and whatever shows up.
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
              <input
                type="range"
                min={3}
                max={8}
                value={breathCadence}
                onChange={(event) => setBreathCadence(Number(event.target.value))}
                className="w-full"
              />
              <div className="bg-parchment border-2 border-midnight-purple rounded-xl px-5 py-4 text-center">
                <div className="font-header text-midnight-purple text-2xl">{breathCadence}-Count</div>
                <p className="text-xs font-body text-gray-600 mt-1">
                  Inhale for {inhaleCount}, pause for {holdCount}, exhale for {exhaleCount}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-parchment border-2 border-midnight-purple">
            <h2 className="text-2xl font-subheader text-midnight-purple uppercase mb-3">Choose Your Anchors</h2>
            <p className="text-gray-700 font-body mb-4">
              Select the reminders that help you shift into the observing self during the day. You can
              choose more than one.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anchorOptions.map(anchor => {
                const isActive = selectedAnchors.includes(anchor.id);
                return (
                  <button
                    key={anchor.id}
                    onClick={() => toggleAnchor(anchor.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all h-full ${
                      isActive
                        ? 'border-electric-blue bg-white shadow-lg'
                        : 'border-midnight-purple/30 bg-white/70 hover:border-electric-blue'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-electric-blue' : 'bg-midnight-purple/20'
                      }`}>
                        {anchor.id === 'breath' && <Feather size={18} className={isActive ? 'text-white' : 'text-midnight-purple'} />}
                        {anchor.id === 'body' && <Anchor size={18} className={isActive ? 'text-white' : 'text-midnight-purple'} />}
                        {anchor.id === 'values' && <Compass size={18} className={isActive ? 'text-white' : 'text-midnight-purple'} />}
                        {anchor.id === 'relationships' && <Sparkles size={18} className={isActive ? 'text-white' : 'text-midnight-purple'} />}
                      </div>
                      <h3 className="font-subheader text-midnight-purple uppercase text-sm">{anchor.title}</h3>
                    </div>
                    <p className="text-sm text-gray-700 font-body mb-2">{anchor.description}</p>
                    <p className="text-xs text-gray-500 font-body">{anchor.cue}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {stepIndex === 1 && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-subheader text-midnight-purple uppercase">Perspective Lens</h2>
              <Eye size={24} className="text-electric-blue" />
            </div>
            <p className="text-gray-600 font-body mb-4">
              Slide the lens to feel how much distance you have from difficult stories. Notice how
              the observing self responds as the view widens.
            </p>
            <input
              type="range"
              min={1}
              max={5}
              value={perspectiveLevel}
              onChange={(event) => setPerspectiveLevel(Number(event.target.value))}
              className="w-full"
            />
            <div className="bg-electric-blue/10 border border-electric-blue rounded-xl px-4 py-3 mt-4">
              <p className="text-sm font-body text-midnight-purple">{perspectiveMessage}</p>
            </div>
          </div>

          <div className="space-y-4">
            {moments.map(moment => (
              <div key={moment.id} className="card border-2 border-midnight-purple/40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-subheader text-midnight-purple uppercase">{moment.label}</h3>
                  <span className="text-xs font-body text-gray-500">Observer practice</span>
                </div>
                <label className="block mb-3">
                  <span className="font-subheader text-xs uppercase text-gray-500">What happened?</span>
                  <textarea
                    value={moment.experience}
                    onChange={(event) => updateMoment(moment.id, 'experience', event.target.value)}
                    className="input-field mt-1"
                    rows={3}
                  />
                </label>
                <label className="block mb-3">
                  <span className="font-subheader text-xs uppercase text-gray-500">Observer self narration</span>
                  <textarea
                    value={moment.observerNote}
                    onChange={(event) => updateMoment(moment.id, 'observerNote', event.target.value)}
                    className="input-field mt-1"
                    rows={3}
                  />
                </label>
                <label className="block">
                  <span className="font-subheader text-xs uppercase text-gray-500">Takeaway or anchor</span>
                  <textarea
                    value={moment.takeaway}
                    onChange={(event) => updateMoment(moment.id, 'takeaway', event.target.value)}
                    className="input-field mt-1"
                    rows={2}
                  />
                </label>
              </div>
            ))}
          </div>

          <button onClick={addMoment} className="btn-secondary">
            Add Another Perspective Moment
          </button>
        </div>
      )}

      {stepIndex === 2 && (
        <div className="space-y-6">
          <div className="card bg-parchment border-2 border-midnight-purple">
            <h2 className="text-2xl font-subheader text-midnight-purple uppercase mb-3">Anchor Summary</h2>
            <p className="text-gray-700 font-body mb-4">
              These are the anchors you selected. Imagine carrying them like cards in your pocket.
            </p>
            <div className="flex flex-wrap gap-3">
              {selectedAnchors.map(anchorId => {
                const anchor = anchorOptions.find(option => option.id === anchorId);
                if (!anchor) return null;
                return (
                  <div
                    key={anchor.id}
                    className="px-4 py-2 rounded-full bg-white border-2 border-electric-blue text-sm font-subheader uppercase"
                  >
                    {anchor.title}
                  </div>
                );
              })}
              {selectedAnchors.length === 0 && (
                <span className="text-sm text-gray-600 font-body">
                  Choose at least one anchor in Step 1 to keep the observing self close by.
                </span>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-subheader text-midnight-purple uppercase mb-3">Reflection from the Observer</h2>
            <p className="text-gray-600 font-body mb-4">
              Let the observing self speak. What did you notice as you stepped back from each
              moment? What shifts when you remember you are the space that holds every experience?
            </p>
            <textarea
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              className="input-field"
              rows={5}
              placeholder="Write a letter or short note from your observing self..."
            />
          </div>

          <div className="card">
            <h2 className="text-2xl font-subheader text-midnight-purple uppercase mb-3">Values-Aligned Micro Action</h2>
            <p className="text-gray-600 font-body mb-4">
              Choose a small action that keeps you connected to the observing self while moving
              toward what matters.
            </p>
            <input
              type="text"
              value={microAction}
              onChange={(event) => setMicroAction(event.target.value)}
              className="input-field"
              placeholder="Example: Take three observer breaths before my next meeting."
            />
          </div>

          {error && (
            <div className="card border-2 border-inferno-red bg-inferno-red/5 text-inferno-red">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <p className="text-sm text-gray-500 font-body">
              Tip: Save your insights even if they feel unfinished. You can revisit and add more
              any time.
            </p>
            <button
              onClick={handleComplete}
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isComplete ? 'Update Reflection' : 'Save Journey & Mark Complete'}
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
          className="btn-secondary"
          disabled={stepIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
          className="btn-secondary"
          disabled={stepIndex === steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
