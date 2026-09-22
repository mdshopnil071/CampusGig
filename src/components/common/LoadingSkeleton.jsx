import React from 'react';

export const LoadingSkeleton = ({ type = 'cards', count = 6 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {items.map((idx) => (
          <div
            key={idx}
            className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm space-y-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-base-300 rounded-full"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-base-300 rounded w-2/3"></div>
                <div className="h-2.5 bg-base-300 rounded w-1/3"></div>
              </div>
            </div>
            <div className="h-4 bg-base-300 rounded w-4/5"></div>
            <div className="h-3 bg-base-300 rounded w-full"></div>
            <div className="h-3 bg-base-300 rounded w-5/6"></div>
            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <div className="h-4 bg-base-300 rounded w-16"></div>
              <div className="h-6 bg-base-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-base-100 rounded-2xl border border-base-200 p-4 space-y-3 animate-pulse">
        {items.map((idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-base-200 last:border-b-0">
            <div className="h-4 bg-base-300 rounded w-1/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/6"></div>
            <div className="h-4 bg-base-300 rounded w-1/6"></div>
            <div className="h-6 bg-base-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6 animate-pulse">
      <div className="h-8 bg-base-300 rounded w-1/3"></div>
      <div className="h-32 bg-base-300 rounded-2xl"></div>
    </div>
  );
};
