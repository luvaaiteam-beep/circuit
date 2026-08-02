const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.cjs') || file.endsWith('.tsx') || file.endsWith('.mjs')) {
                const content = fs.readFileSync(file, 'utf8');
                if (content.includes('fs.readFileSync') && content.includes('utf-8') && !file.includes('prerender')) {
                    results.push(file);
                }
            }
        }
    });
    return results;
}
console.log(walk('.'));
