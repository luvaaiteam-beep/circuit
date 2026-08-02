const fs = require('fs');
let code = fs.readFileSync('scripts/prerender.tsx', 'utf8');

const target = `  finalHtml = finalHtml.replace('</head>', \`\${hreflangTags}\\n</head>\`);`;
const replace = `  finalHtml = finalHtml.replace('</head>', \`\${hreflangTags}\\n</head>\`);
  
  // Remove firebase preload
  finalHtml = finalHtml.replace(/<link rel="modulepreload"[^>]*href="\\/assets\\/firebase-[^>]*>/g, '');
`;

code = code.replace(target, replace);
fs.writeFileSync('scripts/prerender.tsx', code);
console.log("Patched preload");
