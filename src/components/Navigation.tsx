import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

export const Navigation = () => {
  const { user, loading, signInWithGoogle } = useAuth();

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
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-sm text-zinc-400">{user.displayName}</span>
              <img src={user.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-800" />
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
