import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadPublicCircuit } from '../services/circuitService';
import { useCircuitStore } from '../store';
import { Scene } from '../components/Scene';
import { Loader2, AlertCircle, Play, Square, Cpu } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const Embed = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { simRunning, toggleSimulation } = useCircuitStore();

  useEffect(() => {
    if (!id) {
      setError("No circuit ID provided");
      setLoading(false);
      return;
    }

    loadPublicCircuit(id).then(circuit => {
      if (circuit) {
        useCircuitStore.setState({
          components: circuit.components,
          wires: circuit.wires,
          simRunning: true, // Start running by default in embed
          activeTool: 'select', // no editing in embed
        });
        setLoading(false);
      } else {
        setError("Circuit not found or is not public.");
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      setError("Error loading circuit.");
      setLoading(false);
    });
    
    // Cleanup on unmount
    return () => {
      useCircuitStore.setState({ simRunning: false });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-4 text-cyan-400 font-sans">
        <Loader2 size={32} className="animate-spin" />
        <span className="font-mono text-sm font-bold tracking-widest">LOADING CIRCUIT...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <AlertCircle size={32} className="text-red-500 mb-4" />
        <p className="text-zinc-400 font-mono text-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950 relative overflow-hidden font-sans">
      <Helmet>
        <title>Embedded Circuit | CircuitForge</title>
        <meta name="description" content="View an interactive 3D electronic circuit simulation embedded from CircuitForge." />
      </Helmet>
      <Scene />
      
      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          onClick={toggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider border transition-all ${
            simRunning 
              ? 'bg-red-500/10 text-red-400 border-red-500/30' 
              : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'
          }`}
        >
          {simRunning ? <><Square size={12} /> STOP</> : <><Play size={12} /> RUN</>}
        </button>
      </div>
      
      {/* Badge */}
      <a 
        href={`/shared/${id}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-10 bg-zinc-900/80 backdrop-blur border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all font-mono text-[10px]"
      >
        <Cpu size={12} /> POWERED BY CIRCUITFORGE
      </a>
    </div>
  );
};
