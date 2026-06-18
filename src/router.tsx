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
import App from './App';

export const RouterComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sim" element={<App />} />
      <Route path="/shared/:id" element={<SharedCircuit />} />
      <Route path="/embed/:id" element={<Embed />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
