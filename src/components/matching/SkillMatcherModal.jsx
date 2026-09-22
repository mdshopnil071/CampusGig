import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { POPULAR_SKILLS } from '../../data/universityData';
import { FiSearch, FiCheck, FiX, FiClock, FiDollarSign } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export const SkillMatcherModal = ({ isOpen, onClose, gigs = [] }) => {
  const [selectedSkills, setSelectedSkills] = useState(['React.js', 'Tailwind CSS']);
  const [maxBudget, setMaxBudget] = useState(50);
  const [deliverySpeed, setDeliverySpeed] = useState(3);
  const [matchedResults, setMatchedResults] = useState([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => prev.filter((s) => s !== skill));
    } else {
      setSelectedSkills((prev) => [...prev, skill]);
    }
  };

  const handleMatch = () => {
    if (selectedSkills.length === 0) {
      setMatchedResults([]);
      setHasCalculated(true);
      return;
    }

    // Algorithmic match calculation
    const scored = gigs.map((gig) => {
      let score = 50; // base score

      const text = `${gig.title} ${gig.description} ${gig.category?.name || ''}`.toLowerCase();
      
      // Skill match check (+15 points per matching skill)
      let matchedSkillCount = 0;
      selectedSkills.forEach((skill) => {
        if (text.includes(skill.toLowerCase().replace('.js', ''))) {
          score += 18;
          matchedSkillCount++;
        }
      });

      // Budget check
      if (gig.price <= maxBudget) {
        score += 15;
      } else {
        score -= 10;
      }

      // Cap at 99%
      score = Math.min(99, Math.max(45, score));

      return {
        ...gig,
        matchPercentage: score,
        matchedSkillCount,
      };
    });

    // Sort by match percentage
    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setMatchedResults(scored.slice(0, 4));
    setHasCalculated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-base-100 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-base-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-primary text-white flex items-center justify-center text-xl shadow-md">
              <HiSparkles />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-neutral">
                Smart Peer Skill Matcher
              </h3>
              <p className="text-xs text-base-content/60">
                Find the ideal verified student based on required skills & budget
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <FiX />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="space-y-4">
          {/* Skill Selector Chips */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-2">
              1. Select Required Skills ({selectedSkills.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-base-200/50 rounded-2xl border border-base-200">
              {POPULAR_SKILLS.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`badge gap-1 text-xs py-3 px-3 rounded-xl font-semibold cursor-pointer transition ${
                      active
                        ? 'badge-primary text-white shadow-xs'
                        : 'badge-ghost hover:bg-base-300 text-base-content/70'
                    }`}
                  >
                    {active && <FiCheck className="w-3 h-3" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Days Slider/Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                2. Max Budget (${maxBudget})
              </label>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="range range-primary range-sm"
              />
              <div className="flex justify-between text-[11px] text-base-content/60 font-semibold mt-1">
                <span>$5 (Micro)</span>
                <span>$250 (Full Project)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                3. Target Turnaround ({deliverySpeed} Days)
              </label>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={deliverySpeed}
                onChange={(e) => setDeliverySpeed(Number(e.target.value))}
                className="range range-secondary range-sm"
              />
              <div className="flex justify-between text-[11px] text-base-content/60 font-semibold mt-1">
                <span>1 Day (Urgent)</span>
                <span>7 Days (Standard)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleMatch}
            className="btn btn-primary w-full rounded-2xl gap-2 font-bold shadow-md hover:shadow-lg text-white"
          >
            <HiSparkles className="w-5 h-5" /> Calculate Best Student Matches
          </button>
        </div>

        {/* Results Showcase */}
        {hasCalculated && (
          <div className="space-y-3 pt-4 border-t border-base-200">
            <h4 className="font-bold text-xs uppercase text-base-content/60 tracking-wider">
              Top Matched Gigs & Mentors:
            </h4>

            {matchedResults.length === 0 ? (
              <div className="text-center py-6 text-sm text-base-content/60 bg-base-200/50 rounded-2xl">
                No exact matches found. Try broadening your skill selection or adjusting your budget.
              </div>
            ) : (
              <div className="space-y-3">
                {matchedResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 bg-base-200/50 hover:bg-base-200 rounded-2xl border border-base-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-accent badge-sm font-extrabold text-white">
                          {result.matchPercentage}% Match
                        </span>
                        <span className="text-xs font-bold text-neutral truncate max-w-[280px]">
                          {result.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-base-content/70">
                        Offered by {result.seller?.full_name || 'Verified Student'} • {result.seller?.university_name || 'Campus Peer'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-base font-extrabold text-primary">
                        ${result.price?.toFixed(2)}
                      </span>
                      <Link
                        to={`/gigs/${result.id}`}
                        onClick={onClose}
                        className="btn btn-primary btn-xs rounded-lg text-white"
                      >
                        View Gig
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
