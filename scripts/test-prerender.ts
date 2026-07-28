import fs from 'fs';
import path from 'path';

const fileContent = fs.readFileSync('src/pages/blogs/HowToMakeASimpleCircuit.tsx', 'utf-8');

// Regex to extract title
const titleMatch = fileContent.match(/<title>([^<]+)<\/title>/);
const title = titleMatch ? titleMatch[1] : '';

// Regex to extract meta tags
const metaMatches = [...fileContent.matchAll(/<meta[^>]+>/g)].map(m => m[0]);

console.log("Title:", title);
console.log("Meta tags:", metaMatches.join('\n'));
