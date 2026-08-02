const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAuth.tsx', 'utf8');

const target = `return { user: null, loading: false, signInWithGoogle: async () => {}, signOut: async () => {} };`;
const replace = `return { 
    user: null, 
    loading: false, 
    signInWithGoogle: async () => { window.location.href = '/sim'; }, 
    signOut: async () => {} 
  };`;

code = code.replace(target, replace);
fs.writeFileSync('src/hooks/useAuth.tsx', code);
console.log("Patched dummy auth");
