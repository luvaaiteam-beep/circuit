const fs = require('fs');
let code = fs.readFileSync('src/components/UI.tsx', 'utf8');

const targetStr = `<div className="flex px-4 border-b border-zinc-800 shrink-0">
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

const replaceStr = `<div className="flex px-4 py-3 border-b border-zinc-800 shrink-0">
            <h3 className="text-zinc-100 font-bold text-sm">Inspector</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-4">`;

code = code.replace(targetStr, replaceStr);

const targetStr2 = `                    <button onClick={handleRotate} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center justify-center gap-2">
                      <RotateCw size={14} /> Rotate 90°
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-4 text-zinc-500 text-xs">No component selected.</div>
                )}
              </div>
            ) : mobileInspectorTab === 'ai' ? (`;

const replaceStr2 = `                    <button onClick={handleRotate} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center justify-center gap-2">
                      <RotateCw size={14} /> Rotate 90°
                    </button>
                  </div>
                  
                  {/* Oscilloscope for selected component */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col gap-2 h-32">
                    <div className="text-zinc-600 flex justify-between uppercase text-[10px] font-mono">
                      <span>OSCILLOSCOPE</span>
                    </div>
                    <div className="flex-1 w-full bg-zinc-950 rounded border border-zinc-800 relative overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 50 100">
                        <polyline
                          points={vHistory.map((v, i) => {
                            const maxV = 24;
                            const baseline = 50;
                            const y = baseline - (v / maxV) * 50;
                            return \`\${i},\${Math.max(0, Math.min(100, y))}\`;
                          }).join(' ')}
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 text-zinc-500 text-xs">No component selected.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile AI Sheet */}
      {isMobile && showAiSheet && (
        <div className="fixed inset-x-0 bottom-0 z-[200] bg-zinc-950 border-t border-zinc-800 rounded-t-2xl flex flex-col shadow-[0_-5px_30px_rgba(0,0,0,0.5)]" style={{ height: '80vh' }}>
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="text-zinc-100 font-bold text-sm flex items-center gap-2"><Cpu size={16} className="text-cyan-400"/> AI Assistant</h3>
            <button onClick={() => setShowAiSheet(false)} className="text-zinc-400"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-hidden p-3 bg-zinc-900">
            <AiChatPanel aiHistory={aiHistory} handleAiSubmit={handleAiSubmit} aiLoading={aiLoading} aiInput={aiInput} setAiInput={setAiInput} />
          </div>
        </div>
      )}

      {/* Mobile More Actions Menu */}`;

// Find where to slice
const startIndex = code.indexOf(targetStr2);
const endIndexStr = `{/* Mobile More Actions Menu */}`;
const endIndex = code.indexOf(endIndexStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + replaceStr2 + code.substring(endIndex + endIndexStr.length);
  fs.writeFileSync('src/components/UI.tsx', code);
  console.log('Patch applied successfully');
} else {
  console.log('Failed to find replacement indices', { startIndex, endIndex });
}
