import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TriangleAlert, Box, Sparkles, Zap, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const SHUTDOWN_DATE = new Date('2026-09-15T00:00:00Z').getTime();

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasEnded: boolean;
  } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = SHUTDOWN_DATE - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, hasEnded: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, hasEnded: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

const CountdownDisplay = () => {
  const timeLeft = useCountdown();

  if (!timeLeft) return null;

  if (timeLeft.hasEnded) {
    return <span className="font-bold">Multisim Live has shut down.</span>;
  }

  return (
    <span className="font-bold tabular-nums">
      {timeLeft.days} days {timeLeft.hours} hours {timeLeft.minutes} minutes{' '}
      <motion.span
        key={timeLeft.seconds}
        initial={{ opacity: 0, scale: 1.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
      </motion.span>{' '}
      seconds
    </span>
  );
};

export const MultisimAlternative = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is CircuitForge completely free?",
      a: "Yes. CircuitForge is free forever with no subscription, no trial period, and no paywalled features. There is no paid tier — everything is available to every user at no cost."
    },
    {
      q: "Do I need an account to use CircuitForge?",
      a: "No. You can open CircuitForge and start building and simulating circuits immediately with no signup required. Create a free account only when you want to save your circuits to the cloud or share them with a link."
    },
    {
      q: "Can CircuitForge replace Multisim Live for students and coursework?",
      a: "For learning electronics, understanding circuit behavior, and completing coursework that involves resistors, capacitors, LEDs, logic gates, switches, and voltage sources — yes. CircuitForge is a comprehensive circuit simulator for students that covers the full range of components used in introductory and intermediate electronics courses."
    },
    {
      q: "How is CircuitForge different from Falstad circuit simulator?",
      a: "Falstad is 2D only and has no AI assistant. CircuitForge adds full 3D visualization so you can see your circuit from any angle, plus a built-in AI that explains component behavior and helps you debug circuits. CircuitForge also has a public circuit gallery where you can browse and remix circuits shared by other users."
    },
    {
      q: "Does CircuitForge work on mobile and tablet?",
      a: "Yes. CircuitForge runs in any modern browser including Chrome, Safari, Firefox, and Edge on desktop, tablet, and mobile. No app download required."
    },
    {
      q: "Is my data safe if I create an account?",
      a: "Yes. CircuitForge uses Firebase for authentication and data storage, with encrypted connections. We do not sell your data. See our Privacy Policy for full details."
    },
    {
      q: "What happens to my Multisim Live circuits after September 15?",
      a: "After the shutdown date, Multisim Live will no longer be accessible and NI/Digilent has not confirmed any data recovery option. Export your circuits before August 1, 2026 using File → Export in your Multisim Live account."
    },
    {
      q: "Is CircuitForge a good Tinkercad alternative?",
      a: "Yes. Tinkercad requires an Autodesk account to start and is 2D only for circuit simulation. CircuitForge requires no account, renders circuits in full 3D, and includes a built-in AI assistant. For students focused on circuit simulation rather than Arduino specifically, CircuitForge is the stronger free choice."
    },
    {
      q: "Is CircuitForge a Multisim Desktop alternative too?",
      a: "Multisim Desktop requires a paid license and Windows installation. CircuitForge is free, runs in any browser with no installation, and works on Mac, Windows, Linux, tablet, and mobile. For students and beginners, CircuitForge covers all the circuits needed in introductory and intermediate courses without any cost or installation."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-cyan-500/30 flex flex-col">
      <Navigation />
      <Helmet>
        <title>Free Multisim Live Alternative (2026) — Browser-Based, No Download | CircuitForge</title>
        <meta name="description" content="Multisim Live shuts down September 15, 2026. CircuitForge is the free browser-based replacement — no download, no signup needed. 3D simulation, AI assistant, works instantly in your browser." />
        <meta name="keywords" content="multisim live alternative, multisim replacement 2026, free circuit simulator, browser circuit simulator, multisim live shutdown, online circuit simulator no download, 3D circuit simulator free, falstad alternative, tinkercad alternative, circuit simulator for students" />
        <link rel="canonical" href="https://luvaai.in/multisim-alternative" />
        <meta property="og:title" content="Free Multisim Live Alternative (2026) | CircuitForge" />
        <meta property="og:description" content="Multisim Live shuts down September 15 2026. Switch to CircuitForge — free, browser-based, 3D circuit simulation with AI assistant. No download needed." />
        <meta property="og:url" content="https://luvaai.in/multisim-alternative" />
        <meta property="og:image" content="https://luvaai.in/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Multisim Live Alternative (2026) | CircuitForge" />
        <meta name="twitter:description" content="Multisim Live shuts down Sep 15 2026. CircuitForge is the free browser-based replacement with 3D and AI. No download needed." />
        <meta name="twitter:image" content="https://luvaai.in/og-image.jpg" />
      </Helmet>
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "CircuitForge",
          "description": "Free browser-based 3D circuit simulator. The best free Multisim Live alternative in 2026.",
          "url": "https://luvaai.in",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Any (browser-based)",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is CircuitForge completely free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. CircuitForge is free forever with no subscription, no trial period, and no paywalled features. There is no paid tier."
              }
            },
            {
              "@type": "Question",
              "name": "Can CircuitForge replace Multisim Live for students and coursework?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For learning electronics and completing coursework involving resistors, capacitors, LEDs, logic gates, switches, and voltage sources — yes completely. CircuitForge covers the full range of components used in introductory and intermediate electronics courses."
              }
            },
            {
              "@type": "Question",
              "name": "What happens to my Multisim Live circuits after September 15 2026?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "After September 15 2026 Multisim Live will no longer be accessible. Export your circuits before August 1 2026 using File → Export in your Multisim Live account."
              }
            },
            {
              "@type": "Question",
              "name": "Is CircuitForge a good Tinkercad alternative?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Tinkercad requires an Autodesk account and is 2D only for circuit simulation. CircuitForge requires no account, renders circuits in full 3D, and includes an AI assistant."
              }
            }
          ]
        })}
      </script>

      {/* SECTION 1 — TOP URGENCY BANNER */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 w-full py-4 px-6 text-center text-amber-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3">
          <TriangleAlert className="text-amber-500 shrink-0" size={24} />
          <div className="text-sm md:text-base">
            <span className="font-medium mr-2">⚠️ Multisim Live officially shuts down September 15, 2026. Your saved circuits will not be recoverable after this date.</span>
            <br className="md:hidden" />
            <CountdownDisplay />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* SECTION 2 — HERO */}
        <section className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            The Free Multisim Live Alternative
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-10"
          >
            CircuitForge is the 3D circuit simulator free for students and educators. No download. No signup. Start simulating in seconds.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/sim" className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl text-lg transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                Launch CircuitForge Free →
              </Link>
            </motion.div>
            <Link to="/gallery" className="px-8 py-4 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold rounded-xl text-lg transition-all">
              View Example Circuits
            </Link>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-zinc-500 text-sm"
          >
            Free forever · No credit card · Works in any browser
          </motion.p>
        </section>

        {/* SECTION 3 — COMPARISON TABLE */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">CircuitForge vs Multisim Live</h2>
            <p className="text-zinc-400 text-lg">See why thousands of students are switching</p>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/30">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-4 font-semibold text-zinc-300 w-1/3">Feature</th>
                  <th className="p-4 font-semibold text-zinc-300 w-1/3">Multisim Live</th>
                  <th className="p-4 font-semibold text-cyan-400 w-1/3 bg-cyan-500/5 relative border-l border-r border-t border-cyan-500/40 rounded-t-xl">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                      Recommended
                    </div>
                    CircuitForge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[
                  ["Still active after Sep 2026", { m: false, l: "Shutting down" }, { c: true, l: "Active, free forever" }],
                  ["Browser-based", { m: true, l: "Yes" }, { c: true, l: "Yes" }],
                  ["No download required", { m: true, l: "Yes" }, { c: true, l: "Yes" }],
                  ["No account to start", { m: false, l: "Account required" }, { c: true, l: "Optional" }],
                  ["3D circuit visualization", { m: false, l: "2D schematics only" }, { c: true, l: "Full 3D" }],
                  ["AI circuit assistant", { m: false, l: "None" }, { c: true, l: "Built-in" }],
                  ["Save circuits to cloud", { m: true, l: "Yes" }, { c: true, l: "Yes" }],
                  ["Share circuits via link", { m: true, l: "Yes" }, { c: true, l: "Yes" }],
                  ["Works on mobile", { m: false, l: "Limited" }, { c: true, l: "Yes" }],
                  ["Price", { m: null, l: "Paid subscription" }, { c: true, l: "100% Free" }],
                ].map((row, i) => (
                  <motion.tr 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-zinc-300">{row[0] as string}</td>
                    <td className="p-4 text-zinc-400">
                      <div className="flex items-center gap-2">
                        {(row[1] as any).m === true && <Check className="text-green-400 shrink-0" size={18} />}
                        {(row[1] as any).m === false && <X className="text-red-400 shrink-0" size={18} />}
                        {(row[1] as any).l}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-200 bg-cyan-500/5 border-l border-r border-cyan-500/40">
                      <div className="flex items-center gap-2">
                        {(row[2] as any).c === true && <Check className="text-green-400 shrink-0" size={18} />}
                        {(row[2] as any).l}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4 — THREE DIFFERENTIATORS */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why students choose CircuitForge</h2>
          <p className="text-zinc-400 text-center text-lg mb-12 max-w-3xl mx-auto">
            As a browser based circuit simulator, CircuitForge eliminates the need for expensive software licenses and complicated installations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.15, duration: 0.5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <Box className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-3">True 3D Visualization</h3>
              <p className="text-zinc-400">See your circuit the way it actually exists in space. Every component, every wire rendered in full 3D — not flat schematics. Rotate, zoom, and inspect from any angle.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.15, duration: 0.5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <Sparkles className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-3">Built-in AI Assistant</h3>
              <p className="text-zinc-400">Ask why your circuit isn't working. The AI explains component behavior, suggests fixes, and walks you through electronics concepts in plain language. No textbook needed.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.15, duration: 0.5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <Zap className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-3">Start in 10 Seconds</h3>
              <p className="text-zinc-400">No download, no account, no setup. Open CircuitForge in your browser and start placing components immediately. Create a free account only when you want to save your work.</p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5 — LIVE EMBEDDED CIRCUIT DEMO */}
        <section className="mb-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">See It Running Live</h2>
            <p className="text-zinc-400 text-lg">This is a real CircuitForge circuit — running live in your browser right now. Not a screenshot. Not a video.</p>
          </div>
          <iframe 
            src="/sim" 
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 mb-6"
            style={{ height: '500px' }}
            title="CircuitForge Live Circuit Demo"
          />
          <div className="text-center">
            <p className="text-zinc-400 mb-6">↑ This is the actual simulator. Click Launch CircuitForge to get your own full-screen workspace.</p>
            <Link to="/sim" className="inline-block px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors">
              Launch Full Simulator →
            </Link>
          </div>
        </section>

        {/* SECTION 6 — MIGRATION GUIDE */}
        <section className="mb-24">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Switch from Multisim Live</h2>
            <p className="text-zinc-400 text-lg">Moving to CircuitForge takes minutes. Here's exactly what to do.</p>
          </div>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
            {[
              { title: "Export your Multisim circuits now (urgent)", body: "With the Multisim Live end of life approaching, log into your account before August 1, 2026 when subscriptions end. Go to File → Export and download all your saved circuits locally. After September 15 your designs will not be recoverable — do this today." },
              { title: "Open CircuitForge in your browser", body: "Go to luvaai.in and click Launch Simulator. No download, no account, no waiting. The full simulator loads in your browser in seconds on any device." },
              { title: "Recreate your circuits", body: "Use CircuitForge's component library to rebuild your designs. Resistors, capacitors, LEDs, logic gates, switches, voltage sources — all the components you used in Multisim are available. For common circuits it takes just a few minutes." },
              { title: "Save and share your work", body: "Create a free CircuitForge account to save your circuits to the cloud. Each saved circuit gets a shareable link — send it to your teacher, classmates, or post it publicly in the gallery." }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 text-cyan-400 font-bold text-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(34,211,238,0.1)] relative z-10">
                  {i + 1}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                  <h3 className="font-bold text-white text-xl mb-2">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 7 — FAQ */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800/50 transition-colors focus:outline-none"
                >
                  <span className="font-bold text-white pr-8">{faq.q}</span>
                  <ChevronDown className={`text-zinc-500 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* SECTION 8 — BOTTOM CTA WITH LIVE COUNTDOWN */}
      <section className="bg-gradient-to-r from-cyan-950/30 to-zinc-900 border-t border-zinc-800 py-24 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-amber-400 mb-6 bg-amber-500/10 border border-amber-500/20 inline-block px-6 py-2 rounded-full font-medium">
            Time remaining: <CountdownDisplay />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Don't wait until September 15</h2>
          <p className="text-xl text-zinc-300 mb-10">
            Thousands of Multisim Live users are switching to CircuitForge right now. Start today and have your circuits moved over before the deadline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/sim" className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl text-lg transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                Launch CircuitForge Free →
              </Link>
            </motion.div>
            <Link to="/gallery" className="px-8 py-4 border border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800 text-white font-bold rounded-xl text-lg transition-all">
              Browse Circuit Gallery
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MultisimAlternative;
