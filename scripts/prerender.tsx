import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AuthProvider } from '../src/hooks/useAuth';
import { HelmetProvider } from 'react-helmet-async';
import fs from 'fs';
import path from 'path';

import { HowToMakeASimpleCircuit } from '../src/pages/blogs/HowToMakeASimpleCircuit';
import { ElectricCircuitSchoolProject } from '../src/pages/blogs/ElectricCircuitSchoolProject';
import { Learn } from '../src/pages/Learn';
import { MultisimAlternative } from '../src/pages/MultisimAlternative';
import { Simulator } from '../src/pages/Simulator';

const routes = [
  { path: '/learn', component: Learn, file: 'src/pages/Learn.tsx' },
  { path: '/learn/how-to-make-a-simple-circuit', component: HowToMakeASimpleCircuit, file: 'src/pages/blogs/HowToMakeASimpleCircuit.tsx' },
  { path: '/learn/electric-circuit-school-project', component: ElectricCircuitSchoolProject, file: 'src/pages/blogs/ElectricCircuitSchoolProject.tsx' },
  { path: '/multisim-alternative', component: MultisimAlternative, file: 'src/pages/MultisimAlternative.tsx' },
  { path: '/simulator', component: Simulator, file: 'src/pages/Simulator.tsx' }
];

const template = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');

routes.forEach(route => {
  const Component = route.component;

  let html = ReactDOMServer.renderToString(
    <HelmetProvider>
      <AuthProvider>
        <StaticRouter location={route.path}>
          <Component />
        </StaticRouter>
      </AuthProvider>
    </HelmetProvider>
  );

  let finalHtml = template;

  // ALWAYS strip out the base canonical and alternate links
  finalHtml = finalHtml.replace(/<link rel="canonical"[^>]*>/g, '');
  finalHtml = finalHtml.replace(/<link rel="alternate"[^>]*>/g, '');

  const canonicalUrl = `https://luvaai.in${route.path === '/' ? '' : route.path}`;
  const hreflangTags = `
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="en" href="${canonicalUrl}" />
  `;
  finalHtml = finalHtml.replace('</head>', `${hreflangTags}\n</head>`);

  // React 19 emits <title>, <meta>, <link> inline in SSR when there is no <head> in the tree
  // We can extract them and move them to <head>
  const headTags: string[] = [];
  
  html = html.replace(/<title>.*?<\/title>/g, match => {
    headTags.push(match);
    return '';
  });
  
  html = html.replace(/<meta[^>]+name="description"[^>]*>/g, match => {
    headTags.push(match);
    return '';
  });
  
  html = html.replace(/<link[^>]+rel="canonical"[^>]*>/g, match => {
    headTags.push(match);
    return '';
  });

  html = html.replace(/<script[^>]+type="application\/ld\+json"[^>]*>.*?<\/script>/g, match => {
    headTags.push(match);
    return '';
  });

  // If we found any tags, we should remove the base tags from finalHtml so we don't have duplicates
  if (headTags.length > 0) {
    // Remove base title
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/, '');
    // Remove base description
    finalHtml = finalHtml.replace(/<meta[^>]+name="description"[^>]*>/, '');
    // Add the extracted tags to head
    finalHtml = finalHtml.replace('</head>', `${headTags.join('\n')}\n</head>`);
  } else {
    // Custom extraction logic for title based on the route as fallback
    let title = 'CircuitForge';
    if (route.path === '/learn/how-to-make-a-simple-circuit') {
      title = 'How to Make a Simple Circuit Online | CircuitForge';
    } else if (route.path === '/learn/electric-circuit-school-project') {
      title = 'Electric Circuit School Project (2026) — Guide & Examples | CircuitForge';
    } else if (route.path === '/multisim-alternative') {
      title = 'Free Multisim Live Alternative (2026) — CircuitForge Simulator';
    } else if (route.path === '/learn') {
      title = 'Learn Electronics — Circuits, Components & Simulation | CircuitForge';
    } else if (route.path === '/simulator') {
      title = 'Free 3D Circuit Simulator — Build & Test Electronics | CircuitForge';
    }
    finalHtml = finalHtml.replace(/<title>.*<\/title>/, `<title>${title}</title>`);
  }

  finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  
  const outPath = path.join(process.cwd(), 'dist', `${route.path === '/' ? 'index' : route.path.replace(/^\//, '')}.html`);
  
  // Ensure directory exists
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outPath, finalHtml);
  console.log(`Pre-rendered ${route.path} -> ${outPath}`);
});
