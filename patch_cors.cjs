const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `const allowedOrigins = ['https://luvaai.in', 'http://localhost:3000', 'http://localhost:5173'];`;
const replace = `const allowedOrigins = ['https://luvaai.in', 'https://www.luvaai.in', 'http://localhost:3000', 'http://localhost:5173'];`;

code = code.replace(target, replace);
fs.writeFileSync('server.ts', code);
console.log("Patched CORS");
