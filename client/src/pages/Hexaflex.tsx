import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Target, Brain, Zap, Heart, Eye, CheckSquare } from 'lucide-react';

// Improvement #16: Page title
// Improvement #42: Apply consistent brand styling
// Improvement #43: Animated transitions when selecting processes

export default function Hexaflex() {
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'ACT Hexaflex | ACT Therapy';
  }, []);

  const processes = [
    {
      id: 1,
      title: 'Values',
      icon: Target,
      color: 'bg-electric-blue',
      svgColor: '#2344E7',
      description: 'Clarifying what truly matters in your life',
      details:
        'Values are chosen life directions - the qualities you want to bring to your actions. They guide your behavior and give meaning to your life.',
      path: '/exercises/values',
    },
    {
      id: 2,
      title: 'Committed Action',
      icon: CheckSquare,
      color: 'bg-lime-green',
      svgColor: '#93F357',
      description: 'Taking effective action guided by values',
      details:
        'Committed action involves setting goals based on values and taking concrete steps toward them, even in the presence of obstacles.',
      path: '/exercises/action',
    },
    {
      id: 3,
      title: 'Present Moment',
      icon: Zap,
      color: 'bg-lime-green',
      svgColor: '#93F357',
      description: 'Flexible awareness of the here and now',
      details:
        'Being psychologically present means having flexible awareness of the present moment without excessive attachment to thoughts or feelings.',
      path: '/exercises/mindfulness',
    },
    {
      id: 4,
      title: 'Self-as-Context',
      icon: Eye,
      color: 'bg-midnight-purple',
      svgColor: '#784A9F',
      description: 'The observing self - your perspective-taking ability',
      details:
        'This is your ability to take perspective on your own experiences - the "you" that notices your thoughts and feelings without being defined by them.',
      path: '/exercises/observer-self',
    },
    {
      id: 5,
      title: 'Defusion',
      icon: Brain,
      color: 'bg-midnight-purple',
      svgColor: '#784A9F',
      description: 'Stepping back from thoughts',
      details:
        'Cognitive defusion means seeing thoughts as what they are - just words and pictures - rather than what they say they are.',
      path: '/exercises/defusion',
    },
    {
      id: 6,
      title: 'Acceptance',
      icon: Heart,
      color: 'bg-inferno-red',
      svgColor: '#EC4625',
      description: 'Making room for difficult experiences',
      details:
        'Acceptance means opening up and making room for painful feelings, sensations, and urges, allowing them to come and go without struggling.',
      path: '/exercises/acceptance',
    },
  ];

  const hexagonPoints = [
    { x: 100, y: 20 },
    { x: 170, y: 60 },
    { x: 170, y: 140 },
    { x: 100, y: 180 },
    { x: 30, y: 140 },
    { x: 30, y: 60 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Hexagon size={48} className="text-midnight-purple" />
          <h1 className="text-4xl md:text-5xl font-header text-midnight-purple hover-glow">ACT Hexaflex</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
          The six core processes of Acceptance and Commitment Therapy work together to build
          psychological flexibility - the ability to be present, open up, and do what matters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-subheader text-midnight-purple mb-6 text-center uppercase">
            The Six Processes
          </h2>

          <div className="relative w-full aspect-square max-w-2xl mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Draw hexagon */}
              <polygon
                points={hexagonPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#E7DCEF"
                strokeWidth="0.5"
              />

              {/* Draw connecting lines */}
              {hexagonPoints.map((point, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={point.x}
                  y2={point.y}
                  stroke="#E7DCEF"
                  strokeWidth="1"
                />
              ))}

              {/* Central circle */}
              <circle
                cx="100"
                cy="100"
                r="30"
                fill="url(#brand-gradient)"
                stroke="#784A9F"
                strokeWidth="2"
              />
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="fill-white font-bold"
                fontSize="10"
              >
                Psychological
              </text>
              <text
                x="100"
                y="110"
                textAnchor="middle"
                className="fill-white font-bold"
                fontSize="10"
              >
                Flexibility
              </text>

              <defs>
                <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#784A9F" />
                  <stop offset="100%" stopColor="#2344E7" />
                </linearGradient>
              </defs>

              {/* Process nodes */}
              {processes.map((process, index) => {
                const point = hexagonPoints[index];
                let textY = point.y;
                if (point.y < 100) {
                  textY = point.y - 22;
                } else {
                  textY = point.y + 28;
                }
                const isSelected = selectedProcess === process.id;

                return (
                  <g
                    key={process.id}
                    onClick={() => setSelectedProcess(process.id)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${process.title}`}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProcess(process.id); }}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isSelected ? 18 : 16}
                      fill={isSelected ? process.svgColor : 'white'}
                      stroke={process.svgColor}
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    <text
                      x={point.x}
                      y={textY}
                      textAnchor="middle"
                      className="font-bold"
                      fill={isSelected ? process.svgColor : '#784A9F'}
                      fontSize="11"
                    >
                      {process.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-center text-gray-600 text-sm mt-4 font-body">
            Click on a process to learn more
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-subheader text-midnight-purple uppercase">Process Details</h2>

          {selectedProcess ? (
            (() => {
              const process = processes.find((p) => p.id === selectedProcess)!;
              const Icon = process.icon;
              return (
                <div className="card animate-slide-in-up" key={process.id}>
                  <div
                    className={`w-16 h-16 rounded-2xl ${process.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-subheader text-midnight-purple mb-2 uppercase">{process.title}</h3>
                  <p className="text-gray-600 mb-4 font-body">{process.description}</p>
                  <p className="text-gray-700 mb-6 font-body leading-relaxed">{process.details}</p>
                  {process.path !== '/' && (
                    <Link to={process.path} className="btn-primary inline-block">
                      Try Exercise
                    </Link>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="card text-center py-12">
              <Hexagon size={64} className="mx-auto text-midnight-purple opacity-20 mb-4" />
              <p className="text-gray-600 font-body">
                Select a process from the hexaflex to learn more about it
              </p>
            </div>
          )}

          <div className="card bg-parchment border-2 border-midnight-purple">
            <h3 className="font-subheader text-midnight-purple mb-2 uppercase">
              How the Processes Work Together
            </h3>
            <p className="text-gray-700 text-sm font-body leading-relaxed">
              The six processes are interconnected. The top three (Acceptance, Defusion,
              Present Moment) help you be more open and aware. The bottom three (Self-as-Context,
              Values, Committed Action) help you be more engaged and purposeful. Together, they
              build psychological flexibility.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processes.map((process) => {
          const Icon = process.icon;
          const isSelected = selectedProcess === process.id;
          return (
            <div
              key={process.id}
              className={`card hover-lift cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-electric-blue ring-offset-2' : ''
              }`}
              onClick={() => setSelectedProcess(process.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProcess(process.id); }}
            >
              <div
                className={`w-12 h-12 rounded-xl ${process.color} flex items-center justify-center mb-3 shadow-lg`}
              >
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-subheader text-midnight-purple mb-2 uppercase">{process.title}</h3>
              <p className="text-gray-600 text-sm font-body">{process.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
