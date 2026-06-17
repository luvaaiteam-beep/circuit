import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const About = () => {
  return (
    <div className="min-h-screen relative bg-[#09090b] selection:bg-cyan-500/30 overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Helmet>
        <title>About | CircuitForge</title>
        <meta name="description" content="Learn about the mission and development of CircuitForge." />
      </Helmet>
      
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 max-w-4xl mx-auto flex items-center justify-between"
      >
        <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-white">Circuit</span>
          <span className="text-cyan-400">⚡Forge</span>
        </Link>
        <Link to="/sim" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          Open Simulator
        </Link>
      </motion.header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20 text-zinc-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">About CircuitForge</h1>
          
          <div className="space-y-6 text-lg leading-relaxed text-zinc-400">
            <p>
              CircuitForge was born from a simple idea: learning electronics shouldn't require downloading clunky, outdated software from the early 2000s, nor should it require purchasing a physical breadboard and jumper wires just to see if an LED lights up.
            </p>
            <p>
              We believe in <strong className="text-white">accessibility and visualization</strong>. A flat, black-and-white circuit schematic can be difficult for students and hobbyists to grasp. By combining a professional-grade Modified Nodal Analysis (MNA) physics engine with WebGL and React, we created an environment where you can pick up a physical-looking component, wire it, and instantly test it in real-time.
            </p>
            <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Tech Stack</h2>
            <p>
              CircuitForge runs entirely in your web browser. There is no backend simulation holding you back. Our technology includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-cyan-500">
              <li><strong>React + TypeScript:</strong> For a stable, type-safe, and highly modular interface.</li>
              <li><strong>Three.js + React Three Fiber:</strong> Delivering a high-performance 60FPS WebGL 3D environment right alongside standard DOM elements.</li>
              <li><strong>MNA Engine:</strong> A custom real-time solver written in TypeScript capable of solving complex parallel paths and resistive meshes on every frame without dropping frame-rates.</li>
              <li><strong>Gemini AI:</strong> The integrated AI assistant operates serverless-ly, intelligently debugging your physical layout for quick insights.</li>
              <li><strong>Firebase:</strong> Managing global galleries and user-saved circuits securely.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Our Mission</h2>
            <p>
              To democratize electronics education. CircuitForge is free, requires no login to start experimenting, and features an open-source framework you can download and tweak to your liking. 
            </p>

            <div className="mt-16 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-white mb-4">Join our community</h3>
              <p className="text-zinc-400 mb-6 text-base">Explore what others are building or share your own complex systems with the world.</p>
              <Link to="/gallery" className="inline-block px-6 py-3 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-cyan-400 text-white font-bold rounded-lg transition-colors">
                Browse the Gallery
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-zinc-800 mt-12 py-8 text-center text-zinc-500 text-sm">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <p>© 2026 CircuitForge</p>
          <div className="flex gap-4">
            <Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link>
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
