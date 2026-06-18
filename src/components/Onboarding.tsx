import React, { useState, useEffect } from 'react';
import { MousePointer2, GitCommitHorizontal, Play, Save, Check } from 'lucide-react';

export const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('cf_onboarded');
    if (!hasOnboarded) {
      setIsVisible(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('cf_onboarded', 'true');
    setIsVisible(false);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  if (!isVisible) return null;

  const steps = [
    {
      title: "Welcome to CircuitForge!",
      text: "Let's take a quick tour to help you get started building and simulating electronic circuits.",
      icon: <Check className="text-cyan-400" size={32} />
    },
    {
      title: "Add Components",
      text: "Use the left panel to browse components. Click a component like a Battery or LED to switch to 'Place Mode', then click anywhere on the grid to drop it.",
      icon: <MousePointer2 className="text-cyan-400" size={32} />
    },
    {
      title: "Wire Them Together",
      text: "Press 'W' or select the Wire tool. Click on one component's pin (the endpoints), then click another component's pin to create a connection.",
      icon: <GitCommitHorizontal className="text-cyan-400" size={32} />
    },
    {
      title: "Run Simulation",
      text: "Once your circuit is wired, click 'RUN' in the top bar. You'll see LEDs light up, motors spin, and real-time voltage/current stats in the right panel.",
      icon: <Play className="text-emerald-400" size={32} />
    },
    {
      title: "Save & Share",
      text: "Use the top bar buttons to save your circuit locally, or log in to generate a shareable link and embed widget to show off your creations!",
      icon: <Save className="text-cyan-400" size={32} />
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 touch-none">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl shadow-cyan-900/20 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-2">
            {steps[step].icon}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{steps[step].title}</h2>
          <p className="text-zinc-400 leading-relaxed min-h-[4rem]">
            {steps[step].text}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-cyan-400 w-4' : 'bg-zinc-800'}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-between items-center">
          <button 
            onClick={completeOnboarding}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-300 tracking-wider uppercase px-4 py-2"
          >
            Skip Tour
          </button>
          
          <button 
            onClick={nextStep}
            className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold tracking-wider rounded-lg transition-colors flex items-center gap-2"
          >
            {step === steps.length - 1 ? 'GET STARTED' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
};
