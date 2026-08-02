const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(
  "<title>CircuitForge — Free 3D Circuit Simulator in Your Browser | luvaai.in</title>",
  "<title>CircuitForge — Free 3D Circuit Simulator in Your Browser</title>"
);
fs.writeFileSync('index.html', code);
console.log("Patched index title");
