const fs = require('fs');
let code = fs.readFileSync('src/pages/About.tsx', 'utf8');
code = code.replace(
  "CircuitForge is built and maintained by one person — me, Advik. I'm a\\n              student, not a professional electronics engineer, and I don't have a\\n              degree or formal industry background in this field. I built this because\\n              I wanted a hands-on way to learn circuits myself, and it grew from there.",
  "CircuitForge is built and maintained by Advik, a solo student developer building CircuitForge, a free 3D browser-based circuit simulator. I wanted a hands-on way to learn circuits myself, and it grew from there."
);
fs.writeFileSync('src/pages/About.tsx', code);
console.log("Patched about text");
