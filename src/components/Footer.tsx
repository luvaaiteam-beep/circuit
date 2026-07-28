import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 relative z-10 border-t border-zinc-800 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-zinc-400 font-medium flex items-center gap-2">
          <Link to="/" className="text-white font-bold hover:text-cyan-400 transition-colors">CircuitForge</Link>
          <span>by luvaai.in</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
          <Link to="/sim" className="hover:text-cyan-400 transition-colors">Simulator</Link>
          <Link to="/gallery" className="hover:text-cyan-400 transition-colors">Gallery</Link>
          <Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link>
          <Link to="/learn" className="hover:text-cyan-400 transition-colors">Learn</Link>
          <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          <a href="mailto:luvaai.team@gmail.com" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
        <div className="text-zinc-600 text-sm">
          Built with React + Three.js + Gemini AI
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-center text-zinc-600 text-sm">
        © {new Date().getFullYear()} luvaai.in — Free forever.
      </div>
    </footer>
  );
};
