import { Link, useNavigate } from 'react-router-dom';
import { Home, Target, Brain, Heart, Zap, CheckSquare, Hexagon, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  setAuth: (value: boolean) => void;
}

export default function Layout({ children, setAuth }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-parchment">
      <nav className="bg-white shadow-sm border-b-2 border-midnight-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-header text-midnight-purple">
                ACT Therapy
              </Link>

              <div className="hidden md:flex space-x-4">
                <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-electric-blue px-3 py-2 rounded-md font-subheader uppercase text-sm">
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/hexaflex" className="flex items-center space-x-2 text-gray-700 hover:text-electric-blue px-3 py-2 rounded-md font-subheader uppercase text-sm">
                  <Hexagon size={18} />
                  <span>Hexaflex</span>
                </Link>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-inferno-red px-3 py-2 rounded-md font-subheader uppercase text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
