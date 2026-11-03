import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';

export const ExportPanel = () => {
  const { brand } = useBrand();
  const [copied, setCopied] = useState(false);

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brand, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${brand.company_name.toLowerCase().replace(/\s+/g, '-')}-tokens.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyCSSVariables = () => {
    const cssVars = `:root {\n` +
      Object.entries(brand.colors).map(([key, hex]) => `  --color-${key}: ${hex};`).join('\n') +
      `\n}`;
    navigator.clipboard.writeText(cssVars);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h3 className="font-bold text-lg">Export Brand Kit</h3>
          <p className="text-xs text-neutral-400 mt-1">Download tokens or copy code directly into your codebase.</p>
        </div>
        <button
          onClick={downloadJSON}
          className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors"
        >
          Download JSON Tokens
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-neutral-400 uppercase">CSS Custom Properties</span>
          <button
            onClick={copyCSSVariables}
            className="text-xs text-emerald-400 hover:underline font-mono"
          >
            {copied ? 'Copied to Clipboard!' : 'Copy CSS'}
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-emerald-300 font-mono overflow-x-auto">
{`:root {
` + Object.entries(brand.colors).map(([key, hex]) => `  --color-${key}: ${hex};`).join('\n') + `
}`}
        </pre>
      </div>
    </div>
  );
};