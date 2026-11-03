import React, { useState, useEffect } from 'react';
import { Check, Circle, Sparkles } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const STEPS = [
  'Finding the brand’s point of view',
  'Shaping the color and type system',
  'Drawing the logo family',
  'Applying the identity to real touchpoints',
  'Preparing your brand guide'
];

export const Generating = ({ onComplete }) => {
  const { brand, isGenerating } = useBrand();
  const companyName = brand?.companyName || brand?.company_name || 'your brand';
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((previous) => Math.min(previous + 1, STEPS.length - 1));
    }, 1100);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    if (!isGenerating && currentStep >= 2) {
      const finishTimer = setTimeout(() => onComplete?.(), 700);
      return () => clearTimeout(finishTimer);
    }
  }, [isGenerating, currentStep, onComplete]);

  return (
    <div className="studio-generating fixed inset-0 z-50 flex min-h-screen flex-col overflow-y-auto bg-[#faf7f4] text-[#302729]">
      <div className="studio-generating-grain pointer-events-none absolute inset-0" />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 rotate-45 items-center justify-center rounded-[9px] bg-[#6b2438]"><span className="h-2 w-2 rounded-sm bg-white" /></span>
          <span className="text-xs font-extrabold tracking-[.14em] text-[#49383c]">EMBLEM</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a08f91]">Your identity is taking shape</span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-8 sm:px-8 sm:py-12">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadfd9] bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-[#8f6570]">
              <Sparkles size={13} /> A little design magic, in progress
            </div>
            <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl">Making <span className="studio-serif font-normal italic text-[#8f4859]">{companyName}</span> unmistakable.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#75696b] sm:text-base">We’re turning your answers into a thoughtful identity system. You can refine the details once it’s ready.</p>
            <div className="mt-8 space-y-1.5" aria-label="Generation stages" aria-live="polite">
              {STEPS.map((step, index) => {
                const isCurrent = index === currentStep;
                const isUpcoming = index > currentStep;
                return (
                  <div key={step} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-500 ${isCurrent ? 'bg-white/85 text-[#49383c] shadow-[0_8px_24px_-20px_rgba(48,39,41,.35)]' : isUpcoming ? 'text-[#a08f91]' : 'text-[#75696b]'}`}>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isCurrent ? 'bg-[#f2e5e7] text-[#8f4859]' : 'text-[#9b898b]'}`}>
                      {isCurrent ? <span className="h-2 w-2 animate-pulse rounded-full bg-[#9e3d58]" /> : isUpcoming ? <Circle size={14} strokeWidth={1.5} /> : <Check size={14} strokeWidth={2} />}
                    </span>
                    <span className={`text-xs sm:text-sm ${isCurrent ? 'font-semibold' : 'font-medium'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 text-[11px] text-[#a08f91]">This can take a few moments. Keep this window open.</p>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="studio-generating-aura absolute inset-[12%] rounded-full" />
            <div className="relative rounded-[30px] border border-white/90 bg-[#f3eae5] p-3 shadow-[0_34px_90px_-56px_rgba(82,39,52,.45)] sm:rounded-[38px] sm:p-4">
              <div className="flex items-center justify-between px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[.16em] text-[#9b898b]"><span>Identity canvas</span><span>EMBLEM / 01</span></div>
              <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#6b2438] p-7 text-white sm:min-h-[390px] sm:rounded-[30px] sm:p-10">
                <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/10" />
                <div className="absolute -right-1 -top-4 h-44 w-44 rounded-full border border-white/10" />
                <div className="relative flex items-center justify-between"><span className="text-[9px] uppercase tracking-[.2em] text-white/60">A first impression</span><span className="studio-generating-mark flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-lg">✳</span></div>
                <div className="relative"><div className="mb-5 h-1 w-16 rounded-full bg-[#e9b9c5]/80" /><h2 className="max-w-sm text-4xl font-semibold leading-[.95] tracking-[-.06em] sm:text-6xl">Ideas into identity.</h2><p className="mt-5 max-w-xs text-xs leading-6 text-white/70 sm:text-sm">Strategy, visual language, and the details that make it yours.</p></div>
                <div className="relative flex items-end justify-between border-t border-white/20 pt-4"><div className="flex gap-1.5">{['#9e3d58', '#c77b8f', '#ead1d1', '#f7eee8'].map((color) => <span key={color} className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: color }} />)}</div><span className="studio-serif text-3xl italic text-white/65">Aa</span></div>
              </div>
              <div className="flex items-center justify-between px-3 pt-3 text-[9px] text-[#9b898b]"><span>Strategy · Voice · Visual system</span><span>Building…</span></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="h-px w-full overflow-hidden bg-[#eadfd9]"><span className="studio-loading-line block h-full w-1/3 bg-[#9e3d58]" /></div>
      </footer>
    </div>
  );
};

export default Generating;
