import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Users, User, LogIn, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle } from '../lib/firebase';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, profile, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Live', path: '/live', icon: Activity },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                CP
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Cric<span className="text-blue-400">Pulse</span>
                <span className="hidden sm:inline text-[10px] text-slate-500 font-light italic ml-2">by Khelbo Warriors</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all hover:text-white rounded-lg ${
                    location.pathname === item.path ? 'text-white border-b-2 border-blue-500 rounded-none' : 'text-slate-400'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <div className="badge-live">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 
                LIVE SYNCING
              </div>
              {user ? (
                <Link to="/profile" className="flex items-center space-x-3 glass-button py-1.5 px-3">
                   <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                      <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-full h-full object-cover" />
                   </div>
                   <div className="text-left">
                      <div className="text-xs font-bold text-white leading-none mb-0.5">{profile?.displayName?.split(' ')[0]}</div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-500 leading-none">{profile?.role}</div>
                   </div>
                   <ChevronDown className="w-3 h-3 text-slate-600" />
                </Link>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="primary-button"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {loading ? '...' : 'Sign In'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-400 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-base font-medium">{item.name}</span>
                  </Link>
                ))}
                {user ? (
                   <Link 
                     to="/profile" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800 text-white"
                   >
                     <img src={user.photoURL || ''} className="w-8 h-8 rounded-lg" />
                     <span className="font-bold">{profile?.displayName}</span>
                   </Link>
                ) : (
                  <button 
                    onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }}
                    className="w-full primary-button py-4 mt-4"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="h-10 bg-slate-950 border-t border-white/5 px-6 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex gap-4">
          <span>Session: <span className="text-white">Night League</span></span>
          <span>Format: <span className="text-white">Professional</span></span>
          <span>Rules: <span className="text-white text-blue-400">Box Cricket Std</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 
            Server Optimized
          </span>
          <span>© {new Date().getFullYear()} Khelbo Warriors Ecosystem</span>
        </div>
      </footer>
    </div>
  );
}
