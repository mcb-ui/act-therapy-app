import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

// Improvement #11: 404 Not Found page
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-midnight-purple opacity-5 rounded-full -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-electric-blue opacity-5 rounded-full -mr-48 -mb-48"></div>

      <div className="card max-w-lg w-full text-center animate-slide-in-up shadow-2xl relative z-10">
        <div className="text-8xl font-header text-midnight-purple mb-4">404</div>
        <h1 className="text-2xl font-header text-midnight-purple mb-3">Page Not Found</h1>
        <p className="text-gray-600 font-body mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track with your ACT journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center space-x-2"
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
