import { useState } from 'react';
import { LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react';
import ExerciseBackButton from '../../components/ExerciseBackButton';

interface Domain {
  id: string;
  name: string;
  description: string;
  satisfaction: number;
  color: string;
  icon: string;
}

export default function LifeDomains() {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: 'family',
      name: 'Family',
      description: 'Relationships with family members',
      satisfaction: 5,
      color: 'bg-electric-blue',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      id: 'friends',
      name: 'Friends/Social',
      description: 'Friendships and social connections',
      satisfaction: 5,
      color: 'bg-brand-pink',
      icon: '🤝',
    },
    {
      id: 'intimate',
      name: 'Intimate Relationships',
      description: 'Romantic or intimate partnerships',
      satisfaction: 5,
      color: 'bg-inferno-red',
      icon: '❤️',
    },
    {
      id: 'work',
      name: 'Work/Career',
      description: 'Job, career, professional development',
      satisfaction: 5,
      color: 'bg-midnight-purple',
      icon: '💼',
    },
    {
      id: 'education',
      name: 'Education/Learning',
      description: 'Formal and informal learning',
      satisfaction: 5,
      color: 'bg-electric-blue',
      icon: '📚',
    },
    {
      id: 'recreation',
      name: 'Recreation/Fun',
      description: 'Hobbies, leisure, entertainment',
      satisfaction: 5,
      color: 'bg-lime-green',
      icon: '🎨',
    },
    {
      id: 'health',
      name: 'Physical Health',
      description: 'Exercise, nutrition, medical care',
      satisfaction: 5,
      color: 'bg-inferno-red',
      icon: '💪',
    },
    {
      id: 'mental',
      name: 'Mental Wellbeing',
      description: 'Emotional health, stress management',
      satisfaction: 5,
      color: 'bg-brand-pink',
      icon: '🧘',
    },
    {
      id: 'spirituality',
      name: 'Spirituality',
      description: 'Faith, meaning, purpose',
      satisfaction: 5,
      color: 'bg-midnight-purple',
      icon: '✨',
    },
    {
      id: 'community',
      name: 'Community',
      description: 'Citizenship, volunteering, contributing',
      satisfaction: 5,
      color: 'bg-lime-green',
      icon: '🌍',
    },
  ]);
  const [completed, setCompleted] = useState(false);

  const handleSliderChange = (id: string, value: number) => {
    setDomains(domains.map(d => d.id === id ? { ...d, satisfaction: value } : d));
  };

  const getAverage = () => {
    const sum = domains.reduce((acc, d) => acc + d.satisfaction, 0);
    return (sum / domains.length).toFixed(1);
  };

  const getStrengths = () => domains.filter(d => d.satisfaction >= 8);
  const getNeedsAttention = () => domains.filter(d => d.satisfaction <= 4);

  const handleComplete = () => {
    setCompleted(true);
  };

  if (completed) {
    const avg = parseFloat(getAverage());
    const strengths = getStrengths();
    const needsAttention = getNeedsAttention();

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-electric-blue text-white text-center py-12">
          <LayoutGrid size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">Life Domains Assessment</h1>
          <p className="text-xl opacity-90 font-body mb-4">Your satisfaction across all life areas</p>
          <div className="text-5xl font-header">{avg} / 10</div>
          <p className="text-sm opacity-75 font-body mt-2">Overall Life Satisfaction</p>
        </div>

        {/* Visual Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {domains.map((domain, idx) => (
            <div
              key={domain.id}
              className="card hover-lift text-center animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="text-4xl mb-2">{domain.icon}</div>
              <div className="text-xs font-subheader uppercase text-midnight-purple mb-2">{domain.name}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className={`${domain.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${domain.satisfaction * 10}%` }}
                ></div>
              </div>
              <div className="text-lg font-bold text-midnight-purple">{domain.satisfaction}</div>
            </div>
          ))}
        </div>

        {/* Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="text-lime-green" size={24} />
                <h3 className="font-subheader uppercase text-midnight-purple">Strengths ({strengths.length})</h3>
              </div>
              <ul className="space-y-2">
                {strengths.map(d => (
                  <li key={d.id} className="flex items-center space-x-2 text-gray-700 font-body">
                    <span className="text-2xl">{d.icon}</span>
                    <span>{d.name} ({d.satisfaction}/10)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {needsAttention.length > 0 && (
            <div className="card bg-inferno-red bg-opacity-10 border-2 border-inferno-red">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingDown className="text-inferno-red" size={24} />
                <h3 className="font-subheader uppercase text-midnight-purple">Needs Attention ({needsAttention.length})</h3>
              </div>
              <ul className="space-y-2">
                {needsAttention.map(d => (
                  <li key={d.id} className="flex items-center space-x-2 text-gray-700 font-body">
                    <span className="text-2xl">{d.icon}</span>
                    <span>{d.name} ({d.satisfaction}/10)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Next Steps</h3>
          <ul className="space-y-2 text-gray-700 font-body">
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Celebrate your strengths - these are areas where you're living in alignment with your values</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Choose ONE area that needs attention and identify one small action to improve it this week</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>Remember: Balance doesn't mean all 10s. It means giving attention to what matters most.</span>
            </li>
          </ul>
        </div>

        <ExerciseBackButton label="Complete Exercise" variant="primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-electric-blue flex items-center justify-center">
          <LayoutGrid size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">Life Domains Assessment</h1>
          <p className="text-gray-600 font-body">Rate your satisfaction across all life areas</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Instructions</h3>
        <p className="text-gray-700 font-body">
          Rate your current satisfaction in each life domain from 1 (very dissatisfied) to 10 (completely satisfied).
          Be honest - this is just for you to identify areas you'd like to focus on.
        </p>
      </div>

      <div className="space-y-4">
        {domains.map((domain, idx) => (
          <div
            key={domain.id}
            className="card hover-lift animate-slide-in-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-5xl flex-shrink-0">{domain.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-subheader uppercase text-midnight-purple">{domain.name}</h3>
                  <span className="text-2xl font-bold text-midnight-purple">{domain.satisfaction}</span>
                </div>
                <p className="text-sm text-gray-600 font-body mb-3">{domain.description}</p>

                {/* Slider */}
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 font-body">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={domain.satisfaction}
                    onChange={(e) => handleSliderChange(domain.id, parseInt(e.target.value))}
                    className="flex-1 h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #1F8996 0%, #1F8996 ${domain.satisfaction * 10}%, #DED8DD ${domain.satisfaction * 10}%, #DED8DD 100%)`
                    }}
                  />
                  <span className="text-xs text-gray-500 font-body">10</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleComplete} className="btn-primary w-full">
        View Results
      </button>
    </div>
  );
}
