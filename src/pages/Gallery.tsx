import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadPublicGallery, loadUserCircuits, deleteCircuit, GalleryItem, SavedCircuit } from '../services/circuitService';
import { Layers, ArrowLeft, Play, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const Gallery = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public');
  const [publicCircuits, setPublicCircuits] = useState<GalleryItem[]>([]);
  const [myCircuits, setMyCircuits] = useState<SavedCircuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [circuitToDelete, setCircuitToDelete] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'public') {
      loadPublicGallery().then(items => {
        setPublicCircuits(items);
        setLoading(false);
      });
    } else if (user) {
      loadUserCircuits(user.uid).then(items => {
        setMyCircuits(items);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [activeTab, user]);

  const handleDelete = (circuitId: string) => {
    if (!user) return;
    setCircuitToDelete(circuitId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative bg-zinc-950 text-zinc-100 font-sans p-6 selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Helmet>
        <title>Community Gallery | CircuitForge</title>
        <meta name="description" content="Explore and load electronic circuits built by the CircuitForge community." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": publicCircuits.map((c, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `https://ais-pre-4mzi7p37dmylle7dbs5wpa-568632231557.asia-southeast1.run.app/shared/${c.circuitId}`,
              "name": c.name || 'Untitled Circuit'
            }))
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ais-pre-4mzi7p37dmylle7dbs5wpa-568632231557.asia-southeast1.run.app/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Gallery",
                "item": "https://ais-pre-4mzi7p37dmylle7dbs5wpa-568632231557.asia-southeast1.run.app/gallery"
              }
            ]
          })}
        </script>
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12"
        >
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
              <ArrowLeft size={20} className="text-zinc-400" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Circuits</h1>
          </div>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'public' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Community Gallery
            </button>
            <button 
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'my' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              My Circuits
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl h-48 animate-pulse"></div>
            ))}
          </div>
        ) : activeTab === 'public' ? (
          publicCircuits.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-zinc-900/30 border border-zinc-800 rounded-2xl"
            >
              <Layers size={48} className="mx-auto text-zinc-600 mb-4" />
              <h2 className="text-xl font-bold text-zinc-300 mb-2">No public circuits yet</h2>
              <p className="text-zinc-500">Be the first to share one!</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {publicCircuits.map(circuit => (
                <motion.div 
                  variants={itemVariants}
                  key={circuit.id} 
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="text-lg font-bold text-white truncate pr-4">{circuit.name || 'Untitled Circuit'}</h3>
                    <div className="px-2 py-1 bg-zinc-800 rounded text-xs font-medium text-zinc-400 whitespace-nowrap">
                      {circuit.componentCount} comps
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 mb-6 flex-1 line-clamp-2 relative z-10">
                    {circuit.thumbnailDesc}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50 relative z-10">
                    <div className="text-xs text-zinc-600 flex items-center gap-2">
                      <span>Shared by <span className="text-zinc-400">User</span></span>
                      {circuit.views !== undefined && (
                        <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded-md text-cyan-400 flex items-center gap-1 font-mono text-[9px]">
                           👁 {circuit.views} 
                        </span>
                      )}
                    </div>
                    <Link to={`/shared/${circuit.circuitId}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-zinc-950 rounded text-sm font-medium transition-colors">
                      <Play size={14} /> Open
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          !user ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-zinc-900/30 border border-zinc-800 rounded-2xl"
            >
              <Layers size={48} className="mx-auto text-zinc-600 mb-4" />
              <h2 className="text-xl font-bold text-zinc-300 mb-2">Sign in to view your circuits</h2>
              <p className="text-zinc-500">You need to be signed in to save and manage circuits.</p>
            </motion.div>
          ) : myCircuits.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-zinc-900/30 border border-zinc-800 rounded-2xl"
            >
              <Layers size={48} className="mx-auto text-zinc-600 mb-4" />
              <h2 className="text-xl font-bold text-zinc-300 mb-2">No saved circuits</h2>
              <p className="text-zinc-500">Go to the simulator and save your first circuit!</p>
              <Link to="/sim" className="inline-block mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                Open Simulator
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {myCircuits.map(circuit => (
                <motion.div 
                  variants={itemVariants}
                  key={circuit.id} 
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="text-lg font-bold text-white truncate pr-4">{circuit.name || 'Untitled Circuit'}</h3>
                    <div className="px-2 py-1 bg-zinc-800 rounded text-xs font-medium text-zinc-400 whitespace-nowrap">
                      {circuit.componentCount} comps
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 mb-6 flex-1 line-clamp-2 relative z-10">
                    {circuit.thumbnailDesc}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50 relative z-10">
                    <div className="text-xs text-zinc-600">
                      {circuit.isPublic ? <span className="text-emerald-400">Public</span> : <span className="text-zinc-500">Private</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(circuit.id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                      <Link to={`/shared/${circuit.id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-zinc-950 rounded text-sm font-medium transition-colors">
                        <Play size={14} /> Open
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        )}
      </div>

      {circuitToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-2">Delete Circuit</h3>
            <p className="text-zinc-400 mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCircuitToDelete(null)}
                className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (user && circuitToDelete) {
                    await deleteCircuit(user.uid, circuitToDelete);
                    setMyCircuits(prev => prev.filter(c => c.id !== circuitToDelete));
                  }
                  setCircuitToDelete(null);
                }}
                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
