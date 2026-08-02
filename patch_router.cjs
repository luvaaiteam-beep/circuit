const fs = require('fs');
let code = fs.readFileSync('src/router.tsx', 'utf8');

const importAuth = `import { AuthProvider } from './hooks/useAuth';\nimport { Outlet } from 'react-router-dom';\n`;
if (!code.includes('AuthProvider')) {
    code = code.replace(`import { Routes, Route`, importAuth + `import { Routes, Route`);
}

const authLayout = `const AuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);\n\nexport const RouterComponent`;

code = code.replace(`export const RouterComponent`, authLayout);

// Now wrap the routes
code = code.replace(`<Route path="/sim"`, `<Route element={<AuthLayout />}>\n            <Route path="/sim"`);
code = code.replace(`<Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />`, `<Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />\n          </Route>`);

fs.writeFileSync('src/router.tsx', code);
console.log("Patched router");
