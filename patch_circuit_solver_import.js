import fs from 'fs';
let content = fs.readFileSync('src/circuitSolver.ts', 'utf8');
content = content.replace(
  "const { getPinOffset } = require('./utils') || await import('./utils.js').catch(() => ({}));",
  "// Removed dynamic import, rely on predefined coordinates"
);

// We need to actually import getPinOffset at the top of the file
content = "import { getPinOffset } from './utils';\n" + content;
content = content.replace(
  "if (getPinOffset) {",
  "if (getPinOffset) {"
);
fs.writeFileSync('src/circuitSolver.ts', content);
