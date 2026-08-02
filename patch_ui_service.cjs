const fs = require('fs');
let code = fs.readFileSync('src/components/UI.tsx', 'utf8');

code = code.replace("import { saveCircuit, shareCircuit } from '../services/circuitService';", "");

code = code.replace("const cid = await saveCircuit(", "const { saveCircuit } = await import('../services/circuitService');\n      const cid = await saveCircuit(");
code = code.replace("const sid = await shareCircuit(", "const { shareCircuit } = await import('../services/circuitService');\n      const sid = await shareCircuit(");

fs.writeFileSync('src/components/UI.tsx', code);
console.log("Patched UI");
