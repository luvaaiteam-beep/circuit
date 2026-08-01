const fs = require('fs');
let code = fs.readFileSync('src/components/UI.tsx', 'utf8');

const target1 = `<div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={toggleSimulation}`;

const replace1 = `<div className="ml-auto flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setShowAiSheet(true)}
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded text-xs font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
            title="AI Assistant"
          >
            <Cpu size={14} />
            <span className="hidden md:inline">AI</span>
          </button>
          <button 
            onClick={toggleSimulation}`;

if (code.includes(target1)) {
    code = code.replace(target1, replace1);
    console.log("Patched 1");
} else {
    console.log("Target 1 not found");
}

const target2 = `<div className="w-px h-6 bg-zinc-800 shrink-0 mx-1 md:mx-0" />`;
const target2_replace = `<div className="hidden md:block w-px h-6 bg-zinc-800 shrink-0 mx-1 md:mx-0" />`;

const regex = /<div className="w-px h-6 bg-zinc-800 shrink-0 mx-1 md:mx-0" \/>/g;
if (regex.test(code)) {
    code = code.replace(regex, target2_replace);
    console.log("Patched separator");
}

const target3 = `<div className={\`ml-auto font-mono text-[11px]`;
const replace3 = `<div className={\`hidden md:flex ml-auto font-mono text-[11px]`;
if (code.includes(target3)) {
    code = code.replace(target3, replace3);
    console.log("Patched system idle");
}

fs.writeFileSync('src/components/UI.tsx', code);
