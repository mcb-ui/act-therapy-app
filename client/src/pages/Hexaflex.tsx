import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Hexagon, Target, Brain, Zap, Heart, Eye, CheckSquare } from 'lucide-react'

export default function Hexaflex() {
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null)

  const processes = [
    {
      id: 1,
      title: 'Values',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      description: 'Clarifying what truly matters in your life',
      details:
        'Values are chosen life directions - the qualities you want to bring to your actions. They guide your behavior and give meaning to your life.',
      path: '/exercises/values',
    },
    {
      id: 2,
      title: 'Committed Action',
      icon: CheckSquare,
      color: 'from-green-500 to-green-600',
      description: 'Taking effective action guided by values',
      details:
        'Committed action involves setting goals based on values and taking concrete steps toward them, even in the presence of obstacles.',
      path: '/exercises/action',
    },
    {
      id: 3,
      title: 'Present Moment',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      description: 'Flexible awareness of the here and now',
      details:
        'Being psychologically present means having flexible awareness of the present moment without excessive attachment to thoughts or feelings.',
      path: '/exercises/mindfulness',
    },
    {
      id: 4,
      title: 'Self-as-Context',
      icon: Eye,
      color: 'from-indigo-500 to-indigo-600',
      description: 'The observing self - your perspective-taking ability',
      details:
        'This is your ability to take perspective on your own experiences - the "you" that notices your thoughts and feelings without being defined by them.',
      path: '/',
    },
    {
      id: 5,
      title: 'Defusion',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      description: 'Stepping back from thoughts',
      details:
        'Cognitive defusion means seeing thoughts as what they are - just words and pictures - rather than what they say they are.',
      path: '/exercises/defusion',
    },
    {
      id: 6,
      title: 'Acceptance',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      description: 'Making room for difficult experiences',
      details:
        'Acceptance means opening up and making room for painful feelings, sensations, and urges, allowing them to come and go without struggling.',
      path: '/exercises/acceptance',
    },
  ]

  const hexagonPoints = [
    { x: 50, y: 5 }, // Top
    { x: 93.3, y: 27.5 }, // Top right
    { x: 93.3, y: 72.5 }, // Bottom right
    { x: 50, y: 95 }, // Bottom
    { x: 6.7, y: 72.5 }, // Bottom left
    { x: 6.7, y: 27.5 }, // Top left
  ]

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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Six Processes</h2>

          <div className="relative w-full aspect-square max-w-md mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
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
                  x1="50"
                  y1="50"
                  x2={point.x}
                  y2={point.y}
                  stroke="#e5e7eb"
                  strokeWidth="0.3"
                />
              ))}

              {/* Central circle */}
              <circle
                cx="50"
                cy="50"
                r="15"
                fill="url(#gradient)"
                stroke="#0ea5e9"
                strokeWidth="0.5"
              />
              <text
                x="50"
                y="47"
                textAnchor="middle"
                className="text-xs fill-white font-bold"
                fontSize="5"
              >
                Psychological
              </text>
              <text
                x="50"
                y="53"
                textAnchor="middle"
                className="text-xs fill-white font-bold"
                fontSize="5"
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
                const point = hexagonPoints[index]
                return (
                  <g
                    key={process.id}
                    onClick={() => setSelectedProcess(process.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="8"
                      className={`transition-all ${
                        selectedProcess === process.id
                          ? 'fill-primary-600'
                          : 'fill-white stroke-gray-300'
                      }`}
                      strokeWidth="0.5"
                    />
                    <text
                      x={point.x}
                      y={point.y > 50 ? point.y + 15 : point.y - 10}
                      textAnchor="middle"
                      className={`text-xs font-semibold ${
                        selectedProcess === process.id ? 'fill-primary-700' : 'fill-gray-700'
                      }`}
                      fontSize="4"
                    >
                      {process.title}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <p className="text-center text-gray-600 text-sm mt-4">Click on a process to learn more</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Process Details</h2>

          {selectedProcess ? (
            (() => {
              const process = processes.find((p) => p.id === selectedProcess)!
              const Icon = process.icon
              return (
                <div className="card">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${process.color} flex items-center justify-center mb-4`}
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
              )
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
            <h3 className="font-semibold text-primary-900 mb-2">How the Processes Work Together</h3>
            <p className="text-primary-800 text-sm">
              The six processes are interconnected. The top three (Acceptance, Defusion, Present
              Moment) help you be more open and aware. The bottom three (Self-as-Context, Values,
              Committed Action) help you be more engaged and purposeful. Together, they build
              psychological flexibility.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processes.map((process) => {
          const Icon = process.icon
          return (
            <div
              key={process.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProcess(process.id)}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${process.color} flex items-center justify-center mb-3`}
              >
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{process.title}</h3>
              <p className="text-gray-600 text-sm">{process.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
