import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, TrendingUp, TrendingDown } from 'lucide-react';
import ExerciseHeader from '../../components/ExerciseHeader';

interface Domain {
  name: string;
  importance: number;
  consistency: number;
}

export default function ValuedLivingQuestionnaire() {
  const [domains, setDomains] = useState<Domain[]>([
    { name: 'Family', importance: 5, consistency: 5 },
    { name: 'Marriage/Couples/Intimate Relations', importance: 5, consistency: 5 },
    { name: 'Parenting', importance: 5, consistency: 5 },
    { name: 'Friendships/Social Life', importance: 5, consistency: 5 },
    { name: 'Career/Employment', importance: 5, consistency: 5 },
    { name: 'Education/Personal Growth', importance: 5, consistency: 5 },
    { name: 'Recreation/Leisure', importance: 5, consistency: 5 },
    { name: 'Spirituality', importance: 5, consistency: 5 },
    { name: 'Citizenship/Community', importance: 5, consistency: 5 },
    { name: 'Physical Health', importance: 5, consistency: 5 },
  ]);
  const [completed, setCompleted] = useState(false);

  const updateDomain = (index: number, field: 'importance' | 'consistency', value: number) => {
    const newDomains = [...domains];
    newDomains[index][field] = value;
    setDomains(newDomains);
  };

  const getGap = (domain: Domain) => domain.importance - domain.consistency;
  const getAvgImportance = () => (domains.reduce((sum, d) => sum + d.importance, 0) / domains.length).toFixed(1);
  const getAvgConsistency = () => (domains.reduce((sum, d) => sum + d.consistency, 0) / domains.length).toFixed(1);
  const getBiggestGaps = () => domains.map((d, i) => ({ ...d, index: i })).sort((a, b) => getGap(b) - getGap(a)).slice(0, 3);
  const getStrongest = () => domains.filter(d => d.consistency >= 8 && d.importance >= 8);

  useEffect(() => { document.title = 'Valued Living Questionnaire | ACT Therapy'; }, []);

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-electric-blue text-white text-center py-12">
          <ClipboardList size={80} className="mx-auto mb-6" />
          <h1 className="text-4xl font-header mb-4">Valued Living Assessment</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center bg-electric-blue bg-opacity-10">
            <div className="text-4xl font-bold text-midnight-purple">{getAvgImportance()}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Avg Importance</div>
          </div>
          <div className="card text-center bg-brand-pink bg-opacity-10">
            <div className="text-4xl font-bold text-midnight-purple">{getAvgConsistency()}</div>
            <div className="text-xs font-subheader uppercase text-gray-600">Avg Consistency</div>
          </div>
        </div>

        <div className="card bg-inferno-red bg-opacity-10 border-2 border-inferno-red">
          <h3 className="font-subheader text-midnight-purple mb-3 flex items-center space-x-2">
            <TrendingDown size={20} />
            <span>Biggest Gaps (Where to Focus)</span>
          </h3>
          <div className="space-y-2">
            {getBiggestGaps().map((d, idx) => {
              const gap = getGap(d);
              return gap > 0 ? (
                <div key={idx} className="bg-white p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-gray-800">{d.name}</span>
                    <span className="text-inferno-red font-bold">Gap: {gap}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Importance: {d.importance} | Consistency: {d.consistency}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {getStrongest().length > 0 && (
          <div className="card bg-lime-green bg-opacity-10 border-2 border-lime-green">
            <h3 className="font-subheader text-midnight-purple mb-3 flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Strengths (Living Your Values)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {getStrongest().map((d, idx) => (
                <div key={idx} className="bg-white p-2 rounded text-center">
                  <div className="font-body text-gray-800">{d.name}</div>
                  <div className="text-xs text-lime-green">✓ Aligned</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Next Steps</h3>
          <p className="text-gray-700 font-body mb-3">
            Focus on your biggest gap areas. Choose ONE domain and ask:
          </p>
          <ul className="space-y-1 text-gray-700 font-body text-sm">
            <li>• What's one small action I could take this week to live more consistently with this value?</li>
            <li>• What's getting in the way of living this value?</li>
            <li>• What would it look like to move just 1 point closer to alignment?</li>
          </ul>
        </div>

        <Link to="/" className="btn-primary w-full">
          Complete Exercise
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <ExerciseHeader
        icon={<ClipboardList size={24} className="text-white" />}
        title="Valued Living Questionnaire"
        subtitle="Assess importance vs. consistency"
        exerciseId="valued-living-questionnaire"
        exerciseName="Valued Living Questionnaire"
      />

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Instructions</h3>
        <p className="text-gray-700 font-body">
          For each life domain, rate both <strong>importance</strong> (how important is this to you?)
          and <strong>consistency</strong> (how consistently are you living according to this value?).
        </p>
      </div>

      <div className="space-y-4">
        {domains.map((domain, idx) => (
          <div key={idx} className="card">
            <h3 className="font-subheader uppercase text-midnight-purple mb-3">{domain.name}</h3>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-body text-gray-600">Importance:</span>
                <span className="font-bold text-midnight-purple">{domain.importance}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={domain.importance}
                onChange={(e) => updateDomain(idx, 'importance', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Not at all</span>
                <span>Extremely</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-body text-gray-600">Consistency:</span>
                <span className="font-bold text-midnight-purple">{domain.consistency}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={domain.consistency}
                onChange={(e) => updateDomain(idx, 'consistency', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Not at all</span>
                <span>Completely</span>
              </div>
            </div>

            {getGap(domain) > 2 && (
              <div className="mt-2 text-xs text-inferno-red font-body">
                ⚠️ Gap: {getGap(domain)} points - Consider focusing here
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => setCompleted(true)} className="btn-primary w-full">
        View Assessment
      </button>
    </div>
  );
}
