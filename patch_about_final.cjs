const fs = require('fs');
let lines = fs.readFileSync('src/pages/About.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('Who\'s Behind This'));
if (start !== -1) {
  lines[start + 2] = '              CircuitForge is built and maintained by Advik. I am a solo student developer building CircuitForge, a free 3D browser-based circuit simulator. I built this because I wanted a hands-on way to learn circuits myself, and it grew from there.';
  lines[start + 3] = '';
  lines[start + 4] = '';
  lines[start + 5] = '';
}
fs.writeFileSync('src/pages/About.tsx', lines.join('\n'));
console.log("Patched correctly");
