const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

code = code.replace(`import { AuthProvider } from './hooks/useAuth';\n`, '');
code = code.replace(`<AuthProvider>\n        <BrowserRouter>`, `<BrowserRouter>`);
code = code.replace(`</BrowserRouter>\n      </AuthProvider>`, `</BrowserRouter>`);

fs.writeFileSync('src/main.tsx', code);
console.log("Patched main.tsx");
