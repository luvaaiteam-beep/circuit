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

const routes = [
  { path: '/learn', component: Learn, file: 'src/pages/Learn.tsx' },
  { path: '/learn/how-to-make-a-simple-circuit', component: HowToMakeASimpleCircuit, file: 'src/pages/blogs/HowToMakeASimpleCircuit.tsx' },
  { path: '/learn/electric-circuit-school-project', component: ElectricCircuitSchoolProject, file: 'src/pages/blogs/ElectricCircuitSchoolProject.tsx' },
  { path: '/multisim-alternative', component: MultisimAlternative, file: 'src/pages/MultisimAlternative.tsx' }
];

const template = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');

routes.forEach(route => {
  const Component = route.component;
  const html = ReactDOMServer.renderToString(
    <HelmetProvider>
      <AuthProvider>
        <StaticRouter location={route.path}>
          <Component />
        </StaticRouter>
      </AuthProvider>
    </HelmetProvider>
  );

  const filePath = path.resolve(process.cwd(), route.file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const titleMatch = fileContent.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'CircuitForge';
  
  const metaMatches = [...fileContent.matchAll(/<meta[^>]+>/g)].map(m => m[0]);
  
  let finalHtml = template;
  finalHtml = finalHtml.replace(/<title>.*<\/title>/, `<title>${title}</title>`);
  finalHtml = finalHtml.replace(/<meta property="og:[^>]+>/g, '');
  finalHtml = finalHtml.replace(/<meta name="twitter:[^>]+>/g, '');
  finalHtml = finalHtml.replace(/<meta name="description"[^>]+>/g, '');
  
  const headInjection = metaMatches.join('\n');
  finalHtml = finalHtml.replace('</head>', `${headInjection}\n</head>`);
  finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  
  // Create output path: /learn -> dist/learn.html, /learn/how-to... -> dist/learn/how-to....html
  const outPath = path.join(process.cwd(), 'dist', `${route.path}.html`);
  const outDir = path.dirname(outPath);
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  fs.writeFileSync(outPath, finalHtml);
  console.log(`Pre-rendered ${route.path} -> ${outPath}`);
});
