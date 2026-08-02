const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAuth.tsx', 'utf8');

// replace dynamic import with static
const importStr = `import { useCircuitStore } from '../store';\n`;
if (!code.includes('useCircuitStore')) {
    code = code.replace(`import { createContext`, importStr + `import { createContext`);
}

const target1 = `import('../store').then(({ useCircuitStore }) => {
          useCircuitStore.getState().showToast(errMsg, 'error');
        });`;
const replace1 = `useCircuitStore.getState().showToast(errMsg, 'error');`;
code = code.replace(target1, replace1);

const target2 = `import('../store').then(({ useCircuitStore }) => {
        useCircuitStore.getState().showToast(errMsg, 'error');
      });`;
code = code.replace(target2, replace1);

// Modify useAuth to not throw
const throwTarget = `throw new Error('useAuth must be used within an AuthProvider');`;
const throwReplace = `return { user: null, loading: false, signInWithGoogle: async () => {}, signOut: async () => {} };`;
code = code.replace(throwTarget, throwReplace);

fs.writeFileSync('src/hooks/useAuth.tsx', code);
console.log("Patched useAuth");
