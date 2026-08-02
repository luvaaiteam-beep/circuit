const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

if (!code.includes('experimental')) {
    code = code.replace(`    build: {`, `    build: {\n      modulePreload: {\n        resolveDependencies(filename, deps, context) {\n          return deps.filter(dep => !dep.includes('firebase'));\n        }\n      },`);
    fs.writeFileSync('vite.config.ts', code);
    console.log("Patched vite preload");
}
