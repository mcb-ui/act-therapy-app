import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Target, Brain, Zap, Heart, Eye, CheckSquare } from 'lucide-react';

export default function Hexaflex() {
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);

  const processes = [
    {
      id: 1,
      title: 'Values',
      icon: Target,
      color: 'bg-electric-blue',
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
      description: 'Making room for difficult experiences',
      details:
        'Acceptance means opening up and making room for painful feelings, sensations, and urges, allowing them to come and go without struggling.',
      path: '/exercises/acceptance',
    },
  ];

  const hexagonPoints = [
    { x: 100, y: 20 }, // Top
    { x: 170, y: 60 }, // Top right
    { x: 170, y: 140 }, // Bottom right
    { x: 100, y: 180 }, // Bottom
    { x: 30, y: 140 }, // Bottom left
    { x: 30, y: 60 }, // Top left
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Hexagon size={48} className="text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-900">ACT Hexaflex</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The six core processes of Acceptance and Commitment Therapy work together to build
          psychological flexibility - the ability to be present, open up, and do what matters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            The Six Processes
          </h2>

          <div className="relative w-full aspect-square max-w-2xl mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Draw hexagon */}
              <polygon
                points={hexagonPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#e5e7eb"
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
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Central circle */}
              <circle
                cx="100"
                cy="100"
                r="30"
                fill="url(#gradient)"
                stroke="#0ea5e9"
                strokeWidth="2"
              />
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="fill-white font-bold"
                fontSize="12"
              >
                Psychological
              </text>
              <text
                x="100"
                y="110"
                textAnchor="middle"
                className="fill-white font-bold"
                fontSize="12"
              >
                Flexibility
              </text>

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              {/* Process nodes */}
              {processes.map((process, index) => {
                const point = hexagonPoints[index];
                // Calculate text position based on node position
                let textY = point.y;
                if (point.y < 100) {
                  textY = point.y - 22; // Above for top nodes
                } else {
                  textY = point.y + 28; // Below for bottom nodes
                }

                return (
                  <g
                    key={process.id}
                    onClick={() => setSelectedProcess(process.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {/* Node circle */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="16"
                      className={`transition-all ${
                        selectedProcess === process.id
                          ? 'fill-primary-600'
                          : 'fill-white stroke-gray-400'
                      }`}
                      strokeWidth="2"
                    />
                    {/* Label text */}
                    <text
                      x={point.x}
                      y={textY}
                      textAnchor="middle"
                      className={`font-bold ${
                        selectedProcess === process.id ? 'fill-primary-700' : 'fill-gray-700'
                      }`}
                      fontSize="11"
                    >
                      {process.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-center text-gray-600 text-sm mt-4">
            Click on a process to learn more
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Process Details</h2>

          {selectedProcess ? (
            (() => {
              const process = processes.find((p) => p.id === selectedProcess)!;
              const Icon = process.icon;
              return (
                <div className="card">
                  <div
                    className={`w-16 h-16 rounded-2xl ${process.color} flex items-center justify-center mb-4`}
                  >
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{process.title}</h3>
                  <p className="text-gray-600 mb-4">{process.description}</p>
                  <p className="text-gray-700 mb-6">{process.details}</p>
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
              <Hexagon size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">
                Select a process from the hexaflex to learn more about it
              </p>
            </div>
          )}

          <div className="card bg-primary-50 border-primary-200">
            <h3 className="font-semibold text-primary-900 mb-2">
              How the Processes Work Together
            </h3>
            <p className="text-primary-800 text-sm">
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
          return (
            <div
              key={process.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProcess(process.id)}
            >
              <div
                className={`w-12 h-12 rounded-xl ${process.color} flex items-center justify-center mb-3`}
              >
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{process.title}</h3>
              <p className="text-gray-600 text-sm">{process.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
