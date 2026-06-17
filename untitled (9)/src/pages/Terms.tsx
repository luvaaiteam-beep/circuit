import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const Terms = () => {
  return (
    <div className="min-h-screen relative bg-[#09090b] selection:bg-cyan-500/30 overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Helmet>
        <title>Terms of Service | CircuitForge</title>
        <meta name="description" content="Terms of Service for using CircuitForge." />
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
                "name": "Terms of Service",
                "item": "https://luvaai.in/terms"
              }
            ]
          })}
        </script>
      </Helmet>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="text-cyan-400" size={24} />
            <div className="font-mono text-xl text-zinc-100 tracking-tight font-bold">
              Circuit<span className="text-cyan-400">Forge</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/sim" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Simulator
            </Link>
            <Link to="/gallery" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Gallery
            </Link>
          </div>
        </div>
      </motion.header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto px-6 py-16 text-zinc-300"
      >
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-sm text-zinc-500 mb-8">Last Updated: June 17, 2026</p>
        
        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using the CircuitForge web application ("Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions outlined in this agreement, you must immediately cease use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>
              CircuitForge provides users with an interactive, web-based 3D electronic circuit simulation environment, incorporating AI-assisted design, community sharing, and schematic visualization. The Service operates in a beta capacity, and features may be modified, suspended, or discontinued at our discretion without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct & Responsibilities</h2>
            <p className="mb-3">By using the Service, you agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful or unauthorized purpose.</li>
              <li>Upload, share, or transmit any circuits, logic designs, or content that violates intellectual property rights or contains malicious payloads.</li>
              <li>Attempt to reverse-engineer, decompile, or otherwise extract the source code of the Simulation Engine or AI integrations.</li>
              <li>Transmit any worms, viruses, or code of a destructive nature.</li>
              <li>Use the platform to distribute spam or unauthorized promotions.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to terminate or suspend access to your account immediately, without prior notice or liability, for any breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property Rights</h2>
            <p className="mb-3">
              <strong>Your Content:</strong> You retain ownership of any electronic circuits or projects you create using CircuitForge. By sharing a circuit publicly, you grant us a non-exclusive, worldwide, royalty-free license to display, reproduce, and distribute your circuit through the Service.
            </p>
            <p>
              <strong>Our Property:</strong> The CircuitForge platform, including but not limited to its visual design, simulation engine code, original 3D models, graphics, and underlying architecture, remains the exclusive intellectual property of CircuitForge and its licensors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties (Educational Use Only)</h2>
            <p className="mb-3">
              <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE."</strong> We explicitly disclaim all warranties of any kind, whether express or implied.
            </p>
            <p className="text-amber-200/80 p-4 bg-amber-500/10 rounded border border-amber-500/20">
              <strong>CRITICAL WARNING:</strong> CircuitForge is an educational simulation tool. The simulated physics, nodal analyses, voltages, and currents are approximations intended for conceptual learning. <strong>NEVER</strong> rely on CircuitForge simulations to design real-world life-critical systems, high-voltage power applications, medical devices, or safety-critical infrastructure. Always verify hardware designs with certified tools and physical testing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p>
              In no event shall CircuitForge, its creators, directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages—including without limitation loss of profits, data, hardware damage, or personal injury—resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; or (iii) unauthorized access, use, or alteration of your transmissions or content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with international standard tech compliances without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
            <p>
              For any questions regarding these Terms, please reach out to us at: <a href="mailto:luvaai.team@gmail.com" className="text-cyan-400 hover:underline">luvaai.team@gmail.com</a>.
            </p>
          </section>
        </div>
      </motion.main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t border-zinc-800 py-12 px-6 mt-12 bg-zinc-950"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-600 text-sm">
            Built with React + Three.js + Gemini AI
          </div>
          <div className="text-zinc-600 text-sm">
            © 2026 luvaai.in — Free forever.
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
