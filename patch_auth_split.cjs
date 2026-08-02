const fs = require('fs');

let useAuthCode = fs.readFileSync('src/hooks/useAuth.tsx', 'utf8');
useAuthCode = useAuthCode.replace(/export const useAuth = \(\) => {[\s\S]*?};/g, '');
useAuthCode = useAuthCode.replace(/interface AuthContextType {[\s\S]*?}/g, '');
useAuthCode = useAuthCode.replace(/const AuthContext = createContext<AuthContextType \| null>\(null\);/g, "import { AuthContext } from './AuthContext';");
fs.writeFileSync('src/hooks/AuthProvider.tsx', useAuthCode);

// now we replace useAuth imports
function replaceInDir(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            replaceInDir(file);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(file, 'utf8');
            if (content.includes("from '../hooks/useAuth'") || content.includes("from './hooks/useAuth'")) {
                let replaced = content.replace(/from '\.\.\/hooks\/useAuth'/g, "from '../hooks/AuthContext'");
                replaced = replaced.replace(/from '\.\/hooks\/useAuth'/g, "from './hooks/AuthContext'");
                
                // wait, router.tsx needs AuthProvider!
                if (file.includes('router.tsx')) {
                     replaced = replaced.replace("import { AuthProvider } from './hooks/AuthContext';", "import { AuthProvider } from './hooks/AuthProvider';\nimport { useAuth } from './hooks/AuthContext';");
                }
                
                fs.writeFileSync(file, replaced);
            }
        }
    });
}
replaceInDir('src');
