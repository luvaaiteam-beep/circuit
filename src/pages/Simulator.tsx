import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Share2, Layers, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/50">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-4 flex items-center justify-between text-left text-zinc-300 hover:text-cyan-400 font-medium transition-colors"
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-zinc-400">
          {answer}
        </div>
      )}
    </div>
  );
};

export const Simulator = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col pt-16">
      <Helmet>
        <title>Free 3D Circuit Simulator — Build & Test Electronics | CircuitForge</title>
        <link rel="canonical" href="https://luvaai.in/simulator" />
        <meta name="description" content="Build and simulate electronic circuits in 3D right in your browser. Free online circuit simulator with MNA physics, AI assistant, and no downloads." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "CircuitForge 3D Simulator",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Any",
            "url": "https://luvaai.in/simulator",
            "screenshot": "https://luvaai.in/og-image.jpg",
            "description": "Free 3D circuit simulator. Build, wire, and test electronic circuits directly in your browser with real-time nodal analysis physics.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      {/* Basic Inline Header instead of missing Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Cpu className="text-cyan-400" size={24} />
            <span className="font-mono text-xl text-zinc-100 tracking-tight font-bold">
              Circuit<span className="text-cyan-400">Forge</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/sim" className="text-sm font-medium text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 rounded hover:bg-cyan-400/20 transition-all">Launch Simulator</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
             <Zap size={16} /> Beta Version 1.0 Live
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 mb-6 tracking-tight">
            Free 3D Circuit Simulator<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Build & Test Electronics in Your Browser
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10">
            CircuitForge is an advanced, free online circuit simulator. Design, wire, and simulate complex electronic circuits in a fully interactive 3D environment powered by an MNA physics engine.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/sim" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-medium rounded-lg transition-colors text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Launch Simulator
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="bg-zinc-900/30 border-y border-zinc-800 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-zinc-100 mb-12">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Cpu />, title: "MNA Physics Solver", desc: "Real-time Modified Nodal Analysis engine processes complex circuits, calculating voltage and current dynamically." },
                { icon: <Layers />, title: "22+ Components", desc: "From simple resistors and batteries to logic gates, relays, transistors, and motors." },
                { icon: <Zap />, title: "AI Circuit Assistant", desc: "Stuck? Ask the integrated AI assistant to analyze your circuit, explain concepts, or fix wiring errors." },
                { icon: <Share2 />, title: "Save & Share", desc: "Save your circuits to the cloud, share private links, or publish to the community gallery instantly." }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-200 mb-2">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center text-zinc-100 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-3">Place Components</h3>
              <p className="text-zinc-400">Select from over 22 available electronic parts and drop them onto your 3D grid.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-3">Wire Them Up</h3>
              <p className="text-zinc-400">Click component pins to establish physical connections and build your schematic.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-3">Press Run</h3>
              <p className="text-zinc-400">Hit the play button to simulate electricity flow. Watch LEDs light up and motors spin.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-zinc-900/30 border-t border-zinc-800 py-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-zinc-100 mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <FAQItem 
                question="Is CircuitForge completely free?" 
                answer="Yes! CircuitForge is 100% free to use. There are no paywalls, hidden fees, or premium subscriptions." 
              />
              <FAQItem 
                question="Do I need to download anything?" 
                answer="No, CircuitForge runs entirely in your web browser. You don't need to install any software or plugins." 
              />
              <FAQItem 
                question="How accurate is the simulation?" 
                answer="We use an industry-standard Modified Nodal Analysis (MNA) physics engine. While perfect for educational use and prototyping, it shouldn't replace professional software for critical engineering." 
              />
              <FAQItem 
                question="Can I save my circuits?" 
                answer="Yes! If you sign in, you can save circuits to your account, share them via a unique link, or post them to the public gallery." 
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold text-zinc-100 mb-6">Ready to start building?</h2>
          <Link to="/sim" className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-medium rounded-lg transition-colors text-lg">
            Open the Simulator
          </Link>
        </section>
      </main>

      {/* Inline Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8 text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>&copy; {new Date().getFullYear()} CircuitForge. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/sim" className="hover:text-cyan-400 transition-colors">Simulator</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
