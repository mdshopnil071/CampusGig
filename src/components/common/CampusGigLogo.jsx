import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable, theme-aware CampusGig brand logo component.
 * Renders the official 3D gradient emblem with optional brand typography.
 * Supports light ('campus-light') and dark ('campus-dark') themes natively.
 */
export const CampusGigLogo = ({
  size = 'md',
  showText = true,
  showSubtitle = false,
  showVerifiedDot = false,
  textColor = 'auto', // 'auto' (theme-aware), 'white' (forces white for dark backgrounds), 'dark'
  to,
  className = '',
  iconClassName = '',
}) => {
  // Sizing map for the logo emblem
  const sizeMap = {
    xs: { img: 'w-7 h-7 rounded-lg', text: 'text-base', sub: 'text-[9px]' },
    sm: { img: 'w-8 h-8 rounded-lg', text: 'text-lg', sub: 'text-[9px]' },
    md: { img: 'w-10 h-10 rounded-xl', text: 'text-xl', sub: 'text-[10px]' },
    lg: { img: 'w-12 h-12 rounded-2xl', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'w-16 h-16 rounded-2xl', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const titleColorClass =
    textColor === 'white'
      ? 'text-white'
      : textColor === 'dark'
      ? 'text-slate-900'
      : 'text-neutral dark:text-white';

  const subColorClass =
    textColor === 'white'
      ? 'text-slate-400'
      : textColor === 'dark'
      ? 'text-slate-500'
      : 'text-base-content/60';

  const content = (
    <div className={`flex items-center gap-2.5 ${to ? 'group' : ''} ${className}`}>
      {/* Logo Emblem with Theme-Aware Glow & Ring */}
      <div className="relative shrink-0">
        <div
          className={`${currentSize.img} overflow-hidden shadow-md shadow-sky-500/20 ring-1 ring-slate-900/10 dark:ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-sky-500/35 group-hover:ring-sky-400/40 ${iconClassName}`}
        >
          <img
            src="/logo-128.png"
            alt="CampusGig Logo"
            className="w-full h-full object-cover select-none"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Optional Verified Student Checkmark Dot */}
        {showVerifiedDot && (
          <span
            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-base-100 flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
            title="Verified Campus Platform"
          >
            ✓
          </span>
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col select-none">
          <div
            className={`font-extrabold ${currentSize.text} tracking-tight ${titleColorClass} flex items-center gap-0.5 leading-none transition-colors`}
          >
            <span>Campus</span>
            <span className="text-gradient-electric font-black">Gig</span>
          </div>

          {showSubtitle && (
            <span
              className={`${currentSize.sub} ${subColorClass} font-bold tracking-wider uppercase mt-1`}
            >
              Student Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default CampusGigLogo;
