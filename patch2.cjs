const fs = require('fs');
let code = fs.readFileSync('src/components/UI.tsx', 'utf8');

const targetStr = `          <div className="flex px-4 border-b border-zinc-800 shrink-0">
            {['Inspector', 'AI', 'Console'].map(tab => (
              <button 
                key={tab}
                onClick={() => setMobileInspectorTab(tab.toLowerCase() as any)}
                className={\`py-2 px-3 text-xs font-mono font-medium border-b-2 transition-colors \${mobileInspectorTab === tab.toLowerCase() ? 'text-cyan-400 border-cyan-400' : 'text-zinc-500 border-transparent'}\`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {mobileInspectorTab === 'inspector' ? (
              <div className="flex flex-col gap-4">`;

const replaceStr = `          <div className="flex px-4 py-3 border-b border-zinc-800 shrink-0">
            <h3 className="text-zinc-100 font-bold text-sm">Inspector</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-4">`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/UI.tsx', code);
  console.log('Fixed');
} else {
  console.log('Not found');
  console.log(code.substring(code.indexOf('mobileInspectorTab ==='), code.indexOf('mobileInspectorTab ===') + 200));
}
