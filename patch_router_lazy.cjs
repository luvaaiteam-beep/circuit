const fs = require('fs');
let code = fs.readFileSync('src/router.tsx', 'utf8');

code = code.replace("import { AuthProvider } from './hooks/AuthProvider';", "");
const target = `const AuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);`;

const replace = `const AuthProvider = React.lazy(() => import('./hooks/AuthProvider').then(m => ({ default: m.AuthProvider })));
const AuthLayout = () => (
  <Suspense fallback={<LoadingScreen />}>
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  </Suspense>
);`;

code = code.replace(target, replace);
fs.writeFileSync('src/router.tsx', code);
console.log("Patched router lazy");
