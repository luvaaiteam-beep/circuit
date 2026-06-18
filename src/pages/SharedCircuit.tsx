import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loadPublicCircuit } from '../services/circuitService';
import { useCircuitStore } from '../store';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const SharedCircuit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
          simRunning: false,
          logs: [{ id: Date.now().toString(), msg: `Loaded shared circuit: ${circuit.name}`, type: 'success', time: new Date().toLocaleTimeString() }]
        });
        navigate('/sim');
      } else {
        setError("Circuit not found or is not public.");
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      setError("Error loading circuit.");
      setLoading(false);
    });
  }, [id, navigate]);

  return (
    <div className="min-h-screen relative bg-zinc-950 flex items-center justify-center p-6 font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Helmet>
        <title>Shared Circuit | CircuitForge</title>
        <meta name="description" content="Loading a shared electronic circuit in CircuitForge..." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://luvaai.in/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Shared Circuit",
                "item": `https://luvaai.in/shared/${id}`
              }
            ]
          })}
        </script>
      </Helmet>
      {loading ? (
        <div className="flex flex-col items-center gap-4 text-cyan-400">
          <Loader2 size={48} className="animate-spin" />
          <h2 className="text-xl font-bold">Loading Circuit...</h2>
        </div>
      ) : error ? (
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-zinc-400 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <Link to="/sim" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg transition-colors">
              Go to Simulator
            </Link>
            <Link to="/gallery" className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors">
              Browse Gallery
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};
