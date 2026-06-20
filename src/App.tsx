/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { Onboarding } from './components/Onboarding';
import { useCircuitStore } from './store';
import { Helmet } from 'react-helmet-async';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <div className="w-screen h-screen bg-[#09090b] text-zinc-300 font-sans overflow-hidden select-none">
      <Helmet>
        <title>Simulator | CircuitForge</title>
        <meta name="description" content="Build and simulate electronic circuits in 3D right in your browser. Add resistors, batteries, LEDs, and logic gates." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://luvaai.in/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Simulator",
                "item": "https://luvaai.in/simulator"
              }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="sr-only">
        <h1>CircuitForge 3D Electronics Simulator</h1>
        <p>Interactive circuit building environment. Place components onto the canvas, wire them together, and run real-time electronic simulations. Supported tools include selection, wiring, and deletion. Connect batteries, switches, resistors, and more to test your circuit designs.</p>
      </div>

      <div className="fixed inset-0 w-full h-full">
        <ErrorBoundary>
          <Scene />
        </ErrorBoundary>
      </div>
      <UI />
      <Onboarding />
    </div>
  );
}

