import React, { useState, useRef, useEffect } from 'react';
import { useBrand } from '../../context/BrandContext';
import { ChevronDown, Plus } from 'lucide-react';

export const BrandSwitcher = ({ onNewBrand }) => {
  const { brand, userBrands, selectBrand } = useBrand();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentBrandName = brand?.companyName || brand?.company_name || 'NOVA';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex max-w-[190px] items-center gap-2 rounded-full border border-[#eadfd9] bg-white/75 px-3 py-2 transition-colors hover:bg-white"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#9e3d58]"></span>
        <span className="max-w-[130px] truncate text-xs font-semibold text-[#49383c]">
          {currentBrandName}
        </span>
        <ChevronDown size={14} className="shrink-0 text-[#a08f91]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-64 rounded-2xl border border-[#eadfd9] bg-[#fffdfb] py-2 text-xs shadow-[0_20px_60px_-32px_rgba(48,39,41,.3)]">
          <div className="border-b border-[#f1e9e5] px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a08f91]">
              Your brands · {userBrands.length}
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {userBrands.length === 0 ? (
                <div className="px-3 py-3 text-center text-neutral-400">
                Sample identity · {currentBrandName}
              </div>
            ) : (
              userBrands.map((b) => {
                const isSelected = (brand?.id === b._id) || (brand?._id === b._id);
                return (
                  <button
                    key={b._id}
                    type="button"
                    onClick={() => {
                      selectBrand(b._id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[#fbf6f3] ${
                      isSelected ? 'bg-[#f8f0ed] font-semibold text-[#6b2438]' : 'text-[#75696b]'
                    }`}
                  >
                    <span className="truncate">{b.companyName}</span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase">
                      {b.status || 'generated'}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-neutral-100 pt-1 px-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onNewBrand) onNewBrand();
              }}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left font-semibold text-[#6b2438] hover:bg-[#f8f0ed]"
            >
              <Plus size={14} />
              <span>New brand</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
