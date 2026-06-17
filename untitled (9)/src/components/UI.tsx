import React, { useState } from 'react';
import { useCircuitStore, ComponentType, ToolType } from '../store';
import { Battery, Zap, Lightbulb, ToggleLeft, Settings, Trash2, MousePointer2, GitCommitHorizontal, RotateCw, Play, Square, Activity, Terminal, Cpu, Layers, Download, Upload, ArrowRightToLine, Magnet, Fan, Volume2, SlidersHorizontal, ShieldAlert, Sun, Moon, ToggleRight, Share2, Grid, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { saveCircuit, shareCircuit } from '../services/circuitService';

export const UI = () => {
  const { 
    activeTool, setTool, components, wires, simRunning, simStats, 
    toggleSimulation, clearAll, autoWire, selectedCompId, updateComponent, toastMessage, toastType, removeComponent, logs,
    undo, redo, snapToGrid, toggleSnap
  } = useCircuitStore();

  const { user, signInWithGoogle } = useAuth();

  const [activeBottomTab, setActiveBottomTab] = useState<'console' | 'stats' | 'ai'>('console');
  const [bottomOpen, setBottomOpen] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [shareResult, setShareResult] = useState<{ url: string, circuitId: string } | null>(null);
  const [cmd, setCmd] = useState('');
  const [theme, setTheme] = useState<'dark'|'light'>(() => localStorage.getItem('cf_theme') as 'dark'|'light' || 'dark');

  React.useEffect(() => {
    localStorage.setItem('cf_theme', theme);
    if (theme === 'light') document.documentElement.classList.add('theme-light');
    else document.documentElement.classList.remove('theme-light');
  }, [theme]);

  const [searchQuery, setSearchQuery] = useState('');

  const loadTemplate = (type: string) => {
    import('../utils/templates').then(({ getTemplate }) => {
      const { components, wires } = getTemplate(type);
      useCircuitStore.getState().loadCircuit(JSON.stringify({ components, wires }));
      useCircuitStore.getState().addLog(`Loaded template: ${type}`, 'success');
    });
  };
  const [aiInput, setAiInput] = useState('');
  const [aiHistory, setAiHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const selectedComp = components.find(c => c.id === selectedCompId);
  const [vHistory, setVHistory] = React.useState<number[]>(Array(50).fill(0));

  React.useEffect(() => {
    let interval: number;
    if (activeBottomTab === 'stats' && simRunning) {
      interval = window.setInterval(() => {
        setVHistory(prev => {
          const state = useCircuitStore.getState();
          let targetV = state.simStats.v;
          if (state.selectedCompId && state.componentVoltages[state.selectedCompId] !== undefined) {
             targetV = state.componentVoltages[state.selectedCompId];
          }
          const next = [...prev, targetV];
          if (next.length > 50) next.shift();
          return next;
        });
      }, 50);
    } else if (!simRunning) {
      setVHistory(Array(50).fill(0));
    }
    return () => clearInterval(interval);
  }, [activeBottomTab, simRunning]);

  const handleShare = async () => {
    if (!user) {
      useCircuitStore.getState().showToast('Please sign in to share circuits', 'error');
      signInWithGoogle();
      return;
    }
    if (components.length === 0) {
      useCircuitStore.getState().showToast('Cannot share an empty circuit', 'error');
      return;
    }

    setIsSharing(true);
    try {
      const circuitName = prompt('Enter a name for your circuit:', 'My Circuit') || 'My Circuit';
      const circuitId = await saveCircuit(user.uid, circuitName, components, wires);
      const url = await shareCircuit(user.uid, circuitId);
      
      setShareResult({ url, circuitId });
      useCircuitStore.getState().showToast('Circuit shared! View details in the modal.', 'success');
    } catch (error) {
      console.error('Error sharing circuit:', error);
      useCircuitStore.getState().showToast('Failed to share circuit', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleAiSubmit = async (e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent, promptOverride?: string) => {
    if (e && (e as React.KeyboardEvent).key && (e as React.KeyboardEvent).key !== 'Enter') return;
    
    const question = promptOverride || aiInput.trim();
    if (!question || aiLoading) return;

    setAiInput('');
    setAiHistory(prev => [...prev, { role: 'user', content: question }]);
    setAiLoading(true);

    try {
      const { buildCircuitContext, streamAsk } = await import('../services/geminiAI');
      const context = await buildCircuitContext(components, wires, simStats);
      
      setAiHistory(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const stream = await streamAsk(question, aiHistory, context);
      
      for await (const chunk of stream) {
        setAiHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content += chunk;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAiHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your API key.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRotate = () => {
    if (selectedComp) {
      updateComponent(selectedComp.id, {
        rotation: [selectedComp.rotation[0], selectedComp.rotation[1] + Math.PI / 2, selectedComp.rotation[2]]
      });
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) setTool('select');
      if (e.key === 'w' || e.key === 'W') setTool('wire');
      if (e.key === 'd' || e.key === 'D') setTool('delete');
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedCompId) removeComponent(selectedCompId);
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const state = useCircuitStore.getState();
        if (state.selectedCompId) {
          const comp = state.components.find(c => c.id === state.selectedCompId);
          if (comp) {
            state.setClipboard(comp);
            state.showToast('Copied component');
          }
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        useCircuitStore.getState().pasteComponent();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { undo(); e.preventDefault(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { redo(); e.preventDefault(); }
      if (e.key === 'r' || e.key === 'R') handleRotate();
      if (e.key === 'Escape') setTool('select');
      if (e.key === ' ') { e.preventDefault(); toggleSimulation(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCompId, setTool, removeComponent, undo, redo, selectedComp, updateComponent, toggleSimulation]);

  const Minimap = () => {
    if (components.length === 0) return null;
    const minX = Math.min(...components.map(c => c.position[0]), -10) - 5;
    const maxX = Math.max(...components.map(c => c.position[0]), 10) + 5;
    const minZ = Math.min(...components.map(c => c.position[2]), -10) - 5;
    const maxZ = Math.max(...components.map(c => c.position[2]), 10) + 5;
    
    return (
      <div className="w-full aspect-square bg-zinc-900 border border-zinc-800 flex flex-col rounded-lg p-2 pointer-events-none transition-all mt-6 hidden md:flex">
        <div className="text-[10px] tracking-widest text-zinc-500 uppercase font-mono font-semibold mb-2">Mini-Map</div>
        <div className="flex-1 relative w-full h-full overflow-hidden">
          <svg width="100%" height="100%" viewBox={`${minX} ${minZ} ${maxX - minX} ${maxZ - minZ}`}>
            {wires.map(w => {
              const fromC = components.find(c => c.id === w.from.compId);
              const toC = components.find(c => c.id === w.to.compId);
              if (fromC && toC) {
                return <line key={w.id} x1={fromC.position[0]} y1={fromC.position[2]} x2={toC.position[0]} y2={toC.position[2]} stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />;
              }
              return null;
            })}
            {components.map(c => (
              <g key={c.id}>
                <rect x={c.position[0] - 1} y={c.position[2] - 0.5} width="2" height="1" fill={c.id === selectedCompId ? '#22d3ee' : '#3f3f46'} rx="0.2" />
                <text x={c.position[0]} y={c.position[2] + 0.15} fontFamily="monospace" fontWeight="bold" fontSize="0.4" fill="#09090b" textAnchor="middle" dominantBaseline="middle">
                  {c.type.substring(0,3).toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const exportPNG = () => {
    const canvas = document.querySelector('#circuit-canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `circuit-${new Date().getTime()}.png`;
      a.click();
      useCircuitStore.getState().showToast('Exported as PNG', 'success');
    }
  };

  const exportSVG = () => {
    const { components, wires } = useCircuitStore.getState();
    if (components.length === 0) return;
    const minX = Math.min(...components.map(c => c.position[0])) - 5;
    const maxX = Math.max(...components.map(c => c.position[0])) + 5;
    const minZ = Math.min(...components.map(c => c.position[2])) - 5;
    const maxZ = Math.max(...components.map(c => c.position[2])) + 5;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minZ} ${maxX - minX} ${maxZ - minZ}">\n`;
    svgContent += `<rect width="100%" height="100%" fill="#ffffff" />\n`;
    
    wires.forEach(w => {
      const fromC = components.find(c => c.id === w.from.compId);
      const toC = components.find(c => c.id === w.to.compId);
      if (fromC && toC) {
        svgContent += `<line x1="${fromC.position[0]}" y1="${fromC.position[2]}" x2="${toC.position[0]}" y2="${toC.position[2]}" stroke="#38bdf8" stroke-width="0.1" />\n`;
      }
    });

    components.forEach(c => {
      svgContent += `<rect x="${c.position[0] - 1}" y="${c.position[2] - 0.5}" width="2" height="1" fill="#f1f5f9" stroke="#64748b" stroke-width="0.1" rx="0.2" />\n`;
      svgContent += `<text x="${c.position[0]}" y="${c.position[2] + 0.05}" font-family="monospace" font-weight="bold" font-size="0.3" fill="#0f172a" text-anchor="middle" dominant-baseline="middle">${c.type.toUpperCase()}</text>\n`;
    });
    
    svgContent += `</svg>`;
    
    const blob = new Blob([svgContent], {type: "image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit-${new Date().getTime()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    useCircuitStore.getState().showToast('Exported SVG', 'success');
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cmd.trim()) {
      const command = cmd.trim();
      useCircuitStore.getState().addLog(`> ${command}`, 'cmd');
      
      const parts = command.toLowerCase().split(' ');
      if (parts[0] === 'clear') clearAll();
      else if (parts[0] === 'run') { if (!simRunning) toggleSimulation(); }
      else if (parts[0] === 'stop') { if (simRunning) toggleSimulation(); }
      else if (parts[0] === 'add' && parts[1]) {
        setTool(parts[1] as ToolType);
        useCircuitStore.getState().addLog(`Tool set to ${parts[1]}. Click canvas to place.`, 'success');
      }
      else if (parts[0] === 'help') {
        useCircuitStore.getState().addLog(`Commands: clear, run, stop, add [battery|resistor|led|switch|capacitor|bulb|diode|inductor|motor|buzzer]`, 'info');
      }
      else {
        useCircuitStore.getState().addLog(`Unknown command: ${parts[0]}. Type 'help' for commands.`, 'error');
      }
      setCmd('');
    }
  };

  const handleSave = () => {
    const data = JSON.stringify({ components, wires });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';
    a.click();
    useCircuitStore.getState().addLog('Circuit saved to disk.', 'success');
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        useCircuitStore.getState().loadCircuit(ev.target.result as string);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-zinc-950/90 border-b border-zinc-800 flex items-center px-6 gap-4 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Cpu className="text-cyan-400" size={20} />
          <div className="font-mono text-lg text-zinc-100 tracking-tight font-bold whitespace-nowrap">
            Circuit<span className="text-cyan-400">Forge</span>
          </div>
        </div>
        
        <div className="w-px h-6 bg-zinc-800 shrink-0 ml-2" />
        
        <div className="font-mono text-[10px] px-2.5 py-1 rounded border border-zinc-700 text-zinc-400 flex items-center gap-1.5 bg-zinc-900/50">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> v0.4.0
        </div>
        
        <div className="w-px h-6 bg-zinc-800 shrink-0" />
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold tracking-wider border transition-all ${
              simRunning 
                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                : 'bg-cyan-400 text-zinc-950 border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            }`}
          >
            {simRunning ? <><Square size={14} /> STOP</> : <><Play size={14} /> RUN</>}
          </button>
          
          <button 
            onClick={() => setShowTemplates(true)} 
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold tracking-wider border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400 transition-all shadow-[0_0_10px_rgba(234,179,8,0.2)]"
          >
            <Lightbulb size={14} /> TEMPLATES
          </button>
          
          <button onClick={() => setShowFaq(true)} className="px-4 py-1.5 rounded text-xs font-bold tracking-wider border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-all">
            FAQ
          </button>
          
          <button onClick={exportPNG} className="px-4 py-1.5 rounded text-xs font-bold tracking-wider border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center gap-1.5 focus:outline-none">
            <Camera size={14} /> PNG
          </button>
          
          <button onClick={exportSVG} className="px-4 py-1.5 rounded text-xs font-bold tracking-wider border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center gap-1.5 focus:outline-none">
            <Download size={14} /> SVG
          </button>
          
          <button onClick={autoWire} className="px-4 py-1.5 rounded text-xs font-bold tracking-wider border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-all">
            AUTO-WIRE
          </button>
          
          <button onClick={() => setShowClearConfirm(true)} className="px-4 py-1.5 rounded text-xs font-bold tracking-wider border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all">
            CLEAR
          </button>
          
          <div className="w-px h-4 bg-zinc-800 shrink-0 mx-1" />
          
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className={`p-1.5 rounded border transition-all bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-cyan-400 hover:border-cyan-400/50`} 
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          
          <button 
            onClick={toggleSnap} 
            className={`p-1.5 rounded border transition-all ${snapToGrid ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/50' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-cyan-400 hover:border-cyan-400/50'}`} 
            title="Toggle Snap to Grid"
          >
            <Grid size={14} />
          </button>
          
          <button onClick={handleSave} className="p-1.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all" title="Save Circuit">
            <Download size={14} />
          </button>
          <label className="p-1.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all cursor-pointer" title="Load Circuit">
            <Upload size={14} />
            <input type="file" accept=".json" className="hidden" onChange={handleLoad} />
          </label>
          <button 
            onClick={handleShare} 
            disabled={isSharing}
            className={`p-1.5 rounded border border-zinc-800 bg-zinc-950 transition-all flex items-center gap-1 ${isSharing ? 'text-zinc-600' : 'text-zinc-400 hover:text-emerald-400 hover:border-emerald-400/50'}`} 
            title="Share Circuit"
          >
            <Share2 size={14} />
            {isSharing && <span className="text-[10px] animate-pulse">...</span>}
          </button>
        </div>

        <div className={`ml-auto font-mono text-[11px] font-medium transition-all flex items-center gap-2 ${simRunning ? 'text-emerald-400' : 'text-zinc-500'}`}>
          <Activity size={14} className={simRunning ? 'animate-pulse' : ''} />
          {simRunning ? 'SIMULATION ACTIVE' : 'SYSTEM IDLE'}
        </div>
      </div>

      {/* Left Panel - Library & Tools */}
      <div className={`fixed left-0 top-14 bottom-8 bg-zinc-950/95 border-r border-zinc-800 flex flex-col z-40 backdrop-blur-md transition-all duration-300 ${leftOpen ? 'w-[240px]' : 'w-[60px]'}`}>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-2 text-[10px] tracking-widest text-zinc-500 uppercase font-mono font-semibold transition-opacity ${leftOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              <Layers size={12} /> Components
            </div>
            <button onClick={() => setLeftOpen(!leftOpen)} className="text-zinc-500 hover:text-zinc-300">
              {leftOpen ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
            </button>
          </div>
          
          {leftOpen && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-zinc-600 transition-all font-mono"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2">
            {[
              { type: 'battery', icon: Battery, color: 'text-cyan-400', border: 'border-cyan-400/30', bg: 'bg-cyan-400/10', label: 'Battery', desc: '9V DC source' },
              { type: 'resistor', icon: Zap, color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10', label: 'Resistor', desc: '100Ω default' },
              { type: 'led', icon: Lightbulb, color: 'text-pink-400', border: 'border-pink-400/30', bg: 'bg-pink-400/10', label: 'LED', desc: '2.0V forward' },
              { type: 'switch', icon: ToggleLeft, color: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10', label: 'Switch', desc: 'Toggle ON/OFF' },
              { type: 'capacitor', icon: Settings, color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-400/10', label: 'Capacitor', desc: '100µF' },
              { type: 'bulb', icon: Lightbulb, color: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/10', label: 'Bulb', desc: 'Incandescent' },
              { type: 'diode', icon: ArrowRightToLine, color: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/10', label: 'Diode', desc: '1N4148' },
              { type: 'inductor', icon: Magnet, color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', label: 'Inductor', desc: '10mH' },
              { type: 'motor', icon: Fan, color: 'text-rose-400', border: 'border-rose-400/30', bg: 'bg-rose-400/10', label: 'Motor', desc: 'DC 3V-9V' },
              { type: 'buzzer', icon: Volume2, color: 'text-fuchsia-400', border: 'border-fuchsia-400/30', bg: 'bg-fuchsia-400/10', label: 'Buzzer', desc: 'Piezo 440Hz' },
              { type: 'voltmeter', icon: Activity, color: 'text-cyan-500', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', label: 'Voltmeter', desc: 'Measures Voltage' },
              { type: 'ammeter', icon: Activity, color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', label: 'Ammeter', desc: 'Measures Current' },
              { type: 'potentiometer', icon: SlidersHorizontal, color: 'text-yellow-500', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', label: 'Potentiometer', desc: 'Variable Resistor' },
              { type: 'transistor_npn', icon: Cpu, color: 'text-gray-400', border: 'border-gray-400/30', bg: 'bg-gray-400/10', label: 'NPN Transistor', desc: 'BJT' },
              { type: 'transformer', icon: Zap, color: 'text-indigo-400', border: 'border-indigo-400/30', bg: 'bg-indigo-400/10', label: 'Transformer', desc: 'AC Voltage Step' },
              { type: 'fuse', icon: ShieldAlert, color: 'text-red-400', border: 'border-red-400/30', bg: 'bg-red-400/10', label: 'Fuse', desc: 'Overcurrent Protect' },
              { type: 'solar_panel', icon: Sun, color: 'text-yellow-300', border: 'border-yellow-300/30', bg: 'bg-yellow-300/10', label: 'Solar Panel', desc: 'Light to Power' },
              { type: 'logic_gate_and', icon: Cpu, color: 'text-emerald-500', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', label: 'AND Gate', desc: 'Logic AND' },
              { type: 'logic_gate_or', icon: Cpu, color: 'text-blue-500', border: 'border-blue-500/30', bg: 'bg-blue-500/10', label: 'OR Gate', desc: 'Logic OR' },
              { type: 'rgb_led', icon: Lightbulb, color: 'text-pink-500', border: 'border-pink-500/30', bg: 'bg-pink-500/10', label: 'RGB LED', desc: 'Multi-color LED' },
              { type: 'zener_diode', icon: ArrowRightToLine, color: 'text-red-500', border: 'border-red-500/30', bg: 'bg-red-500/10', label: 'Zener Diode', desc: 'Voltage Reg' },
              { type: 'relay', icon: ToggleRight, color: 'text-amber-500', border: 'border-amber-500/30', bg: 'bg-amber-500/10', label: 'Relay', desc: 'Electromech Switch' },
            ].filter(comp => leftOpen ? comp.label.toLowerCase().includes(searchQuery.toLowerCase()) : true).map(comp => {
              const isActive = activeTool === comp.type;
              return (
                <button
                  key={comp.type}
                  onClick={() => setTool(comp.type as ToolType)}
                  title={!leftOpen ? comp.label : undefined}
                  className={`w-full p-2.5 rounded-lg border flex items-center gap-3 text-left transition-all duration-200 ${
                    isActive 
                      ? `${comp.border} ${comp.bg} shadow-[inset_0_0_12px_rgba(0,0,0,0.2)]` 
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800'
                  } ${!leftOpen ? 'justify-center p-2' : ''}`}
                >
                  <div className={`p-1.5 rounded-md bg-zinc-950 border border-zinc-800 shrink-0 ${isActive ? comp.color : 'text-zinc-400'}`}>
                    <comp.icon size={16} />
                  </div>
                  {leftOpen && (
                    <div className="whitespace-nowrap overflow-hidden">
                      <div className={`text-xs font-semibold ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}>{comp.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{comp.desc}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-zinc-800 my-5" />
          
          {leftOpen && <div className="text-[10px] tracking-widest text-zinc-500 uppercase mb-3 font-mono font-semibold">Tools</div>}
          <div className="flex flex-col gap-2">
            {[
              { type: 'select', icon: MousePointer2, label: 'Select / Move', shortcut: 'S' },
              { type: 'wire', icon: GitCommitHorizontal, label: 'Wire Tool', shortcut: 'W' },
              { type: 'delete', icon: Trash2, label: 'Delete', shortcut: 'Del' },
            ].map(tool => {
              const isActive = activeTool === tool.type;
              return (
                <button
                  key={tool.type}
                  onClick={() => setTool(tool.type as ToolType)}
                  title={!leftOpen ? tool.label : undefined}
                  className={`w-full p-2 border rounded-lg flex items-center justify-between text-xs font-medium transition-all ${
                    isActive 
                      ? 'border-cyan-400/50 text-cyan-400 bg-cyan-400/10' 
                      : 'border-zinc-800 text-zinc-400 bg-zinc-900/50 hover:border-zinc-700 hover:text-zinc-200'
                  } ${!leftOpen ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <tool.icon size={14} /> {leftOpen && tool.label}
                  </div>
                  {leftOpen && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-500">{tool.shortcut}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Inspector & Meters */}
      <div className="fixed right-0 top-14 bottom-8 w-[280px] bg-zinc-950/95 border-l border-zinc-800 flex flex-col z-40 backdrop-blur-md">
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Live Meters */}
          <div className="mb-6">
            <div className="text-[10px] tracking-widest text-zinc-500 uppercase mb-3 font-mono font-semibold flex items-center justify-between">
              <span>Telemetry</span>
              <span className={`w-2 h-2 rounded-full ${simStats.closed ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-500'}`} />
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col gap-3">
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-zinc-500 font-mono text-[10px]">VOLTAGE</span>
                  <span className="text-cyan-400 font-mono text-sm font-medium">{simStats.v.toFixed(2)} V</span>
                </div>
                <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${Math.min(100, (simStats.v / 12) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-zinc-500 font-mono text-[10px]">CURRENT</span>
                  <span className="text-orange-400 font-mono text-sm font-medium">{(simStats.i * 1000).toFixed(2)} mA</span>
                </div>
                <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${Math.min(100, (simStats.i / 0.05) * 100)}%` }} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-zinc-950 rounded p-2 border border-zinc-800/50">
                  <div className="text-zinc-600 font-mono text-[9px] mb-0.5">RESISTANCE</div>
                  <div className="text-zinc-300 font-mono text-xs">{simStats.r.toFixed(1)} Ω</div>
                </div>
                <div className="bg-zinc-950 rounded p-2 border border-zinc-800/50">
                  <div className="text-zinc-600 font-mono text-[9px] mb-0.5">POWER</div>
                  <div className="text-zinc-300 font-mono text-xs">{(simStats.p * 1000).toFixed(1)} mW</div>
                </div>
              </div>
            </div>
          </div>

          {/* Inspector */}
          <div>
            <div className="text-[10px] tracking-widest text-zinc-500 uppercase mb-3 font-mono font-semibold">Inspector</div>
            
            {selectedComp ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
                  <span className="text-zinc-100 font-medium text-sm capitalize">{selectedComp.type}</span>
                  <span className="text-zinc-600 font-mono text-[9px]">{selectedComp.id.slice(0, 8)}</span>
                </div>
                
                <div className="flex flex-col gap-2 mb-4">
                  {Object.entries(selectedComp.properties).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-zinc-400 font-mono text-[11px] capitalize">{k}</span>
                      {typeof v === 'boolean' ? (
                        <button 
                          onClick={() => updateComponent(selectedComp.id, { properties: { ...selectedComp.properties, [k]: !v } })} 
                          className={`px-2 py-0.5 rounded text-xs font-mono border ${v ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-950 text-zinc-500 border-zinc-800'}`}
                        >
                          {v ? 'TRUE' : 'FALSE'}
                        </button>
                      ) : (
                        <input 
                          type="number" 
                          value={v as number}
                          onChange={(e) => updateComponent(selectedComp.id, { properties: { ...selectedComp.properties, [k]: parseFloat(e.target.value) || 0 } })}
                          className="w-20 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-cyan-400 text-right text-xs font-mono outline-none focus:border-cyan-400 transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleRotate} 
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCw size={14} /> Rotate 90°
                </button>
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-zinc-800/50 border-dashed rounded-lg p-6 text-center">
                <MousePointer2 className="mx-auto text-zinc-600 mb-2" size={20} />
                <div className="text-zinc-500 text-xs">Select a component<br/>to view properties</div>
              </div>
            )}
          </div>

          {/* Minimap */}
          <Minimap />
          
        </div>
      </div>

      {/* Bottom Console / Stats Panel */}
      <div className={`fixed right-[280px] h-32 bg-zinc-950 border-t border-zinc-800 flex flex-col z-30 transition-all duration-300 ${bottomOpen ? 'bottom-8' : '-bottom-32'} ${leftOpen ? 'left-[240px]' : 'left-[60px]'}`}>
        <div className="absolute -top-8 right-4 flex items-center gap-1">
          <button 
            onClick={() => setBottomOpen(!bottomOpen)}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-t-lg text-zinc-400 hover:text-cyan-400 text-[10px] font-mono transition-colors"
          >
            {bottomOpen ? '▼ HIDE PANEL' : '▲ SHOW PANEL'}
          </button>
        </div>
        <div className="flex items-center gap-1 px-2 pt-2 border-b border-zinc-800">
          <button 
            onClick={() => setActiveBottomTab('console')}
            className={`px-4 py-1.5 text-xs font-mono rounded-t-lg flex items-center gap-2 ${activeBottomTab === 'console' ? 'bg-zinc-900 text-zinc-200 border-t border-l border-r border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Terminal size={12} /> Console
          </button>
          <button 
            onClick={() => setActiveBottomTab('stats')}
            className={`px-4 py-1.5 text-xs font-mono rounded-t-lg flex items-center gap-2 ${activeBottomTab === 'stats' ? 'bg-zinc-900 text-zinc-200 border-t border-l border-r border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Activity size={12} /> Network Stats
          </button>
          <button 
            onClick={() => setActiveBottomTab('ai')}
            className={`px-4 py-1.5 text-xs font-mono rounded-t-lg flex items-center gap-2 ${activeBottomTab === 'ai' ? 'bg-zinc-900 text-zinc-200 border-t border-l border-r border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Cpu size={12} /> AI Assistant
          </button>
        </div>
        <div className="flex-1 bg-zinc-900 p-3 overflow-y-auto custom-scrollbar font-mono text-[11px] flex flex-col">
          {activeBottomTab === 'console' ? (
            <>
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 mb-2 pr-2">
                {logs.map(log => (
                  <div key={log.id} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'cmd' ? 'text-zinc-300' : 'text-cyan-400'}`}>
                    <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                    <span className="break-all">{log.msg}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-zinc-800 pt-2 shrink-0">
                <span className="text-cyan-400 font-bold">&gt;</span>
                <input 
                  type="text" 
                  value={cmd}
                  onChange={e => setCmd(e.target.value)}
                  onKeyDown={handleCommand}
                  className="flex-1 bg-transparent outline-none text-zinc-200 placeholder-zinc-600"
                  placeholder="Type a command (e.g. 'help', 'run', 'add resistor')..."
                  spellCheck={false}
                />
              </div>
            </>
          ) : activeBottomTab === 'stats' ? (
            <div className="flex gap-4 h-full">
              <div className="flex flex-col gap-2 w-1/3">
                <div className="flex justify-between">
                  <span className="text-zinc-600">NODES</span>
                  <span className="text-zinc-200">{components.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">EDGES</span>
                  <span className="text-zinc-200">{wires.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">STATE</span>
                  <span className={simStats.closed ? 'text-emerald-400' : 'text-red-400'}>{simStats.closed ? 'CLOSED' : 'OPEN'}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col h-full border-l border-zinc-800 pl-4">
                <div className="text-zinc-600 mb-1 flex justify-between uppercase">
                  <span>{selectedCompId ? `OSCILLOSCOPE (${selectedComp?.type})` : 'VOLTAGE WAVEFORM'}</span>
                  <span className="text-cyan-400">
                    {selectedCompId && useCircuitStore.getState().componentVoltages[selectedCompId] !== undefined ? `${useCircuitStore.getState().componentVoltages[selectedCompId].toFixed(2)}V` : `${simStats.v.toFixed(2)}V`}
                  </span>
                </div>
                <div className="flex-1 w-full bg-zinc-950 rounded border border-zinc-800 relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 50 100">
                    <polyline
                      points={vHistory.map((v, i) => {
                        const maxV = 24;
                        const baseline = 50; // center is 0V
                        const y = baseline - (v / maxV) * 50;
                        return `${i},${Math.max(0, Math.min(100, y))}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 mb-2 pr-2">
                {aiHistory.length === 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="text-zinc-500 italic">Ask me anything about your circuit!</div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {['Explain this circuit', 'Find errors', 'Suggest improvements'].map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => handleAiSubmit(undefined, prompt)}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {aiHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'text-zinc-300' : 'text-cyan-400'}`}>
                    <span className="shrink-0 font-bold">{msg.role === 'user' ? 'You:' : 'AI:'}</span>
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                ))}
                {aiLoading && <div className="text-zinc-500 animate-pulse">Thinking...</div>}
              </div>
              <div className="flex items-center gap-2 border-t border-zinc-800 pt-2 shrink-0">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={handleAiSubmit}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 outline-none text-zinc-200 placeholder-zinc-600 focus:border-cyan-400/50"
                  placeholder="Ask CircuitForge AI..."
                  spellCheck={false}
                />
                <button onClick={handleAiSubmit} disabled={aiLoading || !aiInput.trim()} className="px-3 py-1 bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded hover:bg-cyan-400/20 disabled:opacity-50">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between px-4 z-50">
        <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-4">
          <span><b className="text-zinc-400">Right-drag:</b> Orbit</span>
          <span><b className="text-zinc-400">Scroll:</b> Zoom</span>
          <span><b className="text-zinc-400">Mid-drag:</b> Pan</span>
        </div>
        <div className="text-[10px] text-zinc-600 font-mono">
          CircuitForge Engine v1.0.0
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-[400px]">
            <h2 className="text-lg font-bold text-zinc-100 mb-4">Circuit Templates</h2>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {[
                { id: 'basic_led', name: 'Basic LED Circuit', desc: 'Battery, Switch, Resistor, LED' },
                { id: 'voltage_divider', name: 'Voltage Divider', desc: 'Battery, 2 Resistors, Voltmeter' },
                { id: 'h_bridge', name: 'H-Bridge Motor Control', desc: '4 Switches, Battery, Motor' },
                { id: 'transistor_switch', name: 'Transistor Switch', desc: 'NPN Transistor, Resistor, LED' },
                { id: 'logic_and', name: 'Logic AND Gate', desc: 'Battery, 2 Switches, AND Gate, LED' },
                { id: 'logic_or', name: 'Logic OR Gate', desc: 'Battery, 2 Switches, OR Gate, LED' },
                { id: 'rc_circuit', name: 'RC Charge Circuit', desc: 'Battery, Switch, Resistor, Capacitor' },
                { id: 'rl_circuit', name: 'RL Inductive Circuit', desc: 'Battery, Switch, Resistor, Inductor' },
                { id: 'relay_latch', name: 'Relay Latch', desc: 'Battery, Switch, Relay, Motor' },
                { id: 'motor_driver', name: 'Variable Motor Driver', desc: 'Battery, Potentiometer, Motor' },
                { id: 'rgb_mixer', name: 'RGB Color Mixer', desc: 'Battery, 3 Switches, RGB LED' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => {
                    loadTemplate(t.id);
                    setShowTemplates(false);
                  }}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-cyan-400 text-left transition-colors"
                >
                  <div className="font-bold text-cyan-400">{t.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowTemplates(false)}
              className="mt-6 w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm font-medium transition-colors text-zinc-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-zinc-100 mb-4">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h3 className="font-bold text-cyan-400 mb-2">How do I connect wires?</h3>
                <p className="text-sm text-zinc-400">Select the Wire Tool (W). Click on a component's pin to start the wire, then click on another component's pin to complete the connection.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h3 className="font-bold text-cyan-400 mb-2">Can I save my circuit?</h3>
                <p className="text-sm text-zinc-400">Yes! Use the Save button (download icon) in the top bar to save your circuit as a JSON file locally, or use the Share button to get a shareable link.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h3 className="font-bold text-cyan-400 mb-2">Is the simulation accurate?</h3>
                <p className="text-sm text-zinc-400">The simulator uses Modified Nodal Analysis (MNA) to solve the circuit physics in real-time, providing accurate voltage and current readings.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowFaq(false)}
              className="mt-6 w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm font-medium transition-colors text-zinc-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Share / Embed Modal */}
      {shareResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-[500px]">
             <h2 className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <Share2 className="text-cyan-400" size={20} /> Circuit Shared
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Share Link</label>
                <div className="flex items-center gap-2">
                  <input readOnly value={shareResult.url} className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 font-mono focus:outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText(shareResult.url); useCircuitStore.getState().showToast('Copied link!', 'success'); }} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors">Copy</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Embed Widget</label>
                <div className="flex items-center gap-2 mb-2">
                  <textarea 
                    readOnly 
                    value={`<iframe src="${window.location.origin}/embed/${shareResult.circuitId}" width="100%" height="500" frameBorder="0" allowfullscreen></iframe>`} 
                    className="flex-1 h-20 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-400 font-mono focus:outline-none resize-none" 
                  />
                </div>
                <button 
                  onClick={() => { 
                    navigator.clipboard.writeText(`<iframe src="${window.location.origin}/embed/${shareResult.circuitId}" width="100%" height="500" frameBorder="0" allowfullscreen></iframe>`); 
                    useCircuitStore.getState().showToast('Copied embed code!', 'success'); 
                  }} 
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors"
                >
                  Copy Embed Snippet
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShareResult(null)}
              className="mt-6 w-full py-2 bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded font-bold hover:bg-cyan-400/20 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Clear Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-[400px]">
            <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
              <ShieldAlert size={20} /> Clear Circuit
            </h2>
            <p className="text-zinc-400 mb-6 text-sm">
              Are you sure you want to delete all components and wires in your workspace? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  clearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 rounded font-bold transition-all"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Pill */}
      {activeTool === 'wire' && (
        <div className="fixed left-1/2 -translate-x-1/2 top-20 px-4 py-1.5 bg-cyan-400/10 border border-cyan-400/50 rounded-full text-cyan-400 font-mono text-[11px] font-medium z-50 pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-sm">
          WIRE MODE ACTIVE — Click a pin to start connection
        </div>
      )}

      {/* Floating Toast */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-lg bg-zinc-900 border font-mono text-[11px] z-[9999] pointer-events-none whitespace-nowrap transition-all duration-300 ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${
          toastType === 'error' ? 'border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]' :
          toastType === 'success' ? 'border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' :
          'border-cyan-400/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
        }`}
        style={{ bottom: bottomOpen ? '170px' : '48px' }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} />
          {toastMessage}
        </div>
      </div>
    </>
  );
};

