import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiStar, FiShield, FiArrowUpRight } from 'react-icons/fi';
import { useSavedGigs } from '../../context/SavedGigsContext';
import { use3DTilt } from '../../hooks/use3DTilt';

export const GigCard = ({ gig }) => {
  const { isSaved, toggleSave } = useSavedGigs();
  const { style, glareStyle, bind } = use3DTilt({ maxTilt: 7, scale: 1.015, glare: true });

  if (!gig) return null;

  const saved = isSaved(gig.id);
  const seller = gig.seller || {};
  const category = gig.category || {};
  const sellerInitial = seller.full_name ? seller.full_name.charAt(0).toUpperCase() : 'S';

  return (
    <div
      style={style}
      {...bind}
      className="relative bg-base-100 rounded-3xl border border-base-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group preserve-3d"
    >
      {/* Specular Glare Overlay for 3D Micro-Effect */}
      {glareStyle && (
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 rounded-3xl"
          style={glareStyle}
        />
      )}

      {/* Top Banner & Category Badge */}
      <div className="p-5 pb-4 relative z-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="badge badge-primary/10 text-primary border border-primary/20 text-[11px] font-bold py-2.5 px-3 rounded-xl truncate max-w-[200px] shadow-xs">
            {category.name || 'Micro-Gig'}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSave(gig);
            }}
            className={`btn btn-circle btn-xs transition-all duration-200 ${
              saved 
                ? 'text-rose-500 bg-rose-500/10 border-rose-500/30 scale-110' 
                : 'btn-ghost text-base-content/40 hover:text-rose-500 hover:bg-rose-500/10'
            }`}
            title={saved ? 'Remove from saved' : 'Save gig'}
          >
            <FiHeart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link to={`/gigs/${gig.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-extrabold text-base text-neutral line-clamp-2 leading-snug mb-2 group-hover:translate-x-0.5 transition-transform">
            {gig.title}
          </h3>
        </Link>

        <p className="text-xs text-base-content/70 line-clamp-2 mb-4 leading-relaxed font-normal">
          {gig.description}
        </p>

        {/* Seller Info with Verified Student Tag */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-base-300/80">
          <Link to={`/profile/${seller.id}`} className="shrink-0 relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 via-sky-500/20 to-cyan-500/20 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/30 shadow-xs">
              {sellerInitial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-base-100" title="Verified Student" />
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              to={`/profile/${seller.id}`}
              className="text-xs font-bold text-neutral hover:text-primary transition-colors truncate block"
            >
              {seller.full_name || 'Campus Peer'}
            </Link>
            <span className="text-[10px] text-base-content/60 truncate flex items-center gap-1">
              <FiShield className="text-emerald-500 w-2.5 h-2.5 shrink-0" />
              {seller.university_name || 'Verified University Peer'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shrink-0">
            <FiStar className="fill-amber-400 w-3 h-3" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      {/* Footer / Turnaround & Starting Price */}
      <div className="px-5 py-3.5 bg-base-200/60 border-t border-base-300 flex items-center justify-between relative z-0">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-base-content/70">
          <FiClock className="text-cyan-500 w-3.5 h-3.5" />
          <span>24-48h Delivery</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[9px] text-base-content/50 uppercase font-bold tracking-wider block -mb-0.5">
              From
            </span>
            <span className="text-lg font-black text-primary">
              ${gig.price?.toFixed(2)}
            </span>
          </div>
          <Link
            to={`/gigs/${gig.id}`}
            className="w-7 h-7 rounded-lg bg-base-100 border border-base-300 flex items-center justify-center text-base-content/60 group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/10 transition-all"
            title="View gig details"
          >
            <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
