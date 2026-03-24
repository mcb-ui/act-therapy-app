import { useState, useEffect } from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import { markExerciseComplete } from '../../utils/exerciseTracking';
import ExerciseHeader from '../../components/ExerciseHeader';

export default function DefusionExercise() {
  useEffect(() => { document.title = 'Defusion Exercise | ACT Therapy'; }, []);
  const [thought, setThought] = useState('');
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [defusedThought, setDefusedThought] = useState('');

  const exercises = [
    {
      id: 1,
      title: 'Add "I notice I\'m having the thought that..."',
      description: 'This creates distance between you and your thoughts',
      transform: (t: string) => `I notice I'm having the thought that ${t.toLowerCase()}`,
    },
    {
      id: 2,
      title: 'Thank Your Mind',
      description: 'Acknowledge your mind without judgment',
      transform: (t: string) => `Thanks mind, for that thought: "${t}"`,
    },
    {
      id: 3,
      title: 'Sing It',
      description: 'Imagine singing your thought to a silly tune (like "Happy Birthday")',
      transform: (t: string) => `🎵 ${t} 🎵 (imagine this to the tune of Happy Birthday!)`,
    },
    {
      id: 4,
      title: 'Say It in a Silly Voice',
      description: 'Imagine saying it in a cartoon character\'s voice',
      transform: (t: string) => `Imagine saying this in Donald Duck's voice: "${t}"`,
    },
    {
      id: 5,
      title: 'Watch It Float By',
      description: 'Imagine the thought written on a leaf floating down a stream',
      transform: (t: string) => `🍃 Picture this thought on a leaf, floating downstream: "${t}"`,
    },
    {
      id: 6,
      title: 'Name the Story',
      description: 'Give the recurring thought pattern a name',
      transform: (t: string) => `Ah, this is the "${t.substring(0, 30)}..." story again.`,
    },
  ];

  const handleExercise = async (exerciseId: number) => {
    if (!thought.trim()) {
      alert('Please enter a thought first!');
      return;
    }

    const exercise = exercises.find((e) => e.id === exerciseId);
    if (exercise) {
      setDefusedThought(exercise.transform(thought));
      setCurrentExercise(exerciseId);

      // Save progress
      try {
        await markExerciseComplete(`defusion-${exerciseId}`, undefined, thought);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ExerciseHeader icon={<Brain size={24} className="text-white" />} title="Cognitive Defusion" subtitle="Change your relationship with difficult thoughts" exerciseId="defusion" exerciseName="Defusion Exercise" />

      <div className="card bg-purple-50 border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">What is Cognitive Defusion?</h3>
        <p className="text-purple-800 mb-2">
          Cognitive defusion helps you step back from your thoughts rather than getting caught
          up in them. Instead of trying to change or eliminate thoughts, you learn to see them
          as just thoughts - mental events that come and go.
        </p>
        <p className="text-purple-800">
          Try these exercises with a thought that's been troubling you.
        </p>
      </div>

      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter a difficult thought:
        </label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          className="input-field"
          rows={3}
          placeholder="e.g., I'm not good enough, Nobody likes me, I'll fail..."
        />
      </div>

      {defusedThought && (
        <div className="card bg-midnight-purple text-white">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold">Defused Version:</h3>
            <button
              onClick={() => {
                setDefusedThought('');
                setCurrentExercise(null);
              }}
              className="text-purple-200 hover:text-white"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <p className="text-xl font-medium">{defusedThought}</p>
          <p className="text-purple-200 mt-4 text-sm">
            Notice how this changes your relationship with the thought?
          </p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Defusion Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`card cursor-pointer hover:shadow-lg transition-all ${
                currentExercise === exercise.id
                  ? 'ring-2 ring-purple-500 bg-purple-50'
                  : ''
              }`}
              onClick={() => handleExercise(exercise.id)}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{exercise.title}</h3>
              <p className="text-gray-600 text-sm">{exercise.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Tips for Practice:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>The goal isn't to make thoughts go away, but to reduce their impact</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Practice these techniques regularly, even with minor thoughts</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Notice when you're "fused" with thoughts - taking them as literal truth</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Different techniques work for different people - try them all!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
