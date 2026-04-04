import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Hexagon,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePracticeSession } from '../hooks/usePracticeSession';
import {
  formatPracticeSessionAge,
  getPracticeSessionExercise,
  recordPracticeSession,
} from '../lib/practiceSession';
import { exerciseByRoute } from '../data/exerciseCatalog';
import ExerciseProgressDock from './ExerciseProgressDock';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { to: '/', label: 'Home', icon: Home, accent: 'text-electric-blue' },
  { to: '/modules', label: 'Modules', icon: BookOpen, accent: 'text-midnight-purple' },
  { to: '/progress', label: 'Progress', icon: TrendingUp, accent: 'text-lime-green' },
  { to: '/coach', label: 'Coach', icon: MessageCircle, accent: 'text-inferno-red' },
  { to: '/hexaflex', label: 'Hexaflex', icon: Hexagon, accent: 'text-brand-pink' },
] as const;

const navItemBase =
  'flex items-center gap-2 rounded-xl px-4 py-3 text-[11px] font-subheader uppercase tracking-[0.16em] transition-all';

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const practiceSession = usePracticeSession();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const exercise = exerciseByRoute.get(location.pathname);

    if (!exercise) {
      return;
    }

    recordPracticeSession({
      exerciseId: exercise.id,
      route: exercise.route,
      title: exercise.title,
      processId: exercise.processId,
      visitedAt: new Date().toISOString(),
    });
  }, [location.pathname]);

  const initials = useMemo(() => {
    const name = user?.name?.trim();
    if (!name) {
      return 'A';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [user?.name]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const resumablePractice = useMemo(() => {
    if (!practiceSession || practiceSession.route === location.pathname) {
      return null;
    }

    const exercise = getPracticeSessionExercise(practiceSession);

    if (!exercise) {
      return null;
    }

    return {
      exercise,
      subtitle: formatPracticeSessionAge(practiceSession.visitedAt),
    };
  }, [location.pathname, practiceSession]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,137,150,0.08),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(68,37,103,0.08),_transparent_28%),linear-gradient(180deg,#fcfafb_0%,#f5f2f4_100%)] text-[#1f142f]">
      <nav className="sticky top-0 z-40 border-b border-brand-pink/35 bg-[rgba(252,250,251,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-1 transition hover:border-brand-pink/40 hover:bg-white/80"
            >
              <img src="/logos/logo.png" alt="Dr. MCB Logo" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <p className="font-subheader text-[10px] uppercase tracking-[0.22em] text-electric-blue">
                  ACT Therapy
                </p>
                <p className="font-body text-sm text-[#4e3f5e]">Acceptance and Commitment Practice</p>
              </div>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${navItemBase} ${
                        isActive
                          ? 'bg-midnight-purple text-white shadow-[0_16px_36px_rgba(31,20,47,0.14)]'
                          : 'text-[#4e3f5e] hover:bg-white hover:text-electric-blue hover:shadow-md'
                      }`
                    }
                  >
                    <Icon size={18} className={item.to === '/coach' ? 'relative' : undefined} />
                    <span>{item.label}</span>
                    {item.to === '/coach' && <Sparkles size={14} className="text-electric-blue" />}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {resumablePractice && (
              <Link
                to={resumablePractice.exercise.route}
                className="flex items-center gap-3 rounded-xl border border-electric-blue/15 bg-electric-blue/5 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                <div>
                  <p className="font-subheader text-[10px] uppercase tracking-[0.2em] text-electric-blue">
                    Resume Practice
                  </p>
                  <p className="font-body text-sm font-semibold text-midnight-purple">
                    {resumablePractice.exercise.title}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 font-subheader text-[10px] uppercase tracking-[0.16em] text-gray-500">
                  {resumablePractice.subtitle}
                </span>
              </Link>
            )}

            <div className="rounded-xl border border-brand-pink/35 bg-white/80 px-4 py-2 shadow-sm">
              <p className="font-subheader text-[10px] uppercase tracking-[0.2em] text-[#8c8199]">
                Signed In
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-midnight-purple text-sm font-subheader text-white">
                  {initials}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-midnight-purple">
                    {user?.name ?? 'ACT User'}
                  </p>
                  <p className="font-body text-xs text-[#8c8199]">{user?.email ?? 'Session active'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-transparent px-4 py-3 font-subheader text-xs uppercase tracking-[0.18em] text-[#4e3f5e] transition hover:border-inferno-red/20 hover:bg-inferno-red/10 hover:text-inferno-red"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/40 bg-white text-midnight-purple shadow-sm transition hover:bg-midnight-purple hover:text-white lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-brand-pink/40 bg-[rgba(252,250,251,0.94)] px-4 py-4 shadow-2xl lg:hidden">
            {resumablePractice && (
              <Link
                to={resumablePractice.exercise.route}
                className="mb-3 block rounded-xl border border-electric-blue/15 bg-electric-blue/5 p-4"
              >
                <p className="font-subheader text-[10px] uppercase tracking-[0.2em] text-electric-blue">
                  Resume Practice
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-body text-sm font-semibold text-midnight-purple">
                    {resumablePractice.exercise.title}
                  </p>
                  <span className="rounded-full bg-white px-3 py-1 font-subheader text-[10px] uppercase tracking-[0.16em] text-gray-500">
                    {resumablePractice.subtitle}
                  </span>
                </div>
              </Link>
            )}

            <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/85 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight-purple text-sm font-subheader text-white">
                {initials}
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-midnight-purple">
                  {user?.name ?? 'ACT User'}
                </p>
                <p className="font-body text-xs text-[#8c8199]">{user?.email ?? 'Session active'}</p>
              </div>
            </div>

            <div className="grid gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${navItemBase} ${
                        isActive
                          ? 'bg-midnight-purple text-white shadow-lg'
                          : 'bg-white/90 text-[#4e3f5e] hover:bg-electric-blue/5'
                      }`
                    }
                  >
                    {({ isActive }: { isActive: boolean }) => (
                      <>
                        <Icon size={18} className={isActive ? 'text-white' : item.accent} />
                        <span>{item.label}</span>
                        {item.to === '/coach' && (
                          <Sparkles
                            size={14}
                            className={isActive ? 'ml-auto text-white' : 'ml-auto text-electric-blue'}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              <button
                type="button"
                onClick={handleLogout}
                className={`${navItemBase} justify-center bg-inferno-red/5 text-inferno-red hover:bg-inferno-red hover:text-white`}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-24">
        {children}
        <ExerciseProgressDock />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-pink/40 bg-[rgba(245,242,244,0.96)] px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] font-subheader uppercase tracking-[0.16em] transition ${
                    isActive ? 'bg-midnight-purple text-white shadow-lg' : 'text-[#8c8199]'
                  }`
                }
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-white' : item.accent} />
                    <span className="mt-1">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
