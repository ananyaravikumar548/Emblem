import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col px-5 sm:px-6 pt-5 space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="w-16 h-3 bg-neutral-200 rounded animate-pulse"></div>
          <div className="w-48 h-8 bg-neutral-200 rounded animate-pulse"></div>
          <div className="w-64 h-4 bg-neutral-200 rounded animate-pulse"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-32 h-9 bg-neutral-200 rounded-xl animate-pulse"></div>
          <div className="w-20 h-9 bg-neutral-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="flex-1 bg-neutral-100 rounded-xl animate-pulse min-h-[300px]"></div>
      <div className="h-10 bg-neutral-200 rounded animate-pulse"></div>
      <div className="h-28 bg-neutral-100 rounded-xl animate-pulse"></div>
    </div>
  );
};
