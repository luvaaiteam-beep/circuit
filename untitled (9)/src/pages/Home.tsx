import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Battery, Zap, Lightbulb, ToggleLeft, Settings, Trash2, MousePointer2, GitCommitHorizontal, RotateCw, Play, Square, Activity, Terminal, Cpu, Layers, Download, Upload, ArrowRightToLine, Magnet, Fan, Volume2, Gauge, SlidersHorizontal, Triangle, Repeat, Minus, Sun, CircleDot, Circle, Sparkles, ArrowRightLeft, ToggleRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const Home = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 relative">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>

      {/* SECTION 7A — NAV BAR */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="text-white">Circuit</span>
          <span className="text-cyan-400">⚡Forge</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link>
          <Link to="/gallery" className="hover:text-cyan-400 transition-colors">Gallery</Link>
          <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-zinc-700" />
                <Link to="/sim" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  Launch Simulator
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={signInWithGoogle} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                  Sign in
                </button>
                <Link to="/sim" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  Launch Simulator
                </Link>
              </div>
            )
          )}
        </div>
      </motion.nav>

      {/* SECTION 7B — HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            The world's first free <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">3D circuit simulator</span> <br className="hidden md:block" />
            in your browser.
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Build real circuits with 22 components. Powered by nodal analysis physics. No download. No account required to start.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sim" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center gap-2">
              Launch Simulator <ArrowRightToLine size={20} />
            </Link>
            <Link to="/gallery" className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-800 text-white font-bold rounded-lg text-lg transition-all">
              Browse Gallery
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SECTION 7C — STATS BAR */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-zinc-900 relative z-10 border-y border-zinc-800 py-6"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-6 text-zinc-400 font-mono text-sm tracking-widest uppercase">
          <div className="flex items-center gap-2"><Layers size={18} className="text-cyan-500" /> 22 Components</div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-zinc-700"></div>
          <div className="flex items-center gap-2"><Activity size={18} className="text-emerald-500" /> Real MNA Physics</div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-zinc-700"></div>
          <div className="flex items-center gap-2"><Zap size={18} className="text-amber-500" /> 100% Free, Forever</div>
        </div>
      </motion.section>

      {/* SECTION 7D — FEATURES GRID */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to build.</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Professional-grade tools wrapped in an intuitive, game-like 3D interface.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard index={0} icon={<Layers className="text-cyan-400" size={24} />} title="True 3D" desc="Orbit, zoom, and drag components on a real 3D workbench. Every component is a detailed 3D model — not a flat schematic symbol." />
          <FeatureCard index={1} icon={<Activity className="text-emerald-400" size={24} />} title="Real physics engine" desc="Modified Nodal Analysis (MNA) solver — the same method used by SPICE. Parallel paths, voltage dividers, and multi-source circuits all solved correctly." />
          <FeatureCard index={2} icon={<Cpu className="text-amber-400" size={24} />} title="22 components" desc="From basics like resistors and LEDs to transistors, logic gates, relays, and RGB LEDs. Every component has accurate DC simulation behavior." />
          <FeatureCard index={3} icon={<Terminal className="text-purple-400" size={24} />} title="AI circuit assistant" desc="Ask CircuitForge AI why your LED isn't lighting up. Powered by Gemini — responses stream back fast and smart." />
          <FeatureCard index={4} icon={<Download className="text-blue-400" size={24} />} title="Save & share" desc="Sign in with Google to save unlimited circuits. Share any circuit with a public link — one click, anyone can load and explore it." />
          <FeatureCard index={5} icon={<Lightbulb className="text-yellow-400" size={24} />} title="15 starter templates" desc="Load a working circuit instantly: LED + resistor, voltage divider, H-bridge, transistor switch, logic gates, and more." />
        </div>
      </section>

      {/* SECTION 7E — HOW IT WORKS */}
      <section className="py-24 bg-zinc-900/50 relative z-10 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
          >
            How it works
          </motion.h2>
          <div className="flex flex-col md:flex-row gap-12 relative">
            <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-zinc-800 z-0"></div>
            
            {[
              { num: 1, title: 'Pick a component', desc: 'Click the sidebar, place it on the 3D board.' },
              { num: 2, title: 'Wire it up', desc: 'Connect pins with the wire tool.' },
              { num: 3, title: 'Hit RUN', desc: 'MNA solver shows live voltage and current on every component.' }
            ].map((step, i) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-950 border-2 border-cyan-500 flex items-center justify-center text-2xl font-bold text-cyan-400 mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7F — COMPONENT SHOWCASE */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 px-6 relative z-10 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">22 components and counting</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <CompChip icon={<Battery size={16} />} name="Battery" color="text-emerald-400" />
          <CompChip icon={<Activity size={16} />} name="Resistor" color="text-amber-400" />
          <CompChip icon={<Lightbulb size={16} />} name="LED" color="text-red-400" />
          <CompChip icon={<ToggleLeft size={16} />} name="Switch" color="text-zinc-400" />
          <CompChip icon={<Layers size={16} />} name="Capacitor" color="text-blue-400" />
          <CompChip icon={<Lightbulb size={16} />} name="Bulb" color="text-yellow-400" />
          <CompChip icon={<ArrowRightToLine size={16} />} name="Diode" color="text-zinc-300" />
          <CompChip icon={<Magnet size={16} />} name="Inductor" color="text-orange-500" />
          <CompChip icon={<Fan size={16} />} name="Motor" color="text-zinc-400" />
          <CompChip icon={<Volume2 size={16} />} name="Buzzer" color="text-zinc-800" />
          <CompChip icon={<Gauge size={16} />} name="Voltmeter" color="text-blue-400" />
          <CompChip icon={<Activity size={16} />} name="Ammeter" color="text-orange-400" />
          <CompChip icon={<SlidersHorizontal size={16} />} name="Potentiometer" color="text-emerald-400" />
          <CompChip icon={<Triangle size={16} />} name="NPN Transistor" color="text-cyan-400" />
          <CompChip icon={<Repeat size={16} />} name="Transformer" color="text-violet-400" />
          <CompChip icon={<Minus size={16} />} name="Fuse" color="text-red-400" />
          <CompChip icon={<Sun size={16} />} name="Solar Panel" color="text-amber-400" />
          <CompChip icon={<CircleDot size={16} />} name="AND Gate" color="text-purple-400" />
          <CompChip icon={<Circle size={16} />} name="OR Gate" color="text-sky-400" />
          <CompChip icon={<Sparkles size={16} />} name="RGB LED" color="text-pink-400" />
          <CompChip icon={<ArrowRightLeft size={16} />} name="Zener Diode" color="text-slate-400" />
          <CompChip icon={<ToggleRight size={16} />} name="Relay" color="text-teal-400" />
        </div>
      </motion.section>

      {/* SECTION 7G — WHO IS IT FOR */}
      <section className="py-24 bg-zinc-900/30 relative z-10 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
            >
              <h3 className="text-xl font-bold text-white mb-4">Students</h3>
              <p className="text-zinc-400 leading-relaxed">Build circuits for physics class without buying components. Understand Ohm's Law and Kirchhoff's laws visually.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
            >
              <h3 className="text-xl font-bold text-white mb-4">Hobbyists & Makers</h3>
              <p className="text-zinc-400 leading-relaxed">Prototype your Arduino or ESP32 circuit before soldering. Test LED arrays, motor drivers, and sensor circuits instantly.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
            >
              <h3 className="text-xl font-bold text-white mb-4">Engineers & Educators</h3>
              <p className="text-zinc-400 leading-relaxed">Demonstrate circuit behavior to students in 3D. Share live circuit links in course materials.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 7H — CTA BANNER */}
      <section className="py-24 px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-12 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-cyan-500/5 blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-8">Ready to build?</h2>
            <Link to="/sim" className="inline-block px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              Open Simulator — it's free
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SECTION 7I — FOOTER */}
      <footer className="bg-zinc-950 relative z-10 border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-400 font-medium">
            <span className="text-white font-bold">CircuitForge</span> by luvaai.in
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <Link to="/sim" className="hover:text-cyan-400 transition-colors">Simulator</Link>
            <Link to="/gallery" className="hover:text-cyan-400 transition-colors">Gallery</Link>
            <Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link>
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
          © 2026 luvaai.in — Free forever.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, index }: { icon: React.ReactNode, title: string, desc: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
  >
    <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const CompChip = ({ icon, name, color }: { icon: React.ReactNode, name: string, color: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
  >
    <span className={color}>{icon}</span>
    {name}
  </motion.div>
);
