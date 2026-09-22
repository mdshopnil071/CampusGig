import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <span className="text-6xl">🎓🔍</span>
      <h1 className="text-4xl sm:text-5xl font-black text-neutral">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-base-content/70 max-w-md leading-relaxed">
        The page you are looking for might have been moved, deleted, or does not exist on CampusGig.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Link to="/" className="btn btn-primary btn-sm rounded-xl font-bold text-white gap-2">
          <FiHome /> Back to Home
        </Link>
        <Link to="/gigs" className="btn btn-outline btn-sm rounded-xl font-bold gap-2">
          <FiSearch /> Browse Gigs
        </Link>
      </div>
    </div>
  );
};
