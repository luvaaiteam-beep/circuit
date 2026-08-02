const fs = require('fs');
let code = fs.readFileSync('src/pages/About.tsx', 'utf8');
code = code.replace(
  "<title>About CircuitForge — Free 3D Browser Circuit Simulator | luvaai.in</title>",
  "<title>About CircuitForge — Free 3D Browser Circuit Simulator</title>"
);
fs.writeFileSync('src/pages/About.tsx', code);
console.log("Patched about title");
