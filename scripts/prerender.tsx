import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AuthProvider } from '../src/hooks/useAuth';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import fs from 'fs';
import path from 'path';

import { HowToMakeASimpleCircuit } from '../src/pages/blogs/HowToMakeASimpleCircuit';
import { ElectricCircuitSchoolProject } from '../src/pages/blogs/ElectricCircuitSchoolProject';
import { Learn } from '../src/pages/Learn';
import { MultisimAlternative } from '../src/pages/MultisimAlternative';

const routes = [
  { path: '/learn', component: Learn, file: 'src/pages/Learn.tsx' },
  { path: '/learn/how-to-make-a-simple-circuit', component: HowToMakeASimpleCircuit, file: 'src/pages/blogs/HowToMakeASimpleCircuit.tsx' },
  { path: '/learn/electric-circuit-school-project', component: ElectricCircuitSchoolProject, file: 'src/pages/blogs/ElectricCircuitSchoolProject.tsx' },
  { path: '/multisim-alternative', component: MultisimAlternative, file: 'src/pages/MultisimAlternative.tsx' }
];

const template = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');

routes.forEach(route => {
  const Component = route.component;
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <AuthProvider>
        <StaticRouter location={route.path}>
          <Component />
        </StaticRouter>
      </AuthProvider>
    </HelmetProvider>
  );

  let finalHtml = template;
  
  // Custom extraction logic for title based on the route
  let title = 'CircuitForge';
  if (route.path === '/learn/how-to-make-a-simple-circuit') {
    title = 'How to Make a Simple Circuit Online | CircuitForge';
  } else if (route.path === '/learn/electric-circuit-school-project') {
    title = 'Electric Circuit School Project (2026) — Guide & Examples | CircuitForge';
  } else if (route.path === '/multisim-alternative') {
    title = 'Free Multisim Live Alternative (2026) — CircuitForge Simulator';
  } else if (route.path === '/learn') {
    title = 'Learn Electronics — Circuits, Components & Simulation | CircuitForge';
  }

  finalHtml = finalHtml.replace(/<title>.*<\/title>/, `<title>${title}</title>`);
  
  // ALWAYS strip out the base canonical link
  finalHtml = finalHtml.replace(/<link rel="canonical"[^>]*>/g, '');
  finalHtml = finalHtml.replace(/<link rel="alternate"[^>]*>/g, '');
  finalHtml = finalHtml.replace(/<meta property="og:[^>]+>/g, '');
  finalHtml = finalHtml.replace(/<meta name="twitter:[^>]+>/g, '');
  finalHtml = finalHtml.replace(/<meta name="description"[^>]+>/g, '');

  if (helmetContext.helmet) {
    const { helmet } = helmetContext;
    
    const helmetHead = `
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
    `;

    finalHtml = finalHtml.replace('</head>', `${helmetHead}\n</head>`);
  }

  finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  
  const outPath = path.join(process.cwd(), 'dist', `${route.path}.html`);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, finalHtml);
  console.log(`Pre-rendered ${route.path} -> ${outPath}`);
});
