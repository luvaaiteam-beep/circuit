import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const NotFound = () => {
  return (
    <div className="min-h-screen relative bg-[#09090b] text-zinc-300 font-sans flex items-center justify-center p-6 selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Helmet>
        <title>Page Not Found | CircuitForge</title>
        <meta name="description" content="The page you are looking for does not exist on CircuitForge." />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Layers className="text-cyan-500" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">404</h1>
        <h2 className="text-xl font-medium text-zinc-300 mb-4">Page Not Found</h2>
        <p className="text-zinc-500 mb-8">
          The circuit or page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/" 
            className="flex-1 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition-colors border border-zinc-700/50"
          >
            Go Home
          </Link>
          <Link 
            to="/sim" 
            className="flex-1 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            Open Simulator
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
