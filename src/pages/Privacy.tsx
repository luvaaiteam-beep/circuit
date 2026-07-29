import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export const Privacy = () => {
  return (
    <div className="min-h-screen relative bg-[#09090b] selection:bg-cyan-500/30 overflow-y-auto flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        <ParticlesBackground />
      </div>
      <Navigation />
      <Helmet>
        <title>Privacy Policy | CircuitForge</title>
        <meta name="description" content="Privacy Policy for CircuitForge, explaining how we handle your data." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://luvaai.in/privacy" />
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
      {/* CONTENT */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto px-6 py-16 text-zinc-300 flex-1 w-full"
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
            <p className="mb-3">
              CircuitForge uses standard browser local storage and essential cookies to maintain your session, store local draft circuits, and remember your interface preferences (e.g., active tools, minimap state).
            </p>
            <p className="mb-3">
              We use Google Analytics to understand how users interact with our platform. Google Analytics collects anonymous usage data via cookies to report on website trends. Additionally, Google AdSense (when active) uses cookies to serve personalized or non-personalized ads based on your visits to our site and other sites on the Internet.
            </p>
            <p>
              You can manage your ad preferences and opt-out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google's Ad Settings</a>. You may also use the cookie consent banner on our site to opt-out of non-essential analytics cookies.
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
      <Footer />
    </div>
  );
};
