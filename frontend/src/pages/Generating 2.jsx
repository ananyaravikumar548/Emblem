import React, { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';

const STEPS = [
  'Synthesizing Brand Strategy & Rationale',
  'Calibrating WCAG 2.1 AA Color Harmonies',
  'Generating Deterministic Vector SVG Lockups',
  'Auditing Typographic Scale & Hierarchy',
  'Formulating Stationery & Social Touchpoints',
  'Compiling Production Brand Architecture'
];

export const Generating = ({ onComplete }) => {
  const { brand, isGenerating } = useBrand();
  const companyName = brand?.companyName || brand?.company_name || 'EMBLEM';

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(stepInterval);
  }, []);

  // When backend generation completes (or after minimum 3s showcase)
  useEffect(() => {
    if (!isGenerating && currentStep >= 3) {
      const finishTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);
      return () => clearTimeout(finishTimer);
    }
  }, [isGenerating, currentStep, onComplete]);

  const progressPercent = Math.min(
    100,
    Math.round(((currentStep + 1) / STEPS.length) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#0A0A0A] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Background Animated Glow Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#738F80] blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#71808B] blur-[120px] opacity-20 pointer-events-none" />

      {/* Header Section */}
      <header className="w-full pt-16 px-6 flex flex-col items-center justify-center z-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>DETERMINISTIC ARCHITECTURE ENGINE</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white uppercase">
          {companyName}
        </h1>
        <p className="text-neutral-400 text-xs font-mono tracking-widest mt-2 uppercase">
          Synthesizing Brand Identity System
        </p>
      </header>

      {/* Main Checklist Section */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6 z-10 my-4">
        <div className="w-full flex flex-col gap-4">
          {STEPS.map((stepLabel, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent ? 'bg-white/10 border border-white/20' : 'opacity-80'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-400 text-black text-xs font-bold flex items-center justify-center">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full border border-neutral-600" />
                  )}
                </div>
                <span
                  className={`text-sm md:text-base font-mono transition-colors duration-300 ${
                    isCompleted
                      ? 'text-white'
                      : isCurrent
                      ? 'text-white font-bold'
                      : 'text-neutral-500'
                  }`}
                >
                  {stepLabel}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full pb-12 px-6 md:px-12 z-10 flex flex-col items-center">
        <div className="w-full max-w-xl h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-neutral-400 mt-4 uppercase tracking-widest">
          {progressPercent}% COMPLETE • AUDITING BRAND COMPLIANCE
        </span>
      </footer>
    </div>
  );
};

export default Generating;