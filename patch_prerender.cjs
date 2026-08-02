const fs = require('fs');
let code = fs.readFileSync('scripts/prerender.tsx', 'utf8');

code = code.replace(`import { AuthProvider } from '../src/hooks/useAuth';\n`, '');
code = code.replace(`<AuthProvider>\n        <StaticRouter location={route.path}>\n          <Component />\n        </StaticRouter>\n      </AuthProvider>`, `<StaticRouter location={route.path}>\n          <Component />\n        </StaticRouter>`);

fs.writeFileSync('scripts/prerender.tsx', code);
console.log("Patched prerender.tsx");
