import { Link, useLocation } from 'react-router-dom';
import { Home, Hexagon, LogOut, TrendingUp, BookOpen, MessageCircle, Sparkles, Menu, X, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Improvement #13: Mobile hamburger menu
// Improvement #17: Active nav link highlighting
// Improvement #18: Footer component
// Improvement #23: Use AuthContext instead of prop drilling

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: '/', label: 'Home', icon: Home, hoverColor: 'hover:text-electric-blue hover:bg-electric-blue' },
  { to: '/modules', label: 'Modules', icon: BookOpen, hoverColor: 'hover:text-midnight-purple hover:bg-midnight-purple' },
  { to: '/progress', label: 'Progress', icon: TrendingUp, hoverColor: 'hover:text-lime-green hover:bg-lime-green' },
  { to: '/coach', label: 'Coach', icon: MessageCircle, hoverColor: 'hover:text-inferno-red hover:bg-inferno-red', sparkle: true },
  { to: '/hexaflex', label: 'Hexaflex', icon: Hexagon, hoverColor: 'hover:text-brand-pink hover:bg-brand-pink' },
];

export default function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // User Improvement #44: Back to top button
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-white shadow-sm border-b-2 border-midnight-purple sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/logos/logo.png"
                  alt="Dr. MCB Logo"
                  className="h-10 w-auto"
                />
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md font-subheader uppercase text-sm transition-all relative ${
                        active
                          ? 'text-electric-blue bg-electric-blue bg-opacity-10 font-bold'
                          : `text-gray-700 ${link.hoverColor} hover:bg-opacity-10`
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon size={18} />
                      <span>{link.label}</span>
                      {link.sparkle && (
                        <Sparkles size={14} className="text-electric-blue absolute -top-1 -right-1" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={logout}
                className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-inferno-red px-3 py-2 rounded-md font-subheader uppercase text-sm transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white animate-slide-in-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-subheader uppercase text-sm transition-all ${
                      active
                        ? 'text-electric-blue bg-electric-blue bg-opacity-10'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-inferno-red font-subheader uppercase text-sm w-full text-left hover:bg-gray-50 transition-all"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Improvement #18: Footer */}
      <footer className="bg-midnight-purple text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="font-subheader uppercase text-sm tracking-wider">ACT Therapy Tool</p>
              <p className="text-white/60 text-xs font-body mt-1">
                Building psychological flexibility through practice
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/modules" className="text-white/80 hover:text-white text-sm font-body transition-colors">Modules</Link>
              <Link to="/progress" className="text-white/80 hover:text-white text-sm font-body transition-colors">Progress</Link>
              <Link to="/hexaflex" className="text-white/80 hover:text-white text-sm font-body transition-colors">Hexaflex</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* User Improvement #44: Back to top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-midnight-purple text-white shadow-xl hover:bg-midnight-purple-600 hover:scale-110 transition-all flex items-center justify-center animate-slide-in-up"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}
