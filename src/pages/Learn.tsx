import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const Learn = () => {
  const blogs = [
    {
      title: "How to Make a Simple Circuit Online",
      description: "You don't need to buy anything. This guide shows you how to make a simple electric circuit and circuit diagram in your browser using CircuitForge.",
      path: "/learn/how-to-make-a-simple-circuit",
      category: "Beginners",
      date: "Jul 27, 2026"
    },
    {
      title: "Simple Electric Circuit School Project — Build & Simulate",
      description: "Working on a circuit project for school? This guide walks you through building, simulating, and presenting a simple electric circuit for your science fair.",
      path: "/learn/electric-circuit-school-project",
      category: "Students",
      date: "Jul 27, 2026"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Navigation />
      <Helmet>
        <title>Learn Electronics & Circuit Design | CircuitForge Blog</title>
        <meta name="description" content="Learn how to make simple circuits, read circuit diagrams, and build school science projects with CircuitForge's free online simulator." />
        <link rel="canonical" href="https://luvaai.in/learn" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-16 text-center">
          <BookOpen className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">CircuitForge Learning Hub</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Practical guides, tutorials, and project ideas to help you master circuit design and electronics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link 
                to={blog.path}
                className="block group h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-cyan-500/50 hover:bg-zinc-800/50 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-zinc-800 text-cyan-400 text-sm font-medium rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-zinc-500 text-sm">{blog.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-zinc-400 mb-8 line-clamp-3">
                  {blog.description}
                </p>
                <div className="flex items-center text-cyan-400 font-bold mt-auto group-hover:translate-x-2 transition-transform">
                  Read article <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
