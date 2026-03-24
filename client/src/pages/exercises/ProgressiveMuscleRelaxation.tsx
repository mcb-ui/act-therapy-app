import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Play, ChevronRight, CheckCircle } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';

interface MuscleGroup {
  name: string;
  body: string;
  tenseInstruction: string;
  releaseInstruction: string;
  icon: string;
}

export default function ProgressiveMuscleRelaxation() {
  useEffect(() => { document.title = 'Progressive Muscle Relaxation | ACT Therapy'; }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'tense' | 'release' | 'complete'>('intro');
  const [completedGroups, setCompletedGroups] = useState<number[]>([]);

  const muscleGroups: MuscleGroup[] = [
    {
      name: 'Hands & Arms',
      body: 'Right hand and forearm',
      tenseInstruction: 'Make a tight fist with your right hand. Squeeze hard. Feel the tension.',
      releaseInstruction: 'Let go completely. Notice the difference between tension and relaxation.',
      icon: '✊',
    },
    {
      name: 'Hands & Arms',
      body: 'Left hand and forearm',
      tenseInstruction: 'Make a tight fist with your left hand. Squeeze hard. Feel the tension.',
      releaseInstruction: 'Release. Let your hand and arm go completely loose and heavy.',
      icon: '✊',
    },
    {
      name: 'Upper Arms',
      body: 'Biceps',
      tenseInstruction: 'Bend your arms and flex your biceps. Tense them hard, as if showing off muscles.',
      releaseInstruction: 'Release. Let your arms drop and relax completely.',
      icon: '💪',
    },
    {
      name: 'Shoulders',
      body: 'Shoulder muscles',
      tenseInstruction: 'Raise your shoulders up towards your ears. Hold the tension.',
      releaseInstruction: 'Drop your shoulders. Feel them sink down, heavy and relaxed.',
      icon: '🤷',
    },
    {
      name: 'Face',
      body: 'Forehead and eyes',
      tenseInstruction: 'Raise your eyebrows as high as possible. Feel the tension in your forehead.',
      releaseInstruction: 'Release. Let your face soften completely. Smooth forehead.',
      icon: '😮',
    },
    {
      name: 'Jaw',
      body: 'Jaw muscles',
      tenseInstruction: 'Clench your jaw tightly. Press your teeth together. Feel the tension.',
      releaseInstruction: 'Let your jaw hang loose. Lips slightly parted. Completely relaxed.',
      icon: '😬',
    },
    {
      name: 'Neck',
      body: 'Neck muscles',
      tenseInstruction: 'Press your head back into your chair/pillow. Feel tension in your neck.',
      releaseInstruction: 'Release. Let your head rest comfortably. Neck soft and loose.',
      icon: '🦒',
    },
    {
      name: 'Chest',
      body: 'Chest muscles',
      tenseInstruction: 'Take a deep breath and hold it. Feel your chest expand and tense.',
      releaseInstruction: 'Breathe out slowly. Let your chest relax, breathing naturally.',
      icon: '🫁',
    },
    {
      name: 'Stomach',
      body: 'Abdominal muscles',
      tenseInstruction: 'Tighten your stomach muscles. Make them hard like a board.',
      releaseInstruction: 'Release. Let your belly soften and relax completely.',
      icon: '🟫',
    },
    {
      name: 'Lower Back',
      body: 'Back muscles',
      tenseInstruction: 'Arch your lower back. Feel the tension along your spine.',
      releaseInstruction: 'Release. Let your back settle into a comfortable, natural position.',
      icon: '⬛',
    },
    {
      name: 'Legs',
      body: 'Thigh muscles',
      tenseInstruction: 'Tighten your thigh muscles. Make your legs stiff and straight.',
      releaseInstruction: 'Release. Let your legs go heavy and loose.',
      icon: '🦵',
    },
    {
      name: 'Feet',
      body: 'Calves and feet',
      tenseInstruction: 'Point your toes downward. Curl them under. Feel the tension.',
      releaseInstruction: 'Release. Let your feet relax completely. Toes soft.',
      icon: '🦶',
    },
  ];

  const handleNextPhase = () => {
    if (phase === 'intro' || phase === 'release') {
      if (currentIndex < muscleGroups.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setPhase('intro');
        if (phase === 'release') {
          setCompletedGroups([...completedGroups, currentIndex]);
        }
      } else {
        setCompletedGroups([...completedGroups, currentIndex]);
        setPhase('complete');
      }
    } else if (phase === 'tense') {
      setPhase('release');
    }
  };

  const startTense = () => {
    setPhase('tense');
  };

  if (phase === 'complete') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-lime-green text-white text-center py-12">
          <CheckCircle size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">Relaxation Complete</h1>
          <p className="text-xl opacity-90 font-body">You've relaxed all major muscle groups</p>
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">How Do You Feel?</h3>
          <p className="text-gray-700 font-body mb-3">
            Take a moment to scan your entire body. Notice the difference between how you felt before
            and how you feel now. Your body may feel:
          </p>
          <ul className="grid grid-cols-2 gap-2 text-gray-700 font-body mb-3">
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Heavy and relaxed</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Warm and loose</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Soft and comfortable</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Calm and peaceful</span>
            </li>
          </ul>
          <p className="text-gray-700 font-body">
            <strong>Practice tip:</strong> The more you practice PMR, the more quickly you can achieve
            deep relaxation. You can also use a shortened version, focusing on areas where you hold the most tension.
          </p>
        </div>

        <div className="card">
          <h3 className="font-subheader text-midnight-purple mb-3 uppercase">Muscle Groups Relaxed</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {muscleGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-lime-green bg-opacity-20 text-center p-3 rounded-lg"
              >
                <div className="text-3xl mb-1">{group.icon}</div>
                <div className="text-xs font-body text-gray-700">{group.name}</div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/" className="btn-primary w-full">Back to Dashboard</Link>
      </div>
    );
  }

  const current = muscleGroups[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader icon={<Sparkles size={24} className="text-white" />} title="Progressive Muscle Relaxation" subtitle="Release tension throughout your body" exerciseId="progressive-muscle-relaxation" exerciseName="Progressive Muscle Relaxation" />

      {currentIndex === 0 && phase === 'intro' && (
        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">How PMR Works</h3>
          <p className="text-gray-700 font-body mb-2">
            Progressive Muscle Relaxation (PMR) involves tensing and then releasing different muscle groups.
            By deliberately tensing first, the release becomes more noticeable and effective.
          </p>
          <p className="text-gray-700 font-body">
            <strong>For each muscle group:</strong> Tense for 5 seconds, then release for 10-15 seconds.
            Notice the difference between tension and relaxation.
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-subheader uppercase text-midnight-purple">Progress</span>
          <span className="font-body text-gray-600">
            {currentIndex + 1} / {muscleGroups.length} muscle groups
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-lime-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / muscleGroups.length) * 100}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
          {muscleGroups.map((_, idx) => (
            <div
              key={idx}
              className={`h-8 rounded flex items-center justify-center text-lg transition-all ${
                idx === currentIndex
                  ? 'bg-electric-blue text-white scale-110'
                  : completedGroups.includes(idx)
                  ? 'bg-lime-green text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {muscleGroups[idx].icon}
            </div>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="card bg-white border-2 border-midnight-purple animate-slide-in-up">
        <div className="text-center mb-6">
          <div className="text-7xl mb-4 animate-bounce-subtle">{current.icon}</div>
          <h2 className="text-3xl font-header text-midnight-purple mb-2">{current.name}</h2>
          <p className="text-sm font-subheader uppercase text-gray-600">{current.body}</p>
        </div>

        {phase === 'intro' && (
          <div className="text-center">
            <p className="text-gray-700 font-body mb-6">
              Get ready to tense and release your <strong>{current.body}</strong>.
              When you're ready, click the button below.
            </p>
            <button onClick={startTense} className="btn-primary w-full flex items-center justify-center space-x-2">
              <Play size={20} />
              <span>Start - Tense {current.name}</span>
            </button>
          </div>
        )}

        {phase === 'tense' && (
          <div className="bg-inferno-red bg-opacity-10 border-2 border-inferno-red rounded-lg p-6 mb-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-4xl animate-pulse">⚡</div>
              <h3 className="text-2xl font-header text-inferno-red">TENSE</h3>
              <div className="text-4xl animate-pulse">⚡</div>
            </div>
            <p className="text-gray-800 font-body text-center text-lg mb-6">
              {current.tenseInstruction}
            </p>
            <p className="text-sm text-center text-gray-600 font-body italic mb-4">
              Hold for 5 seconds... Feel the tension building...
            </p>
            <button onClick={handleNextPhase} className="btn-primary w-full">
              Release Now →
            </button>
          </div>
        )}

        {phase === 'release' && (
          <div className="bg-lime-green bg-opacity-10 border-2 border-lime-green rounded-lg p-6 mb-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-4xl animate-pulse-slow">✨</div>
              <h3 className="text-2xl font-header text-lime-green">RELEASE</h3>
              <div className="text-4xl animate-pulse-slow">✨</div>
            </div>
            <p className="text-gray-800 font-body text-center text-lg mb-6">
              {current.releaseInstruction}
            </p>
            <p className="text-sm text-center text-gray-600 font-body italic mb-4">
              Notice the difference... Feel the relaxation spreading... Let go completely...
            </p>
            <button onClick={handleNextPhase} className="btn-primary w-full flex items-center justify-center space-x-2">
              <span>{currentIndex === muscleGroups.length - 1 ? 'Complete Practice' : 'Next Muscle Group'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <Link to="/" className="btn-secondary w-full">Back to Dashboard</Link>
    </div>
  );
}
