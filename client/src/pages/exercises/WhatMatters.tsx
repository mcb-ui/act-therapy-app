import { useState } from 'react';
import { Heart, Star, Check, X } from 'lucide-react';

interface Value {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function WhatMatters() {
  const allValues: Value[] = [
    { id: 'family', name: 'Family', description: 'Being close with family members', category: 'relationships' },
    { id: 'friendship', name: 'Friendship', description: 'Having meaningful friendships', category: 'relationships' },
    { id: 'love', name: 'Love', description: 'Romantic love and intimacy', category: 'relationships' },
    { id: 'compassion', name: 'Compassion', description: 'Caring for others', category: 'relationships' },
    { id: 'achievement', name: 'Achievement', description: 'Accomplishing goals', category: 'personal' },
    { id: 'growth', name: 'Personal Growth', description: 'Learning and developing', category: 'personal' },
    { id: 'creativity', name: 'Creativity', description: 'Being creative and innovative', category: 'personal' },
    { id: 'autonomy', name: 'Autonomy', description: 'Being independent', category: 'personal' },
    { id: 'health', name: 'Health', description: 'Physical and mental wellbeing', category: 'wellbeing' },
    { id: 'adventure', name: 'Adventure', description: 'Seeking new experiences', category: 'wellbeing' },
    { id: 'pleasure', name: 'Pleasure', description: 'Enjoying life and having fun', category: 'wellbeing' },
    { id: 'mindfulness', name: 'Mindfulness', description: 'Being present and aware', category: 'wellbeing' },
    { id: 'justice', name: 'Justice', description: 'Fairness and equality', category: 'contribution' },
    { id: 'service', name: 'Service', description: 'Helping and serving others', category: 'contribution' },
    { id: 'environment', name: 'Environment', description: 'Protecting nature', category: 'contribution' },
    { id: 'community', name: 'Community', description: 'Being part of community', category: 'contribution' },
    { id: 'spirituality', name: 'Spirituality', description: 'Connection to something greater', category: 'meaning' },
    { id: 'wisdom', name: 'Wisdom', description: 'Understanding and insight', category: 'meaning' },
    { id: 'beauty', name: 'Beauty', description: 'Appreciating beauty', category: 'meaning' },
    { id: 'authenticity', name: 'Authenticity', description: 'Being true to yourself', category: 'meaning' },
  ];

  const [step, setStep] = useState<'select' | 'rank' | 'complete'>('select');
  const [selectedValues, setSelectedValues] = useState<Value[]>([]);
  const [rankedValues, setRankedValues] = useState<Value[]>([]);

  const categoryColors: Record<string, string> = {
    relationships: 'bg-brand-pink',
    personal: 'bg-electric-blue',
    wellbeing: 'bg-lime-green',
    contribution: 'bg-midnight-purple',
    meaning: 'bg-inferno-red',
  };

  const categoryNames: Record<string, string> = {
    relationships: 'Relationships',
    personal: 'Personal',
    wellbeing: 'Wellbeing',
    contribution: 'Contribution',
    meaning: 'Meaning',
  };

  const toggleValue = (value: Value) => {
    if (selectedValues.find(v => v.id === value.id)) {
      setSelectedValues(selectedValues.filter(v => v.id !== value.id));
    } else {
      if (selectedValues.length < 10) {
        setSelectedValues([...selectedValues, value]);
      }
    }
  };

  const handleProceedToRank = () => {
    setRankedValues(selectedValues);
    setStep('rank');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRanked = [...rankedValues];
    [newRanked[index], newRanked[index - 1]] = [newRanked[index - 1], newRanked[index]];
    setRankedValues(newRanked);
  };

  const moveDown = (index: number) => {
    if (index === rankedValues.length - 1) return;
    const newRanked = [...rankedValues];
    [newRanked[index], newRanked[index + 1]] = [newRanked[index + 1], newRanked[index]];
    setRankedValues(newRanked);
  };

  if (step === 'complete') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card bg-gradient-to-br from-electric-blue to-midnight-purple text-white text-center py-12">
          <Heart size={80} className="mx-auto mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-header mb-4">What Matters Most to You</h1>
          <p className="text-xl opacity-90 font-body">Your top values in priority order</p>
        </div>

