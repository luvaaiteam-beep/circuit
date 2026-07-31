import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cf_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    } else if (consent === 'essential') {
      // Block GA
      window['ga-disable-G-Z94X17ZD4K'] = true; // Replace with actual measurement ID if needed, or generally disable GA
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cf_cookie_consent', 'all');
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', 'G-Z94X17ZD4K');
    }
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('cf_cookie_consent', 'essential');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 flex justify-center pointer-events-none"
        >
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
            <div className="flex-1 text-sm text-zinc-300">
              <p className="mb-2">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies.
              </p>
              <p className="text-xs text-zinc-500">
                Read our <Link to="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link> for more information.
              </p>
            </div>
            <div className="flex gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={handleEssentialOnly}
                className="flex-1 md:flex-none px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
