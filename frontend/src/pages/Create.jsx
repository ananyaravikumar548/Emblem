import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { Generating } from './Generating';
import { ArrowRight, ArrowUpLeft, Check, Sparkles } from 'lucide-react';

export const Create = ({ onComplete }) => {
  const { createBrand } = useBrand();
  const [step, setStep] = useState(1);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [generationError, setGenerationError] = useState('');
  const totalSteps = 6;
  const stepLabels = ['Vision', 'Name', 'Personality', 'Industry', 'Audience', 'Review'];

  const [formData, setFormData] = useState({
    vision: '',
    company_name: '',
    industry: '',
    targetAudience: '',
    personality: [],
    colors: {
      primary: '#1D2B3A',
      secondary: '#405267',
      accent: '#95A8BD',
      background: '#DDE6F0'
    }
  });

  const handleNext = async (e) => {
    if (e) e.preventDefault();

    const requiredByStep = {
      1: ['vision', 'Add a short description of what your company does.'],
      2: ['company_name', 'Enter a name for this brand.'],
      4: ['industry', 'Add the industry or market this brand serves.'],
      5: ['targetAudience', 'Describe the people this brand is for.']
    };
    const required = requiredByStep[step];
    if (required && !formData[required[0]].trim()) {
      setValidationMessage(required[1]);
      return;
    }
    setValidationMessage('');

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setGenerationError('');
      setShowLoadingScreen(true);

      try {
        // Await brand creation completion
        await createBrand(formData);

        setShowLoadingScreen(false);
        setIsSubmitting(false);

        // Explicitly trigger parent state change to navigate away
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        console.error("Failed to generate brand:", error);
        setGenerationError(error.message || 'Brand generation failed. Please try again.');
        setShowLoadingScreen(false);
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setValidationMessage('');
      setStep(step - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext(e);
    }
  };

  if (showLoadingScreen) {
    return <Generating />;
  }

  return (
    <div className="studio-wizard relative flex min-h-[calc(100vh-68px)] flex-col overflow-hidden bg-[#faf7f4] text-[#302729] font-sans selection:bg-[#ead0d5]">
      <main className="studio-wizard-main relative z-10 flex flex-1 items-center justify-center px-5 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto w-full max-w-[860px] space-y-6">
          <section className="rounded-[26px] bg-[#572132] p-5 text-white shadow-[0_24px_56px_-38px_rgba(54,22,34,.58)] sm:rounded-[28px] sm:p-6" aria-label="Brand creation progress">
            <div className="grid gap-5 sm:grid-cols-[.9fr_1.1fr] sm:items-center sm:gap-7">
              <div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10"><Sparkles size={15}/></span>
                <p className="mt-3 text-[8px] font-bold uppercase tracking-[.2em] text-white/55">Your brand starts here</p>
                <h2 className="mt-1.5 text-lg font-semibold leading-tight tracking-[-.04em] sm:text-xl">A little clarity goes a long way.</h2>
                <p className="mt-1.5 max-w-sm text-[11px] leading-[1.55] text-white/70">Share what you know. EMBLEM will shape the pieces into an identity that feels like yours.</p>
              </div>
              <div>
                <div className="mb-2.5 flex items-center justify-between text-[8px] font-bold uppercase tracking-[.15em] text-white/60"><span>Brand progress</span><span>{String(step).padStart(2,'0')} / {String(totalSteps).padStart(2,'0')} <span className="ml-1 text-white/45">· {Math.round(step / totalSteps * 100)}%</span></span></div>
                <div className="mb-3 flex gap-1.5" aria-hidden="true">{Array.from({ length: totalSteps }, (_, index) => <span key={index} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${index < step ? 'bg-[#e8b9c4]' : 'bg-white/20'}`} />)}</div>
                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                  {stepLabels.map((label,index)=><div key={label} className={`flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-center text-[8px] font-semibold sm:text-[9px] ${step===index+1?'bg-white/15 text-white':'text-white/50'}`}><span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[7px] ${step>index+1?'bg-[#e8b9c4] text-[#572132]':step===index+1?'border border-white/70 text-white':'border border-white/25 text-white/60'}`}>{step>index+1?<Check size={10}/>:String(index+1).padStart(2,'0')}</span>{label}</div>)}
                </div>
              </div>
            </div>
          </section>
          <div className="flex min-h-[400px] flex-col rounded-[26px] border border-[#eadfd9] bg-[#fffdfb]/95 p-5 shadow-[0_26px_70px_-48px_rgba(82,39,52,.32)] sm:min-h-[420px] sm:rounded-[30px] sm:p-7 lg:min-h-[440px] lg:p-8">

          <div className="flex-1 space-y-6">
          {generationError && (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <p className="font-bold">Brand generation failed</p>
              <p className="mt-1 leading-relaxed">{generationError}</p>
              <p className="mt-2 text-xs text-rose-700">Your answers are saved. Update the connection and try again.</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-.055em] text-[#302729] sm:text-[2.7rem]">
                  Let's start with your vision.
                </h1>
                <p className="text-[#85787a] text-sm leading-7 max-w-lg sm:text-[15px]">
                  Describe your company, product, or project in a few sentences. What problem do you solve?
                </p>
              </div>

              <div className="relative rounded-2xl border border-[#e9ddda] bg-white p-6 shadow-[0_12px_35px_-26px_rgba(48,39,41,.25)] transition-colors focus-within:border-[#bd8995] focus-within:ring-4 focus-within:ring-[#8f4859]/[.07] sm:p-7">
                <textarea
                  rows={4}
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. We build brutalist AI design tools for creative agencies..."
                  className="w-full resize-none bg-transparent text-[15px] leading-7 text-[#302729] placeholder:text-[#b3a7a5] focus:outline-none sm:text-base"
                  autoFocus
                />
                <span className="absolute bottom-4 right-6 text-[9px] font-semibold uppercase tracking-[.12em] text-[#b3a7a5]">
                  Press Enter ↵
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-.055em] text-[#302729] sm:text-[2.7rem]">
                  What is your brand name?
                </h1>
                <p className="max-w-lg text-sm leading-7 text-[#85787a] sm:text-[15px]">
                  Enter the official name or working title for this brand identity suite.
                </p>
              </div>

              <div className="relative rounded-2xl border border-[#e9ddda] bg-white p-6 shadow-[0_12px_35px_-26px_rgba(48,39,41,.25)] transition-colors focus-within:border-[#bd8995] focus-within:ring-4 focus-within:ring-[#8f4859]/[.07] sm:p-7">
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Fieldnote Studio"
                  className="w-full bg-transparent text-xl font-semibold tracking-[-.03em] text-[#302729] placeholder:text-[#b3a7a5] focus:outline-none sm:text-2xl"
                  autoFocus
                />
                <span className="absolute bottom-6 right-6 text-[9px] font-semibold uppercase tracking-[.12em] text-[#b3a7a5]">
                  Press Enter ↵
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-.055em] text-[#302729] sm:text-[2.7rem]">
                  Select brand personality.
                </h1>
                <p className="max-w-lg text-sm leading-7 text-[#85787a] sm:text-[15px]">
                  Choose up to 3 traits that define your brand tone and visual aesthetic.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
                {['Brutalist', 'Minimal', 'Technical', 'Luxury', 'Avant-Garde', 'Playful'].map((trait) => {
                  const selected = formData.personality.includes(trait);
                  return (
                    <button
                      key={trait}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        const updated = selected
                          ? formData.personality.filter(p => p !== trait)
                          : [...formData.personality, trait].slice(0, 3);
                        setFormData({ ...formData, personality: updated });
                      }}
                      className={`min-h-[78px] rounded-2xl border p-4 text-left text-xs font-bold tracking-[.04em] transition-all ${selected
                        ? 'border-[#bd8995] bg-[#f6e9e9] text-[#6b2438] shadow-[0_10px_24px_-20px_rgba(107,36,56,.8)] ring-2 ring-[#8f4859]/10'
                        : 'border-[#e9ddda] bg-white text-[#75696b] hover:border-[#d9bfc6] hover:bg-[#fffaf8]'
                        }`}
                    >
                      <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-[#f7f0ed] text-[10px] text-[#8f4859]">{selected ? <Check size={14}/> : '✳'}</span>{trait}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-.055em] text-[#302729] sm:text-[2.7rem]">
                  Define your market sector.
                </h1>
                <p className="max-w-lg text-sm leading-7 text-[#85787a] sm:text-[15px]">
                  Select the core industry vertical for tailored visual assets.
                </p>
              </div>

              <div className="relative rounded-2xl border border-[#e9ddda] bg-white p-6 shadow-[0_12px_35px_-26px_rgba(48,39,41,.25)] transition-colors focus-within:border-[#bd8995] focus-within:ring-4 focus-within:ring-[#8f4859]/[.07] sm:p-7">
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Generative AI, Architecture, Fintech"
                  className="w-full bg-transparent text-[15px] leading-7 text-[#302729] placeholder:text-[#b3a7a5] focus:outline-none sm:text-base"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-.055em] text-[#302729] sm:text-[2.7rem]">
                  Who is this brand for?
                </h1>
                <p className="max-w-lg text-sm leading-7 text-[#85787a] sm:text-[15px]">
                  Name the people or organizations you want to reach. This gives the strategy a clear audience to speak to.
                </p>
              </div>
              <div className="relative rounded-2xl border border-[#e9ddda] bg-white p-6 shadow-[0_12px_35px_-26px_rgba(48,39,41,.25)] transition-colors focus-within:border-[#bd8995] focus-within:ring-4 focus-within:ring-[#8f4859]/[.07] sm:p-7">
                <textarea
                  rows={3}
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Independent designers and small creative teams"
                  className="w-full resize-none bg-transparent text-[15px] leading-7 text-[#302729] placeholder:text-[#b3a7a5] focus:outline-none sm:text-base"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-.055em] text-[#302729] sm:text-[2.7rem]">
                  Your first identity, ready.
                </h1>
                <p className="max-w-lg text-sm leading-7 text-[#85787a] sm:text-[15px]">
                  Here’s the foundation. You can refine everything after it’s created.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#a08f91]">Company</span>
                  <p className="mt-2 rounded-xl border border-[#eee4df] bg-white p-4 text-sm font-bold text-[#49383c]">{formData.company_name || 'Untitled Studio'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#a08f91]">Vision</span>
                  <p className="mt-2 min-h-[52px] rounded-xl border border-[#eee4df] bg-white p-4 text-xs leading-5 text-[#75696b] line-clamp-2">{formData.vision || 'No description provided.'}</p>
                </div>
                <div className="rounded-xl border border-[#eee4df] bg-white p-4">
                  <span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#a08f91]">Personality</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(formData.personality.length ? formData.personality : ['Minimal']).map((p, i) => (
                      <span key={i} className="rounded-full bg-[#f5e9eb] px-2.5 py-1.5 text-[10px] font-bold text-[#6b2438]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-[#eee4df] bg-white p-4">
                  <span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#a08f91]">Industry</span>
                  <p className="mt-2 text-xs text-[#49383c]">{formData.industry}</p>
                </div>
                <div className="rounded-xl border border-[#eee4df] bg-white p-4">
                  <span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#a08f91]">Audience</span>
                  <p className="mt-2 text-xs text-[#49383c]">{formData.targetAudience}</p>
                </div>
              </div>
            </div>
          )}

          </div>
          <footer className="flex items-center justify-between gap-3 px-1 pt-1">
        <div aria-live="polite" className="min-w-0 flex-1 text-xs font-medium text-[#9e3d58]">{validationMessage}</div>
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-3 text-xs font-semibold transition-colors ${step === 1 ? 'cursor-not-allowed text-[#c8babb]' : 'text-[#75696b] hover:bg-white hover:text-[#6b2438]'
            }`}
        >
          <ArrowUpLeft size={14}/><span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#6b2438] px-5 py-3.5 text-xs font-semibold text-white shadow-[0_12px_26px_-16px_rgba(107,36,56,.75)] transition hover:-translate-y-0.5 hover:bg-[#531a2c] disabled:opacity-50 sm:px-6"
        >
          <span>{isSubmitting ? 'Creating…' : step === totalSteps ? generationError ? 'Try again' : 'Create identity' : 'Continue'}</span>{step < totalSteps && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5"/>}
        </button>
      </footer>
          </div>
        </div>
      </main>

    </div>
  );
};
