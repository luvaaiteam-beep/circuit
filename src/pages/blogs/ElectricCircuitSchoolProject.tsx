import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';

export const ElectricCircuitSchoolProject = () => {
  const [activeSection, setActiveSection] = useState('intro');

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
    { id: 'teacher-wants', label: 'What Your Teacher is Looking For' },
    { id: 'impressive-circuit', label: 'The Simplest Circuit That Impresses' },
    { id: 'simulate-first', label: 'How to Simulate It Online First' },
    { id: 'physical-components', label: 'If You Have Physical Components' },
    { id: 'explain-it', label: 'How to Explain It to Your Teacher' },
    { id: 'level-up', label: 'Level Up Your Project' },
    { id: 'faq', label: 'Frequently Asked Questions' }
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-cyan-500/30 flex flex-col">
      <Navigation />
      <Helmet>
        <title>Simple Electric Circuit School Project (Class 10) | CircuitForge</title>
        <meta name="description" content="Working on a science fair or school project? Learn how to make an electric circuit school project online. Simulate, screenshot, and build it." />
        <meta name="keywords" content="how to make an electric circuit school project, simple electric circuit project, electric circuit project for students, school science project circuit, circuit project class 10, circuit project for science fair, CBSE class 10 science project" />
        <link rel="canonical" href="https://luvaai.in/learn/electric-circuit-school-project" />
        <meta property="og:title" content="Simple Electric Circuit School Project — Build & Simulate Online" />
        <meta property="og:description" content="Working on a science fair or school project? Learn how to make an electric circuit school project online." />
        <meta property="og:type" content="article" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the easiest electric circuit for a school project?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The easiest and most reliable project is a simple LED circuit with a switch. You just need a 9V battery, a resistor (like 1k ohm), an LED, and a basic switch to turn it on and off."
              }
            },
            {
              "@type": "Question",
              "name": "Can I use a simulator for my school project?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Many teachers accept screenshots of simulated circuits for project reports, especially if you explain how the current flows. You can build and simulate it for free on CircuitForge."
              }
            },
            {
              "@type": "Question",
              "name": "What components do I need for a simple circuit project?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If building physically, you need a battery (usually 9V or AA), some connecting wires, a resistor (to protect your light), a small LED bulb, and a basic toggle or push-button switch."
              }
            },
            {
              "@type": "Question",
              "name": "How do I explain a circuit to my teacher?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Point to the battery and say it provides the voltage. Point to the wires and say they provide a conductive path. Point to the LED and say it is the load that converts electrical energy into light."
              }
            },
            {
              "@type": "Question",
              "name": "What is a series and parallel circuit for class 10?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "In a series circuit, components are connected end-to-end in a single path. If one breaks, the whole circuit stops. In a parallel circuit, components are connected across multiple branches, so if one breaks, the others stay on."
              }
            }
          ]
        })}
      </script>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 items-start">
        {/* LEFT SIDEBAR - TOC */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
          <Link to="/learn" className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Hub
          </Link>
          
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Table of Contents</h4>
          <nav className="space-y-1 relative before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-zinc-800">
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

          <div className="mt-12 p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <h5 className="text-white font-bold mb-2">Just starting out?</h5>
            <p className="text-zinc-400 text-sm mb-4">Learn the basic concepts of how electricity flows first.</p>
            <Link to="/learn/how-to-make-a-simple-circuit" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center">
              Read the beginner guide →
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <article className="flex-1 max-w-3xl">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-sm font-medium rounded-full">
                Students
              </span>
              <span className="text-zinc-500 text-sm">Aug 16, 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Simple Electric Circuit School Project — Build & Simulate Online
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Working on a circuit project for school? This guide walks you through building, simulating, and presenting a simple electric circuit — no components required if you don't have them yet.
            </p>
          </header>

          <div className="prose prose-invert prose-cyan max-w-none">
            <section id="intro" className="mb-16 scroll-mt-24">
              <p>
                Whether it's a <strong>circuit project class 10</strong> physics assignment, a CBSE science fair, or just a weekend homework task, figuring out <strong>how to make an electric circuit school project</strong> can feel stressful if you don't have the right parts at home. 
              </p>
              <p>
                Don't worry. Before you rush to the electronics store, you can build, test, and document your entire <strong>school science project circuit</strong> directly in your browser.
              </p>
            </section>

            <section id="teacher-wants" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">What Your Teacher is Looking For</h2>
              <p>To get full marks on a <strong>simple electric circuit project</strong>, your teacher isn't expecting a complex supercomputer. They are looking for you to demonstrate three specific concepts:</p>
              
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 shrink-0 mt-1" />
                  <span className="text-zinc-300"><strong>A complete loop:</strong> Showing that electricity can travel from the positive terminal, through a load, to the negative terminal.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 shrink-0 mt-1" />
                  <span className="text-zinc-300"><strong>Control:</strong> Usually demonstrated by adding a switch to open and close the circuit.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 shrink-0 mt-1" />
                  <span className="text-zinc-300"><strong>Safety/Understanding:</strong> Showing you know how to use a resistor so the LED doesn't blow up from too much voltage.</span>
                </li>
              </ul>
            </section>

            <section id="impressive-circuit" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">The Simplest Circuit That Actually Impresses</h2>
              <p>Forget the old "potato battery and tiny lightbulb" project. The best <strong>electric circuit project for students</strong> uses modern components: A 9V Battery, a Switch, a Resistor, and an LED.</p>
              <p><em>Why this works better than just a bulb:</em> It shows your teacher that you understand resistance. An LED requires a resistor; a standard incandescent bulb doesn't. Adding that resistor proves you understand Ohm's Law.</p>
              
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 my-8">
                <div className="bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Interactive Science Fair Circuit
                </div>
                <iframe 
                  src="/sim" 
                  className="w-full h-[400px]"
                  title="School Project Circuit Demo"
                />
                <div className="p-4 bg-zinc-900 text-sm text-zinc-400 text-center border-t border-zinc-800">
                  Try flipping the switch! This is exactly what you can build and screenshot for your report.
                </div>
              </div>
            </section>

            <section id="simulate-first" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">How to Simulate It Online First</h2>
              <p>Before you build it physically (or if your teacher allows digital submissions), use CircuitForge to build it.</p>
              
              <ol className="space-y-4 text-zinc-300 mb-8">
                <li><strong className="text-white">Open the app:</strong> Go to the free <Link to="/sim" className="text-cyan-400 hover:underline">CircuitForge simulator</Link>.</li>
                <li><strong className="text-white">Place components:</strong> Drag a Voltage Source (9V), an SPST Switch, a Resistor (set to 1kΩ), and an LED onto the grid.</li>
                <li><strong className="text-white">Connect them:</strong> Wire them in a circle. Battery (+) → Switch → Resistor → LED (+) → LED (-) → Battery (-).</li>
                <li><strong className="text-white">Run the simulation:</strong> Click the Play button and toggle your switch.</li>
              </ol>

              <div className="bg-cyan-950/20 border border-cyan-900/50 p-6 rounded-xl flex gap-4">
                <BookOpen className="w-8 h-8 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Pro Tip for your Project Report</h4>
                  <p className="text-zinc-400 m-0">Take a screenshot of your circuit while it is running in CircuitForge. Paste this into your Word document or Google Doc report. Showing a working digital simulation is impressive proof that your design works.</p>
                </div>
              </div>
            </section>

            <section id="physical-components" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">If You Have Physical Components</h2>
              <p>If your <strong>circuit project for science fair</strong> requires a physical build, here is what you need to buy (usually under ₹100 or $5 at a local hardware/hobby store):</p>
              
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>One 9V Battery and a battery clip/connector.</li>
                <li>One 1kΩ Resistor (Brown-Black-Red stripes).</li>
                <li>One standard 5mm LED (any color).</li>
                <li>One small toggle switch.</li>
                <li>A mini breadboard or some connecting wires.</li>
              </ul>
              
              <div className="bg-amber-950/20 border border-amber-900/50 p-6 rounded-xl flex gap-4 mt-8">
                <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Common Physical Mistake</h4>
                  <p className="text-zinc-400 m-0">LEDs have polarity! The longer leg is positive (anode) and the shorter leg is negative (cathode). If you plug it in backward, it won't light up. If it doesn't work, try flipping the LED around.</p>
                </div>
              </div>
            </section>

            <section id="explain-it" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">How to Explain It to Your Teacher</h2>
              <p>Building the circuit is only half the grade. You have to explain it. Memorize this simple script:</p>
              <blockquote className="border-l-4 border-cyan-500 pl-6 py-2 my-6 bg-zinc-900 rounded-r-xl italic text-zinc-300">
                "This is a simple series circuit. The 9V battery acts as our power source, providing the voltage. When I close the switch, I complete the conductive path. The current flows through the wires, through the resistor which reduces the current to a safe level, and into the LED, which is our load. The electrical energy is converted into light, and the current returns to the negative terminal of the battery."
              </blockquote>
            </section>

            <section id="level-up" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Level Up Your Project</h2>
              <p>Want extra credit? Try these variations in the simulator first, then build them:</p>
              <ul className="space-y-4">
                <li><strong>Series vs Parallel LEDs:</strong> Add a second LED. If you wire them in series, they might get dim. If you wire them in parallel, they stay bright. Explaining <em>why</em> will definitely get you an A.</li>
                <li><strong>Add a Buzzer:</strong> Swap the LED for a buzzer to make an alarm circuit.</li>
                <li><strong>Light-Dependent Resistor (LDR):</strong> Replace the standard switch with an LDR. Now you have a circuit that turns on automatically when it gets dark!</li>
              </ul>
              
              <div className="mt-12 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Start your assignment now</h3>
                <Link to="/sim" className="inline-block px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-xl text-lg transition-colors">
                  Open Simulator & Take a Screenshot →
                </Link>
              </div>
            </section>

            <section id="faq" className="mb-16 scroll-mt-24 pt-8 border-t border-zinc-800">
              <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">What is the easiest electric circuit for a school project?</h3>
                  <p className="text-zinc-400">The easiest and most reliable project is a simple LED circuit with a switch. You just need a 9V battery, a resistor (like 1k ohm), an LED, and a basic switch to turn it on and off.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Can I use a simulator for my school project?</h3>
                  <p className="text-zinc-400">Yes! Many teachers accept screenshots of simulated circuits for project reports, especially if you explain how the current flows. You can build and simulate it for free on CircuitForge.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">What components do I need for a simple circuit project?</h3>
                  <p className="text-zinc-400">If building physically, you need a battery (usually 9V or AA), some connecting wires, a resistor (to protect your light), a small LED bulb, and a basic toggle or push-button switch.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">How do I explain a circuit to my teacher?</h3>
                  <p className="text-zinc-400">Point to the battery and say it provides the voltage. Point to the wires and say they provide a conductive path. Point to the LED and say it is the load that converts electrical energy into light.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">What is a series and parallel circuit for class 10?</h3>
                  <p className="text-zinc-400">In a series circuit, components are connected end-to-end in a single path. If one breaks, the whole circuit stops. In a parallel circuit, components are connected across multiple branches, so if one breaks, the others stay on.</p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};
