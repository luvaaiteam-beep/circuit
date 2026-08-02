const fs = require('fs');
let code = fs.readFileSync('src/router.tsx', 'utf8');
code = code.replace(
  /<Routes location=\{location\} key=\{location.pathname\}>([\s\S]*?)<\/Routes>/,
  "<AuthLayout>\n        <Routes location={location} key={location.pathname}>$1</Routes>\n      </AuthLayout>"
);
code = code.replace(/<Route element=\{<AuthLayout \/>\}>([\s\S]*?)<\/Route>/, "$1");
fs.writeFileSync('src/router.tsx', code);
console.log("Patched router");
