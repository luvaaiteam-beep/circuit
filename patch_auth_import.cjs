const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAuth.tsx', 'utf8');

if (!code.includes("import { useCircuitStore } from '../store';")) {
    code = "import { useCircuitStore } from '../store';\n" + code;
    fs.writeFileSync('src/hooks/useAuth.tsx', code);
    console.log("Import added.");
}
