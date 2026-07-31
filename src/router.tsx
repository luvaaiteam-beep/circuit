import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { SharedCircuit } from './pages/SharedCircuit';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Features } from './pages/Features';
import { About } from './pages/About';
import { MultisimAlternative } from './pages/MultisimAlternative';
import { Learn } from './pages/Learn';
import { HowToMakeASimpleCircuit } from './pages/blogs/HowToMakeASimpleCircuit';
import { ElectricCircuitSchoolProject } from './pages/blogs/ElectricCircuitSchoolProject';
import { NotFound } from './pages/NotFound';
import { Embed } from './pages/Embed';
import { Simulator } from './pages/Simulator';

const App = React.lazy(() => import('./App'));

const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#09090b] text-cyan-400">
    <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
  </div>
);

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.div>
);

export const RouterComponent = () => {
  const location = useLocation();
  const canonicalUrl = `https://luvaai.in${location.pathname === '/' ? '' : location.pathname}`;
  return (
    <>
      <Helmet>
        <link rel="alternate" hreflang="x-default" href={canonicalUrl} />
        <link rel="alternate" hreflang="en" href={canonicalUrl} />
      </Helmet>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/sim" element={<PageTransition><App /></PageTransition>} />
          <Route path="/simulator" element={<PageTransition><Simulator /></PageTransition>} />
          <Route path="/shared/:id" element={<PageTransition><SharedCircuit /></PageTransition>} />
          <Route path="/embed/:id" element={<PageTransition><Embed /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/multisim-alternative" element={<PageTransition><MultisimAlternative /></PageTransition>} />
          <Route path="/learn" element={<PageTransition><Learn /></PageTransition>} />
          <Route path="/learn/how-to-make-a-simple-circuit" element={<PageTransition><HowToMakeASimpleCircuit /></PageTransition>} />
          <Route path="/learn/electric-circuit-school-project" element={<PageTransition><ElectricCircuitSchoolProject /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
    </>
  );
};
