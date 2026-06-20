import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { SharedCircuit } from './pages/SharedCircuit';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Features } from './pages/Features';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { Embed } from './pages/Embed';
import { Simulator } from './pages/Simulator';

const App = React.lazy(() => import('./App'));

const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#09090b] text-cyan-400">
    <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
  </div>
);

export const RouterComponent = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sim" element={<App />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/shared/:id" element={<SharedCircuit />} />
        <Route path="/embed/:id" element={<Embed />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
