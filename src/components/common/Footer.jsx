import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiCheckCircle } from 'react-icons/fi';
import { CampusGigLogo } from './CampusGigLogo';
import { ACADEMIC_INTEGRITY_PLEDGE } from '../../data/universityData';

export const Footer = () => {
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <CampusGigLogo to="/" size="md" showText={true} showSubtitle={false} textColor="white" />
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              The dedicated freelance micro-task and peer tutoring platform built exclusively for university students. Monetize your technical skills, build a verified portfolio, and collaborate ethically.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <FiShield className="w-4 h-4" />
              <span>100% Student Verified Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Explore Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <Link to="/gigs" className="hover:text-cyan-400 transition-colors">
                  Web & Software Development
                </Link>
              </li>
              <li>
                <Link to="/gigs" className="hover:text-cyan-400 transition-colors">
                  Graphic Design & Presentations
                </Link>
              </li>
              <li>
                <Link to="/gigs" className="hover:text-cyan-400 transition-colors">
                  Data Analysis & Python Scripts
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="hover:text-cyan-400 transition-colors">
                  Open Micro-Task Board
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Skill Verification Tests</span>
                  <span className="badge badge-accent badge-xs font-bold text-slate-950 bg-emerald-400 border-none">New</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Community */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Student Community
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => setShowIntegrityModal(true)}
                  className="hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <FiShield className="text-emerald-400" /> Academic Integrity Pledge
                </button>
              </li>
              <li>
                <Link to="/saved-gigs" className="hover:text-cyan-400 transition-colors">
                  My Wishlist / Saved Gigs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Student Freelancer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-cyan-400 transition-colors">
                  Join with University Email
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Reputation Info Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg shadow-black/20">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <FiCheckCircle className="text-emerald-400" /> Safe & Fair Marketplace
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every gig is reviewed for adherence to university ethics. Work with peers you trust, build verified ratings, and get paid securely.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowIntegrityModal(true)}
                className="btn btn-xs w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-500 font-bold transition-all rounded-lg py-2 h-auto"
              >
                Read Guidelines
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CampusGig. Designed for university students with ethical freelance micro-tasks.</p>
          <div className="flex items-center gap-6 text-slate-300 font-medium">
            <button
              type="button"
              onClick={() => setShowIntegrityModal(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Integrity Policy
            </button>
            <Link to="/gigs" className="hover:text-cyan-400 transition-colors">
              Gigs
            </Link>
            <Link to="/tasks" className="hover:text-cyan-400 transition-colors">
              Tasks
            </Link>
          </div>
        </div>
      </div>

      {/* Academic Integrity Modal */}
      {showIntegrityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 text-base-content max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-base-300 space-y-4">
            <div className="flex items-center justify-between border-b border-base-300 pb-3">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <FiShield className="text-primary text-xl" />
                {ACADEMIC_INTEGRITY_PLEDGE.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowIntegrityModal(false)}
                className="btn btn-ghost btn-sm btn-circle text-base-content hover:bg-base-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-base-content/90 leading-relaxed">
              {ACADEMIC_INTEGRITY_PLEDGE.summary}
            </p>

            <div className="space-y-2">
              <h5 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                Allowed & Encouraged:
              </h5>
              <ul className="text-xs space-y-1 text-base-content/90 pl-4 list-disc">
                {ACADEMIC_INTEGRITY_PLEDGE.allowed.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-xs text-rose-400 uppercase tracking-wider">
                Strictly Prohibited (Subject to Ban):
              </h5>
              <ul className="text-xs space-y-1 text-base-content/90 pl-4 list-disc">
                {ACADEMIC_INTEGRITY_PLEDGE.forbidden.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-base-300 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIntegrityModal(false)}
                className="btn btn-primary btn-sm rounded-xl font-bold text-white px-5"
              >
                I Understand & Pledge
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
