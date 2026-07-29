import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export const Navigation = () => {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between"
    >
      <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
        <span className="text-white">Circuit</span>
        <span className="text-cyan-400">⚡Forge</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link>
        <Link to="/gallery" className="hover:text-cyan-400 transition-colors">Gallery</Link>
        <Link to="/learn" className="hover:text-cyan-400 transition-colors">Learn</Link>
        <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
      </div>
      
      <div className="flex items-center gap-4">
        {!loading && (
          user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <span className="hidden md:inline-block text-sm text-zinc-400">
                  {user.displayName}
                </span>
                <img
                  src={user.photoURL || ''}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-zinc-700 hover:border-cyan-500 transition-colors cursor-pointer"
                />
              </button>

              {menuOpen && (
                <>
                  {/* backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-sm font-medium text-white truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
          )
        )}
        <Link 
          to="/sim" 
          className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        >
          Open Simulator
        </Link>
      </div>
    </motion.nav>
  );
};
