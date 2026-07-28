import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Terminal, Zap, Lightbulb, Link as LinkIcon, Eye, CheckCircle2, ChevronRight, Share2, Copy, ArrowRight, ImageIcon } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';

const ScreenshotPlaceholder = ({ src, alt, caption }: { 
  src: string; alt: string; caption: string 
}) => (
  <figure className="my-10 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover"
        style={{ maxHeight: '400px' }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          (e.currentTarget.nextElementSibling as HTMLElement)?.removeAttribute('style');
        }}
      />
      <div style={{ display: 'none' }} className="h-56 flex flex-col items-center justify-center gap-3 text-zinc-500 bg-zinc-900/80">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
          <ImageIcon className="w-5 h-5" />
        </div>
        <span className="text-sm text-center px-8">{alt}</span>
      </div>
    </div>
    <figcaption className="px-5 py-3 text-xs text-zinc-500 border-t border-zinc-800 text-center italic">
      {caption}
    </figcaption>
  </figure>
);

export const HowToMakeASimpleCircuit = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [copied, setCopied] = useState(false);
  const [mistakesOpen, setMistakesOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const toc = [
    { id: 'intro', label: 'Introduction' },
    { id: 'what-makes-it-complete', label: 'The Three Things Every Circuit Needs' },
    { id: 'step-by-step', label: 'Let\'s Build One Right Now' },
    { id: 'when-it-breaks', label: 'Open Circuit vs Short Circuit' },
    { id: 'more-interesting', label: 'Three Interesting Upgrades' },
    { id: 'why-simulate', label: 'Why Simulate Before Building' },
    { id: 'faq', label: 'Questions I Get Asked' }
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-cyan-500/30 relative flex flex-col">
      <Navigation />
      {/* READING PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-400 z-50 origin-left"
        style={{ scaleX }}
      />

      <Helmet>
        <title>How to Make a Simple Circuit (2026) — Step-by-Step Online Guide | CircuitForge</title>
        <meta name="description" content="Learn how to make a simple electric circuit in your browser — no components, no download needed. Covers what makes a circuit complete, common mistakes, open vs short circuit, and how to simulate it live. Free electric circuit maker included." />
        <meta name="keywords" content="how to make a simple circuit, how to make an electric circuit, electric circuit maker, simple circuit online, make a circuit in browser, how to make a simple circuit diagram, simple circuit for beginners, online circuit simulator free, circuit diagram maker free" />
        <link rel="canonical" href="https://luvaai.in/learn/how-to-make-a-simple-circuit" />
        <meta property="og:title" content="How to Make a Simple Circuit — Free Online Guide with Live Simulator" />
        <meta property="og:description" content="Learn how to make a simple electric circuit in your browser — no components, no download needed. Covers what makes a circuit complete, common mistakes, open vs short circuit, and how to simulate it live. Free electric circuit maker included." />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://luvaai.in/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Make a Simple Circuit — Free Online Guide with Live Simulator" />
        <meta name="twitter:description" content="Learn how to make a simple electric circuit in your browser — no components, no download needed. Covers what makes a circuit complete, common mistakes, open vs short circuit, and how to simulate it live. Free electric circuit maker included." />
        <meta name="twitter:image" content="https://luvaai.in/og-image.jpg" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a simple electric circuit?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A simple electric circuit is a closed path that allows electricity to flow from a power source (like a battery), through a load (like an LED or lightbulb), and back to the source. It demonstrates the fundamental flow of current."
                }
              },
              {
                "@type": "Question",
                "name": "What are the 3 parts of a circuit?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The three essential parts are a power source (battery), a conductive path (wires), and a load (a component that uses electricity, like a bulb or motor). Without all three connected in a loop, electricity cannot do work."
                }
              },
              {
                "@type": "Question",
                "name": "Can I make a circuit without buying components?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You can use an online simple circuit maker like CircuitForge to simulate real electronic components directly in your web browser for free. It is a great way to learn without spending money or risking burning out physical parts."
                }
              },
              {
                "@type": "Question",
                "name": "What is the easiest circuit to build?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The easiest circuit consists of a battery connected to an LED (with a resistor to prevent it from blowing out). It perfectly demonstrates how current flows through a closed loop in a visual, immediate way."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between a series and parallel circuit?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "In a series circuit, current flows through a single path, meaning the same current goes through all components. If one breaks, everything stops. In a parallel circuit, current splits across multiple branches, so components share the same voltage, and if one breaks, the others stay on."
                }
              },
              {
                "@type": "Question",
                "name": "Is CircuitForge accurate enough for real electronics projects?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, for DC circuits up to intermediate complexity. It uses Modified Nodal Analysis (MNA), the same math behind SPICE. However, it does not simulate AC, RF, or thermal conditions, so it's best for learning and planning before physical assembly."
                }
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "How to Make a Simple Circuit (The Right Way)",
            "description": "Step-by-step guide to building a simple electric circuit online using a free browser-based simulator. No components needed.",
            "image": "https://luvaai.in/blog/simple-circuit-running.jpg",
            "author": {
              "@type": "Organization",
              "name": "CircuitForge",
              "url": "https://luvaai.in"
            },
            "publisher": {
              "@type": "Organization",
              "name": "CircuitForge",
              "url": "https://luvaai.in"
            },
            "datePublished": "2026-07-27",
            "dateModified": "2026-07-27",
            "mainEntityOfPage": "https://luvaai.in/learn/how-to-make-a-simple-circuit"
          }
        ])}
      </script>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* LEFT SIDEBAR - TOC */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
          <Link to="/learn" className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Hub
          </Link>
          
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Table of Contents</h4>
          <nav className="space-y-1 relative before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-zinc-800 mb-10">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`block w-full text-left pl-4 py-2 text-sm transition-colors relative before:absolute before:inset-y-0 before:left-0 before:w-px ${
                  activeSection === item.id
                    ? 'text-cyan-400 before:bg-cyan-400 font-medium'
                    : 'text-zinc-500 hover:text-zinc-300 before:bg-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* School Project Box */}
          <div className="p-6 rounded-xl bg-cyan-950/20 border border-cyan-900/30">
            <h5 className="text-cyan-400 font-bold mb-2">School Project?</h5>
            <p className="text-zinc-400 text-sm mb-4">Are you building this for a class assignment or science fair?</p>
            <Link to="/learn/electric-circuit-school-project" className="text-sm font-bold text-white hover:text-cyan-400 transition-colors inline-flex items-center">
              Read the project guide →
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <article className="flex-1 max-w-2xl mx-auto lg:mx-0 w-full">
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/20">
                Beginners Guide
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              How to Make a Simple Circuit (The Right Way — No Components Needed)
            </h1>
            
            <p className="text-xl text-zinc-400 leading-relaxed mb-8">
              I'll show you exactly how to build and understand a real circuit in your browser right now — before you spend a single dollar on physical parts.
            </p>

            {/* Author Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-6 justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold border border-cyan-900">
                    CF
                  </div>
                  <span className="text-zinc-300 font-medium">By the CircuitForge Team</span>
                </div>
              </div>
              
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <LinkIcon className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>

            {/* Quick Stats Strip */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                ⏱ 8 min read
              </span>
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                📅 July 27 2026
              </span>
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                🎯 Beginner
              </span>
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
                🔧 <Link to="/sim" className="text-cyan-400 hover:underline ml-1">CircuitForge</Link>
              </span>
            </div>

            <hr className="border-t border-zinc-800/80 mb-8" />
          </motion.header>

          <div className="prose prose-invert prose-cyan max-w-none prose-p:text-base prose-p:leading-8 prose-p:mb-6 prose-headings:text-white">
            
            <section id="intro" className="mb-20 scroll-mt-24">
              <p className="text-lg leading-8 text-zinc-300 mb-6">
                I'll be honest — when most people search 'how to make a simple circuit', they expect to find a shopping list of components and a YouTube video. And that's fine. But what if you don't have the parts yet? Or you're trying to understand how it works before you build it physically?
              </p>
              <p className="mb-6">
                You can simulate a complete, working circuit in your browser right now, for free using a circuit diagram maker free of charge. In my experience, this is actually the smarter way to learn. When you build digitally, you can break things, undo them, and understand <em>why</em> they behave the way they do — without burning anything out or blowing a fuse.
              </p>
              <p className="mb-6">
                Throughout this guide, we'll be using CircuitForge. It's a free, browser-based simulator that lets us interact with electronics safely. You won't need to download anything or sign up for an account. Let's dive in.
              </p>
              <p className="mb-6">
                One more thing before we start: everything in this guide works in 3D. You can orbit the camera around your circuit, zoom into individual components, and see exactly how the wires connect in space. It sounds like a gimmick. It really isn't — spatial understanding of how circuits connect is one of the biggest gaps between beginners and people who actually know what they're doing.
              </p>
            </section>

            <motion.section 
              id="what-makes-it-complete" 
              className="mb-20 scroll-mt-24 border-t border-zinc-800/50 pt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">The Three Things Every Circuit Needs (And Why Each One Matters)</h2>
              <p className="mb-6">
                Every functioning electrical circuit in the world relies on three basic elements. Think of electricity like water flowing through pipes. To get water to do work, you need pressure, a pipe, and something for the water to push against. This is the foundation of any simple circuit for beginners.
              </p>

              <div className="space-y-4 my-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800"
                >
                  <strong className="text-white text-lg block mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> 1. Power Source (The Pump)
                  </strong>
                  <p className="text-zinc-400 m-0">Usually a battery. This provides the voltage, which is like the water pressure pushing the electrons through the wires. Without pressure, nothing moves.</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800"
                >
                  <strong className="text-white text-lg block mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-cyan-400" /> 2. A Load (The Water Wheel)
                  </strong>
                  <p className="text-zinc-400 m-0">Something that uses the electricity to do work, like an LED, a buzzer, or a motor. The load converts electrical energy into light, sound, or motion.</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800"
                >
                  <strong className="text-white text-lg block mb-2 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" /> 3. A Conducting Path (The Pipes)
                  </strong>
                  <p className="text-zinc-400 m-0">Wires that connect the positive side of the battery, through the load, and back to the negative side. This forms a full circle, or "circuit".</p>
                </motion.div>
              </div>

              <p className="mb-6">
                Your phone charger is a circuit. The Christmas lights on your tree are circuits. The difference between them and a simple battery-and-LED circuit is just... more components. The fundamentals are identical.
              </p>

              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-cyan-950/20 border border-cyan-800/50 p-6 rounded-xl my-8 text-zinc-300 italic relative"
              >
                <div className="absolute top-6 left-6">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="pl-10">
                  <strong className="text-cyan-400 not-italic block mb-2 font-bold">The Golden Rule:</strong>
                  "The single most important thing to understand: electricity only flows when there is a COMPLETE loop. Break the loop anywhere — a loose wire, a blown component, an open switch — and everything stops instantly."
                </div>
              </motion.div>

              <p className="mb-6">
                Below is an actual running circuit — not an animation. You can interact with it. Try clicking on the components and rotating the camera.
              </p>
              
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 my-8 shadow-lg">
                <div className="bg-zinc-800 px-4 py-3 text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Interactive Circuit
                </div>
                <iframe 
                  src="/sim" 
                  className="w-full h-[400px]"
                  title="Simple Circuit Example"
                />
              </div>
            </motion.section>

            <motion.section 
              id="step-by-step" 
              className="mb-20 scroll-mt-24 border-t border-zinc-800/50 pt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">Let's Build One Right Now — In Your Browser</h2>
              <p className="mb-6">
                Forget the theory for a second. Let's actually make something. We are going to build the most common beginner circuit in existence: lighting up an LED. When you figure out how to make a simple circuit diagram this way, the wired 3D view is the diagram.
              </p>
              
              <div className="space-y-10 my-10">
                <div className="flex gap-6">
                  <motion.div 
                    whileInView={{ scale: [0.8, 1] }} 
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-900 text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >1</motion.div>
                  <div>
                    <strong className="text-white text-xl block mb-2">Open CircuitForge</strong>
                    <p className="text-zinc-400 mb-2">Click <Link to="/sim" target="_blank" className="text-cyan-400 hover:underline">here to open the simulator</Link> in a new tab. It loads in about 2 seconds. No account needed.</p>
                    <p className="text-sm text-zinc-500 bg-zinc-900/50 p-3 rounded border border-zinc-800/50 inline-block m-0">👀 You should see a blank 3D grid, representing your workbench.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <motion.div 
                    whileInView={{ scale: [0.8, 1] }} 
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-900 text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >2</motion.div>
                  <div>
                    <strong className="text-white text-xl block mb-2">Place a Voltage Source</strong>
                    <p className="text-zinc-400 mb-2">Open the component menu and click the "Voltage Source" (battery) to place it on the board. This 9V battery is our power provider. 9 volts is a standard, safe amount of electrical pressure used in many hobby projects.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <motion.div 
                    whileInView={{ scale: [0.8, 1] }} 
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-900 text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >3</motion.div>
                  <div>
                    <strong className="text-white text-xl block mb-2">Add a Resistor</strong>
                    <p className="text-zinc-400 mb-2">Place a Resistor onto the grid. This is the most skipped step by beginners, and it's the one that blows LEDs. LEDs are sensitive; without a resistor to slow down the 9V current, the LED would burn out instantly.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <motion.div 
                    whileInView={{ scale: [0.8, 1] }} 
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-900 text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >4</motion.div>
                  <div>
                    <strong className="text-white text-xl block mb-2">Place an LED</strong>
                    <p className="text-zinc-400 mb-2">Grab an LED. Notice it has two legs. LEDs have polarity, meaning electricity can only flow through them in one direction. The longer leg (anode) is positive, and the shorter leg (cathode) is negative.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <motion.div 
                    whileInView={{ scale: [0.8, 1] }} 
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-900 text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >5</motion.div>
                  <div>
                    <strong className="text-white text-xl block mb-2">Wire It Up and Run</strong>
                    <p className="text-zinc-400 mb-2">Click the positive terminal of the battery, then click the resistor. Wire the resistor to the LED's positive leg. Finally, wire the LED's negative leg back to the battery's negative terminal. Hit the Play button at the top.</p>
                    <p className="text-sm text-emerald-400 bg-emerald-950/30 p-3 rounded border border-emerald-900/50 inline-block m-0">✨ You should see the LED light up red, and small dots moving along the wires showing current flow!</p>
                  </div>
                </div>
              </div>

              <ScreenshotPlaceholder 
                src="/blog/simple-circuit-running.jpg"
                alt="Simple LED circuit running in CircuitForge with current flow visible"
                caption="The completed circuit running in CircuitForge. The animated dots show current flowing from the battery through the resistor and into the LED."
              />

              {/* Collapsible Troubleshooter */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-8">
                <button 
                  onClick={() => setMistakesOpen(!mistakesOpen)}
                  className="w-full flex items-center justify-between p-5 text-left bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
                >
                  <span className="font-bold text-white text-lg">What if it doesn't work? (Common Mistakes)</span>
                  <ChevronRight className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${mistakesOpen ? 'rotate-90' : ''}`} />
                </button>
                <div 
                  className={`px-5 transition-all duration-300 ease-in-out ${mistakesOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'} overflow-hidden bg-zinc-950/50`}
                >
                  <ul className="space-y-4 text-zinc-400 m-0 pl-4">
                    <li><strong className="text-white">LED backwards (Polarity):</strong> If you wired the negative side of the battery to the positive leg of the LED, it blocks the flow. Flip the LED around.</li>
                    <li><strong className="text-white">Incomplete loop:</strong> Double check that every wire connects exactly to a component node. A wire ending in empty space means the circuit is open.</li>
                    <li><strong className="text-white">Forgot the resistor:</strong> If you wired 9V directly to the LED, you caused an overcurrent. In real life, it pops. In the sim, it might warn you or show a massive current spike.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-zinc-900 to-cyan-950/30 border border-zinc-800 text-center">
                <p className="text-lg font-bold text-white mb-2">Built it? Nice work.</p>
                <p className="text-zinc-400 mb-6">Save your circuit to share it with anyone — just create a free account.</p>
                <Link to="/sim" className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl transition-colors">
                  Open Full Simulator →
                </Link>
              </div>

            </motion.section>

            <motion.section 
              id="when-it-breaks" 
              className="mb-20 scroll-mt-24 border-t border-zinc-800/50 pt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">What Happens When a Circuit Breaks — And Why One Is Dangerous</h2>
              <p className="mb-6">
                You've probably seen this in real life — you flip a light switch and the light doesn't come on. That's an open circuit. Now imagine touching both terminals of a 9V battery with a single wire. That's a short circuit. One is harmless. One is not.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 my-10">
                <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 transition-colors">
                  <div className="w-12 h-12 bg-red-950/50 rounded-lg flex items-center justify-center mb-4 border border-red-900/50">
                    <Zap className="w-6 h-6 text-red-400 opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">The Open Circuit</h3>
                  <p className="text-zinc-400 text-sm leading-8 m-0">This happens when the path is broken. If a wire snaps, or you add a switch and turn it off, electricity simply cannot flow. The electrons have nowhere to go. It's completely safe, but your device just sits there, doing nothing.</p>
                </div>
                
                <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="w-12 h-12 bg-amber-950/50 rounded-lg flex items-center justify-center mb-4 border border-amber-900/50">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">The Short Circuit</h3>
                  <p className="text-zinc-400 text-sm leading-8 m-0">This is dangerous. A short circuit happens when electricity finds a path back to the battery <em>without</em> going through a load. With zero resistance, the electricity rushes through the wire instantly. This creates massive heat, sparks, or even a fire. This is exactly why your house has fuses and breakers.</p>
                </div>
              </div>
              <p className="mb-6">
                This is also why electricians talk about 'grounding' so much. A ground wire gives any accidental short circuit a safe, controlled path to follow — directly into the earth, away from people and equipment. In your home's wiring, that third hole in every outlet is the ground. It's the safety net for short circuits.
              </p>
              <p className="mb-6">
                In CircuitForge, you can try both safely. We'll show you what the simulator does when you create a short — spoiler: it warns you before anything bad happens.
              </p>
            </motion.section>

            <motion.section 
              id="more-interesting" 
              className="mb-20 scroll-mt-24 border-t border-zinc-800/50 pt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">Three Upgrades That Make Your Circuit Actually Interesting</h2>
              <p className="mb-6">
                Now that you understand the basics, here's where it gets fun. My favourite upgrade is the switch, because it takes you from "plugging things in" to actually controlling the flow of power.
              </p>
              
              <div className="space-y-8 mt-8">
                <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">Upgrade 1: Add a Switch</h3>
                  <p className="text-zinc-400 mb-4 leading-8">A switch is literally just a controlled break in the circuit. When it's open, the loop is broken and nothing happens. When it's closed, the metal touches, current flows, and the light comes on. That's it. That's all a switch is.</p>
                  <Link to="/sim" className="inline-flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                    Try this in CircuitForge <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">Upgrade 2: Change the Resistor Value</h3>
                  <p className="text-zinc-400 mb-4 leading-8">Click on the resistor and try dropping its resistance from 1000 ohms (1k) down to 220 ohms. The LED gets noticeably brighter. This is Ohm's law in action — lower resistance means more current is allowed to push through, which means more light output.</p>
                  
                  <ScreenshotPlaceholder 
                    src="/blog/resistor-value-panel.jpg"
                    alt="CircuitForge component properties panel showing resistance value input"
                    caption="Clicking any component opens its properties panel. Drop the resistance from 1000Ω to 220Ω and watch the LED get brighter instantly."
                  />

                  <Link to="/sim" className="inline-flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors mt-4">
                    Try this in CircuitForge <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">Upgrade 3: Add a Second LED (Series vs Parallel)</h3>
                  <p className="text-zinc-400 mb-4 leading-8">Try adding another LED. Put them in series (wired one after the other in a line) and both get dimmer. Put them in parallel (wired side by side in their own branches) and both stay bright. This is one of those concepts that makes way more sense visually than it does on paper.</p>

                  <Link to="/sim" className="inline-flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors mt-4">
                    Try this in CircuitForge <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.section>

            <motion.section 
              id="why-simulate" 
              className="mb-20 scroll-mt-24 border-t border-zinc-800/50 pt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">Why I Always Simulate Before Touching a Breadboard</h2>
              <p className="mb-6">
                The first circuit I built physically cost me two blown LEDs and a burned finger before I figured out I had the polarity backwards. That's a normal learning experience. But it doesn't have to be.
              </p>
              <p className="mb-6">
                There's also the speed factor. In the real world, building a circuit takes 20 minutes of hunting for components, stripping wires, and poking at a breadboard. In the simulator, it takes 90 seconds. You can test 10 different resistor values in the time it would take you to find the right one in a physical kit.
              </p>
              <p className="mb-6">
                And when something goes wrong — which it will — the simulator tells you exactly what's happening numerically. You can see that 47.3mA of current is flowing, which is why the LED is too bright. In real life, you'd have to connect a multimeter to figure that out.
              </p>
              <p className="mb-6">
                There are other great tools out there. Falstad has been around since 2002 and is brilliant for looking at abstract wave forms. Tinkercad is great if you're eventually going to program an Arduino. We built CircuitForge to add 3D visualization and an AI assistant on top of the basics as an online circuit simulator free for everyone, making it the easiest way for absolute beginners to start understanding electronics. If Multisim Live was your tool and you're looking for a replacement, we have a <Link to="/multisim-alternative" className="text-cyan-400 hover:underline">full comparison guide</Link>.
              </p>
            </motion.section>

            <motion.section 
              id="faq" 
              className="mb-20 scroll-mt-24 border-t border-zinc-800/50 pt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">Questions I Get Asked About Simple Circuits</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">What is a simple electric circuit?</h3>
                  <p className="text-zinc-400 mb-6">A simple electric circuit is a closed path that allows electricity to flow from a power source (like a battery), through a load (like an LED or lightbulb), and back to the source. It demonstrates the fundamental flow of current without any complicated control logic or microchips.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">What are the 3 parts of a circuit?</h3>
                  <p className="text-zinc-400 mb-6">The three essential parts are a power source (battery), a conductive path (wires), and a load (a component that uses electricity, like a bulb or motor). Without a power source, there is no energy. Without a path, it can't move. Without a load, the energy causes a dangerous short circuit.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">Can I make a circuit without buying components?</h3>
                  <p className="text-zinc-400 mb-6">Yes! You can use an online simple circuit maker like CircuitForge to simulate real electronic components directly in your web browser for free. It behaves exactly like the real world, governed by the same laws of physics, allowing you to learn and experiment safely.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">What is the easiest circuit to build?</h3>
                  <p className="text-zinc-400 mb-6">The easiest circuit consists of a battery connected to an LED, with a resistor in between to prevent it from blowing out. It is the "Hello World" of electronics. It perfectly demonstrates how current flows through a closed loop in a highly visual way.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">What's the difference between a series and parallel circuit?</h3>
                  <p className="text-zinc-400 mb-6">In a series circuit, components are connected in a single line. The current is exactly the same through everything, but if one bulb breaks, the whole string goes dark (like old Christmas lights). In a parallel circuit, components are arranged in separate branches. They all get the full voltage, and if one breaks, the others stay safely lit.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 mt-2">Is CircuitForge accurate enough for real electronics projects?</h3>
                  <p className="text-zinc-400 mb-6">Yes, for DC circuits up to intermediate complexity. The simulator uses Modified Nodal Analysis (MNA), which is the exact same math that professional SPICE simulators use. However, it does not simulate advanced properties like AC waveforms, high-frequency RF behavior, or thermal melting. It is perfect for learning, but professional engineers use tools like LTspice for final verification.</p>
                </div>
              </div>
            </motion.section>

            <div className="border-t border-zinc-800 pt-16 mt-16">
              <h3 className="text-2xl font-bold text-white mb-8">Continue Reading</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <Link to="/learn/electric-circuit-school-project" className="group block bg-zinc-900 border border-zinc-800 hover:border-cyan-800 rounded-xl p-6 transition-colors">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 block">For Students</span>
                  <h4 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">Electric Circuit School Project Guide</h4>
                  <p className="text-zinc-500 text-sm">How to build, simulate, and present a circuit for your class assignment or science fair.</p>
                  <span className="text-cyan-400 text-sm font-bold mt-4 block">Read guide →</span>
                </Link>
                <Link to="/multisim-alternative" className="group block bg-zinc-900 border border-zinc-800 hover:border-cyan-800 rounded-xl p-6 transition-colors">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 block">Switching Tools</span>
                  <h4 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">Free Multisim Live Alternative (2026)</h4>
                  <p className="text-zinc-500 text-sm">Multisim Live shuts down September 15. Here's how to switch to CircuitForge in minutes.</p>
                  <span className="text-cyan-400 text-sm font-bold mt-4 block">Read guide →</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-12 mt-8">
              <h3 className="text-lg font-bold text-white mb-2">References & Further Reading</h3>
              <p className="text-zinc-500 text-sm mb-6">
                These are the resources we actually recommend — not just Wikipedia.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "All About Circuits — DC Circuit Theory",
                    url: "https://www.allaboutcircuits.com/textbook/direct-current/",
                    desc: "The most comprehensive free textbook on DC circuits online. Covers everything from Ohm's Law to complex network analysis.",
                    tag: "Free Textbook"
                  },
                  {
                    title: "Falstad Circuit Simulator",
                    url: "https://www.falstad.com/circuit/",
                    desc: "The original browser-based circuit simulator, running since 2002. Great for visualizing AC waveforms and abstract circuit behavior.",
                    tag: "Tool"
                  },
                  {
                    title: "Khan Academy — Electrical Engineering",
                    url: "https://www.khanacademy.org/science/electrical-engineering",
                    desc: "Free structured course covering everything from basic circuits to amplifiers and digital logic. Good companion to hands-on simulation.",
                    tag: "Free Course"
                  },
                  {
                    title: "SparkFun Electronics — What is a Circuit?",
                    url: "https://learn.sparkfun.com/tutorials/what-is-a-circuit",
                    desc: "SparkFun's beginner guide. Practical, hardware-focused, written by people who sell the physical components.",
                    tag: "Beginner Guide"
                  },
                  {
                    title: "Adafruit Learning System",
                    url: "https://learn.adafruit.com/",
                    desc: "Project-based electronics tutorials from one of the most trusted names in hobby electronics. Great for going from simulation to real hardware.",
                    tag: "Project Tutorials"
                  },
                  {
                    title: "Paul Falstad — Circuit Simulator Applet",
                    url: "https://www.falstad.com/circuit/circuitjs.html",
                    desc: "CircuitJS1 — the open source version of Falstad. Useful for understanding how simulators work under the hood.",
                    tag: "Open Source"
                  },
                  {
                    title: "Electronics Tutorials — Basic Electronics",
                    url: "https://www.electronics-tutorials.ws/",
                    desc: "Dense but thorough. Covers every component in depth with formulas. Better as a reference than a learning path.",
                    tag: "Reference"
                  },
                  {
                    title: "Ben Eater — YouTube",
                    url: "https://www.youtube.com/@BenEater",
                    desc: "The best electronics educator on YouTube. His breadboard computer series teaches you more than most college courses.",
                    tag: "YouTube"
                  }
                ].map((ref, i) => (
                  <a 
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-medium text-zinc-200 group-hover:text-cyan-400 transition-colors text-sm leading-snug">
                        {ref.title}
                      </span>
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                        {ref.tag}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed m-0">{ref.desc}</p>
                  </a>
                ))}
              </div>
              <p className="text-zinc-600 text-xs mt-6">
                CircuitForge is not affiliated with any of the above resources. 
                We link them because they're genuinely useful.
              </p>
            </div>

          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};