        <div className="space-y-3">
          {rankedValues.map((value, idx) => (
            <div
              key={value.id}
              className="card hover-lift animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full ${categoryColors[value.category]} flex items-center justify-center text-white flex-shrink-0`}>
                  <span className="text-2xl font-bold">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-subheader uppercase text-midnight-purple text-lg">{value.name}</h3>
                  <p className="text-sm text-gray-600 font-body">{value.description}</p>
                  <span className="text-xs text-gray-500 font-body uppercase">{categoryNames[value.category]}</span>
                </div>
                {idx === 0 && (
                  <div className="flex items-center space-x-1 bg-lime-green text-white px-3 py-1 rounded-full">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold">Top Priority</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Living Your Values</h3>
          <p className="text-gray-700 font-body mb-3">
            Now that you've identified your core values, the next step is to align your actions with them.
          </p>
          <p className="text-gray-700 font-body mb-2">
            <strong>For your #1 value ({rankedValues[0]?.name}):</strong>
          </p>
          <ul className="space-y-2 text-gray-700 font-body ml-4">
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>What does living this value look like in daily life?</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>What's one small action you could take this week to honor this value?</span>
            </li>
            <li className="flex items-start">
              <span className="text-electric-blue mr-2">•</span>
              <span>What obstacles might get in your way, and how will you navigate them?</span>
            </li>
          </ul>
        </div>

        <button onClick={() => window.history.back()} className="btn-primary w-full">
          Complete Exercise
        </button>
      </div>
    );
  }

  if (step === 'rank') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue to-midnight-purple flex items-center justify-center">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-header text-midnight-purple">Rank Your Values</h1>
            <p className="text-gray-600 font-body">Put them in order of importance</p>
          </div>
        </div>

        <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
          <p className="text-gray-700 font-body">
            Drag or use the arrows to rank your values from most important (top) to least important (bottom).
            This helps clarify your priorities when values might conflict.
          </p>
        </div>

        <div className="space-y-2">
          {rankedValues.map((value, idx) => (
            <div
              key={value.id}
              className="card hover-lift animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${categoryColors[value.category]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-subheader uppercase text-midnight-purple">{value.name}</h3>
                  <p className="text-xs text-gray-600 font-body">{value.description}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 hover:bg-electric-blue hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === rankedValues.length - 1}
                    className="p-1 hover:bg-electric-blue hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setStep('complete')} className="btn-primary w-full">
          Confirm Rankings
        </button>
      </div>
    );
  }

  // Select step
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue to-midnight-purple flex items-center justify-center">
          <Heart size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-header text-midnight-purple">What Matters Most</h1>
          <p className="text-gray-600 font-body">Identify your core values</p>
        </div>
      </div>

      <div className="card bg-electric-blue bg-opacity-10 border-2 border-electric-blue">
        <h3 className="font-subheader text-midnight-purple mb-2 uppercase">Instructions</h3>
        <p className="text-gray-700 font-body">
          Select 5-10 values that resonate most deeply with you. Don't overthink it - trust your gut.
          In the next step, you'll rank them in order of importance.
        </p>
        <div className="mt-2 text-sm font-body text-gray-600">
          Selected: {selectedValues.length} / 10
        </div>
      </div>

      {Object.entries(categoryNames).map(([category, name]) => {
        const categoryValues = allValues.filter(v => v.category === category);
        return (
          <div key={category}>
            <h2 className="font-subheader uppercase text-midnight-purple mb-3 flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category]}`}></div>
              <span>{name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {categoryValues.map((value, idx) => {
                const isSelected = selectedValues.find(v => v.id === value.id);
                return (
                  <button
                    key={value.id}
                    onClick={() => toggleValue(value)}
                    disabled={!isSelected && selectedValues.length >= 10}
                    className={`card text-left hover-lift transition-all animate-slide-in-up ${
                      isSelected
                        ? `${categoryColors[category]} text-white border-2 border-transparent`
                        : 'hover:border-2 hover:border-midnight-purple'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-subheader uppercase mb-1 ${isSelected ? 'text-white' : 'text-midnight-purple'}`}>
                          {value.name}
                        </h3>
                        <p className={`text-sm font-body ${isSelected ? 'text-white opacity-90' : 'text-gray-600'}`}>
                          {value.description}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {isSelected ? (
                          <Check size={24} className="text-white" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={handleProceedToRank}
        disabled={selectedValues.length < 3}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedValues.length < 3 ? 'Select at least 3 values' : `Proceed to Rank ${selectedValues.length} Values`}
      </button>
    </div>
  );
}
