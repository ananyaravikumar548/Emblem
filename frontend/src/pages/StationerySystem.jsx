import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { getMarkSvgPath } from '../lib/vectorEngine';

export const StationerySystem = () => {
  const { brand } = useBrand();
  const [signatureCopied, setSignatureCopied] = useState(false);

  const companyName = brand?.companyName || brand?.company_name || 'NOVA';
  const tagline = brand?.tagline || 'Sustainable energy architecture for the next era.';
  
  // Color Tokens
  const colors = brand?.colors || {};
  const primaryColor = colors.primary || '#0F172A';
  const surfaceColor = colors.surface || colors.background || '#F8FAFC';
  const accentColor = colors.accent || '#738F80';

  // Typography Tokens
  const typography = brand?.typography || {};
  const headingFont = typography.display?.family || typography.heading_font || 'Syne, sans-serif';
  const bodyFont = typography.body?.family || typography.body_font || 'Inter, sans-serif';
  const logoStyleToken = brand?.logoStyleToken || 'tech';

  const markPath = getMarkSvgPath(logoStyleToken, companyName);

  const cleanSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const copyEmailSignature = () => {
    const signatureHtml = `
      <table style="font-family: sans-serif; font-size: 13px; color: #111111;">
        <tr>
          <td style="padding-right: 14px; border-right: 2px solid ${accentColor}; vertical-align: top;">
            <strong style="font-size: 14px; color: ${primaryColor};">${companyName}</strong><br>
            <span style="font-size: 11px; color: #666666;">Identity Systems</span>
          </td>
          <td style="padding-left: 14px; vertical-align: top;">
            <strong>Alex Vance</strong> | Creative Director<br>
            <span style="color: #666666;">contact@${cleanSlug}.com</span> • <span style="color: #666666;">+1 (555) 249-8012</span><br>
            <a href="https://www.${cleanSlug}.com" style="color: ${accentColor}; text-decoration: none;">www.${cleanSlug}.com</a>
          </td>
        </tr>
      </table>
    `.trim();

    navigator.clipboard.writeText(signatureHtml);
    setSignatureCopied(true);
    setTimeout(() => setSignatureCopied(false), 2500);
  };

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-6 select-none">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end border-b border-neutral-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 mb-1">
            <span>STATIONERY & COLLATERAL</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-black" style={{ fontFamily: headingFont }}>
            Stationery & Print System
          </h1>
          <p className="text-neutral-500 text-sm max-w-2xl leading-relaxed" style={{ fontFamily: bodyFont }}>
            Production-grade collateral templates parameterized from <strong className="text-black">{companyName}</strong>'s Brand DNA.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold">
            Print Ready 300 DPI
          </span>
        </div>
      </div>

      {/* Collateral Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* 01. BUSINESS CARDS (3.5" x 2.0") */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-6 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                01. DUAL-SIDED BUSINESS CARDS
              </span>
              <p className="text-xs text-neutral-500">Standard 3.5in × 2.0in (400gsm Cotton Stock)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-[10px] font-mono font-semibold text-neutral-600">
              Front & Back
            </span>
          </div>

          {/* Isometric Card Layout */}
          <div className="relative flex items-center justify-center my-auto w-full h-56">
            {/* Back Card (Brand Anchor) */}
            <div
              className="absolute w-64 h-36 rounded-xl p-5 shadow-2xl -rotate-6 transform -translate-x-14 translate-y-3 border border-black/10 flex flex-col justify-between"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex justify-between items-start">
                <div style={{ color: surfaceColor }}>
                  <svg width="28" height="28" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: markPath }} />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">BACK</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-wider text-white block" style={{ fontFamily: headingFont }}>
                  {companyName}
                </span>
                <span className="text-[8px] font-mono tracking-widest text-white/70 uppercase mt-0.5 block truncate">
                  {tagline}
                </span>
              </div>
            </div>

            {/* Front Card (Personal Details) */}
            <div
              className="absolute w-64 h-36 rounded-xl p-5 shadow-2xl rotate-3 transform translate-x-12 -translate-y-2 border border-neutral-200 flex flex-col justify-between"
              style={{ backgroundColor: surfaceColor }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-black" style={{ fontFamily: headingFont }}>Alex Vance</h4>
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Founding Partner & CEO</p>
                </div>
                <div style={{ color: primaryColor }}>
                  <svg width="20" height="20" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: markPath }} />
                </div>
              </div>

              <div className="text-[9px] font-mono text-neutral-600 space-y-0.5 border-t border-neutral-200/60 pt-2">
                <p>contact@{cleanSlug}.com</p>
                <p>+1 (555) 249-8012</p>
                <p className="text-black font-semibold">www.{cleanSlug}.com</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex justify-between text-[10px] font-mono text-neutral-400">
            <span>Safety Bleed: 0.125in</span>
            <span>Substrate: Uncoated Fine Paper</span>
          </div>
        </div>

        {/* 02. DIGITAL EMAIL SIGNATURE */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-6 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                02. DIGITAL SIGNATURE
              </span>
              <p className="text-xs text-neutral-500">HTML Client-Ready</p>
            </div>
            <button
              onClick={copyEmailSignature}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-black hover:text-white transition-colors text-xs font-mono font-bold"
            >
              {signatureCopied ? 'Copied HTML! ✓' : 'Copy HTML'}
            </button>
          </div>

          <div className="bg-[#F8F9FA] rounded-xl p-5 border border-neutral-200/70 my-auto flex items-center justify-center">
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex items-start space-x-4 w-full max-w-sm">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none" style={{ color: surfaceColor }} dangerouslySetInnerHTML={{ __html: markPath }} />
              </div>

              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-black" style={{ fontFamily: headingFont }}>Alex Vance</h4>
                <p className="text-[11px] text-neutral-500">Founding Partner & CEO</p>
                <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 space-y-0.5">
                  <p>contact@{cleanSlug}.com</p>
                  <p>+1 (555) 249-8012</p>
                  <p className="font-bold" style={{ color: accentColor }}>www.{cleanSlug}.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
            Compatible with Gmail, Outlook, Apple Mail
          </div>
        </div>

        {/* 03. FORMAL LETTERHEAD (A4) */}
        <div className="col-span-12 lg:col-span-6 bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-6 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                03. CORPORATE LETTERHEAD
              </span>
              <p className="text-xs text-neutral-500">DIN A4 (210 × 297 mm)</p>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Grid: 12-Col Modular</span>
          </div>

          <div className="bg-[#F6F6F6] rounded-xl p-6 flex items-center justify-center my-auto">
            <div className="w-full max-w-xs bg-white rounded-lg shadow-md border border-neutral-200 p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div style={{ color: primaryColor }}>
                    <svg width="20" height="20" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: markPath }} />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-black uppercase" style={{ fontFamily: headingFont }}>
                    {companyName}
                  </span>
                </div>
                <div className="text-[7px] text-neutral-400 text-right font-mono">
                  <p>100 Montgomery St.</p>
                  <p>San Francisco, CA</p>
                </div>
              </div>

              {/* Watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none" style={{ color: primaryColor }}>
                <svg width="180" height="180" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: markPath }} />
              </div>

              {/* Mock paragraph lines */}
              <div className="space-y-2 my-4">
                <div className="w-24 h-1.5 bg-neutral-300 rounded"></div>
                <div className="w-full h-1 bg-neutral-100 rounded"></div>
                <div className="w-11/12 h-1 bg-neutral-100 rounded"></div>
                <div className="w-4/5 h-1 bg-neutral-100 rounded"></div>
                <div className="w-full h-1 bg-neutral-100 rounded"></div>
              </div>

              {/* Footer bar */}
              <div className="border-t-2 pt-2 flex justify-between items-center text-[7px] font-mono text-neutral-400" style={{ borderColor: accentColor }}>
                <span>CONFIDENTIAL</span>
                <span>PAGE 01 / 01</span>
              </div>
            </div>
          </div>
        </div>

        {/* 04. #10 COMMERCIAL ENVELOPE */}
        <div className="col-span-12 lg:col-span-6 bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-6 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                04. COMMERCIAL ENVELOPE
              </span>
              <p className="text-xs text-neutral-500">Standard #10 (9.5in × 4.125in)</p>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Postal Compliant</span>
          </div>

          <div className="bg-[#F6F6F6] rounded-xl p-6 flex items-center justify-center my-auto">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-md border border-neutral-200 p-5 flex flex-col justify-between min-h-[170px] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <div style={{ color: primaryColor }}>
                      <svg width="16" height="16" viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: markPath }} />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-black uppercase" style={{ fontFamily: headingFont }}>
                      {companyName}
                    </span>
                  </div>
                  <div className="text-[8px] text-neutral-400 font-mono leading-tight">
                    <p>100 MONTGOMERY ST. SUITE 2400</p>
                    <p>SAN FRANCISCO, CA 94104</p>
                  </div>
                </div>

                <div className="w-9 h-11 border border-dashed border-neutral-300 flex items-center justify-center text-[7px] text-neutral-400 uppercase font-mono">
                  POSTAGE
                </div>
              </div>

              <div className="self-center my-3 text-[10px] font-mono text-neutral-300">
                [ADDRESSEE WINDOW BOUNDARY]
              </div>

              <div className="w-full border-b-2 absolute bottom-0 left-0" style={{ borderColor: accentColor }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StationerySystem;
