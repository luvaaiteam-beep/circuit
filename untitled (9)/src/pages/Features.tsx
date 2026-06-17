import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Lightbulb, Terminal, Cpu, Activity, Layers, Play, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const Features = () => {
  return (
    <div className="min-h-screen relative bg-[#09090b] selection:bg-cyan-500/30 overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Helmet>
        <title>Features | CircuitForge</title>
        <meta name="description" content="Discover the powerful features of CircuitForge - the free 3D circuit simulator." />
      </Helmet>
      
      {/* HEADER */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 max-w-5xl mx-auto flex items-center justify-between"
      >
        <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-white">Circuit</span>
          <span className="text-cyan-400">⚡Forge</span>
        </Link>
        <Link to="/sim" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          Open Simulator
        </Link>
      </motion.header>

      {/* CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Everything you need <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">to build and test electronics.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            CircuitForge combines a professional MNA physics engine with a beautiful, game-like 3D interface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <FeatureBlock 
            icon={<Layers className="text-cyan-400" size={32} />}
            title="Intuitive 3D Workbench"
            desc="Ditch the flat schematics. CircuitForge gives you a true 3D canvas where you can orbit, pan, and place components just like on a real physical breadboard. Every part is beautifully modeled."
          />
          <FeatureBlock 
            icon={<Activity className="text-emerald-400" size={32} />}
            title="Real-Time SPICE Physics"
            desc="Powered by a custom Modified Nodal Analysis (MNA) engine. Currents, voltages, and resistance are calculated accurately in real-time, handling complex loops, parallel paths, and short circuits."
          />
          <FeatureBlock 
            icon={<Cpu className="text-amber-400" size={32} />}
            title="22 Diverse Components"
            desc="From basic resistors and batteries to logic gates, transistors, and motors. Build everything from a simple LED flasher to an H-bridge motor driver, with more components added regularly."
          />
          <FeatureBlock 
            icon={<Terminal className="text-purple-400" size={32} />}
            title="AI Circuit Assistant"
            desc="Stuck on a problem? Ask the AI. CircuitForge integrates Gemini to analyze your current circuit and give you hints on why a component might not be working or how to improve your design."
          />
          <FeatureBlock 
            icon={<Lightbulb className="text-yellow-400" size={32} />}
            title="Instant Templates"
            desc="Don't start from scratch if you don't want to. 15 pre-built templates help you instantly load common circuits like voltage dividers, RC delays, logic gates, and transistor switches."
          />
          <FeatureBlock 
            icon={<Download className="text-blue-400" size={32} />}
            title="Save, Share & Export"
            desc="Sign in to save your circuits forever. Generate a public link to share your creation with peers or students, or download the full open-source React code to run it locally."
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Experience the difference.</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Stop drawing lines on a screen and start putting real 3D components on a board. It's free, it runs in your browser, and it requires no download.
          </p>
          <Link to="/sim" className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)]">
            Start Building Now
          </Link>
        </motion.div>
      </main>
      
      {/* FOOTER */}
      <footer className="relative z-10 border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <p>© 2026 CircuitForge</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureBlock = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
  >
    <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{desc}</p>
  </motion.div>
);
