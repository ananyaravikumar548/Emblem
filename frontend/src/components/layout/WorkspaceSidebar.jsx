import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const WorkspaceSidebar = ({ activeNav, onNavigate }) => {
  const { brand } = useBrand();
  const companyName = brand?.companyName || brand?.company_name || 'NOVA';
  const logoStyleToken = brand?.logoStyleToken || 'tech';
  const initials = companyName.slice(0, 2).toUpperCase();

  const workspaceNav = [
    { id: 'STUDIO', label: 'Brand Studio', icon: '◫' },
    { id: 'LOGO', label: 'Logo Suite', icon: '◇' },
    { id: 'DNA', label: 'Brand DNA', icon: '◎' },
    { id: 'ASSETS', label: 'Guidelines', icon: '↗' },
    { id: 'SOCIAL', label: 'Social Kits', icon: '◉' },
  ];

  return (
    <aside className="w-60 border-r border-neutral-200 bg-white p-4 flex flex-col shrink-0">
      <div className="px-3 pt-2 pb-4">
        <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Brand Workspace</p>
      </div>

      <div className="flex items-center space-x-3 px-3 py-3 bg-neutral-50 rounded-xl mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: brand?.colors?.primary || '#0F172A' }}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-xs truncate">{companyName}</p>
          <p className="text-[10px] text-neutral-500 font-mono truncate">{logoStyleToken}</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {workspaceNav.map(item => (
          <button key={item.id} type="button" onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeNav === item.id ? 'bg-black text-white' : 'text-neutral-500 hover:text-black hover:bg-neutral-100'}`}>
            <span className="text-sm">{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-neutral-200 space-y-1">
        <button type="button" className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all">
          <span className="text-sm">?</span><span>Support</span>
        </button>
        <button type="button" className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all">
          <span className="text-sm">↗</span><span>Export Identity</span>
        </button>
      </div>
    </aside>
  );
};
