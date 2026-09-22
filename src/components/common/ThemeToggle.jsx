import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 p-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 group ${
        isDark
          ? 'bg-slate-800/90 text-amber-300 border border-slate-700 shadow-inner hover:border-cyan-500/50'
          : 'bg-slate-100 text-sky-600 border border-slate-200 shadow-xs hover:border-sky-400'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle visual theme"
    >
      {/* Sliding indicator pill */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 transform ${
          isDark
            ? 'bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-md shadow-cyan-500/20 rotate-0'
            : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/20 rotate-180'
        }`}
      >
        {isDark ? (
          <FiMoon className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" />
        ) : (
          <FiSun className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold pr-2 select-none tracking-wide text-base-content/80">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
