import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const Privacy = () => {
  return (
    <div className="min-h-screen relative bg-[#09090b] selection:bg-cyan-500/30 overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Helmet>
        <title>Privacy Policy | CircuitForge</title>
        <meta name="description" content="Privacy Policy for CircuitForge, explaining how we handle your data." />
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
                "name": "Privacy Policy",
                "item": "https://luvaai.in/privacy"
              }
            ]
          })}
        </script>
      </Helmet>
      {/* HEADER */}
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

      {/* CONTENT */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto px-6 py-16 text-zinc-300"
      >
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">Last Updated: June 17, 2026</p>
        
        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-3">
              We collect information that you provide directly to us when using CircuitForge:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li><strong>Account Information:</strong> When you sign in via Google OAuth, we collect your name, email address, and profile picture to create and manage your account.</li>
              <li><strong>User-Generated Content:</strong> Electronic circuits, projects, layout configurations, and any text or notes you submit, save, or share within the application.</li>
              <li><strong>Usage Data:</strong> We may collect anonymous analytics regarding how you interact with the platform (e.g., features used, errors encountered) to improve the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-3">We use the collected information for various core operational purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>To provide, maintain, and improve the CircuitForge platform and simulation engine.</li>
              <li>To authenticate users and secure account data against unauthorized access.</li>
              <li>To store, organize, and retrieve your electronic circuit projects.</li>
              <li>To facilitate sharing of circuits via public links, if you choose to make them public.</li>
              <li>To communicate with you regarding updates, security alerts, and support messages.</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Storage and Security</h2>
            <p className="mb-3">
              We utilize third-party cloud infrastructure (Google Firebase) to securely store and process your data. All data transit is encrypted using strictly enforced TLS (Transport Layer Security).
            </p>
            <p>
              While we implement commercially reasonable safeguards to protect your personal information, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your Google account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies and Local Storage</h2>
            <p>
              CircuitForge uses standard browser local storage and essential cookies to maintain your session, store local draft circuits, and remember your interface preferences (e.g., active tools, minimap state). We do not use third-party tracking cookies for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. User Rights (GDPR & CCPA)</h2>
            <p className="mb-3">
              Depending on your jurisdiction, you may have rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li><strong>Right to Access:</strong> You can view your stored circuit data within your dashboard.</li>
              <li><strong>Right to Deletion:</strong> You may request the deletion of your account and associated data by contacting us.</li>
              <li><strong>Right to Opt-Out:</strong> We do not sell data, so there is no need to opt-out of data sales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Continued use of the platform constitutes your acknowledgment of the changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at: <a href="mailto:luvaai.team@gmail.com" className="text-cyan-400 hover:underline">luvaai.team@gmail.com</a>.
            </p>
          </section>
        </div>
      </motion.main>

      {/* FOOTER */}
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
