import React from 'react';
import { FiAward, FiCheckCircle, FiClock, FiStar, FiShield } from 'react-icons/fi';

export const BadgeDisplay = ({
  reputationScore = 95,
  completedCount = 0,
  rating = 4.9,
  verifiedSkills = [],
  showReputationCard = false,
}) => {
  const getBadges = () => {
    const badges = [];

    // Base badge for student
    badges.push({
      id: 'student-verified',
      label: 'Campus Verified',
      icon: '🎓',
      desc: 'Enrolled university student identity verified',
      color: 'badge-primary',
    });

    if (rating >= 4.7 && completedCount >= 3) {
      badges.push({
        id: 'top-rated',
        label: 'Top Rated Student',
        icon: '🌟',
        desc: 'Consistent 4.8+ star peer reviews',
        color: 'badge-accent',
      });
    }

    if (completedCount >= 1) {
      badges.push({
        id: 'on-time',
        label: 'On-Time Hero',
        icon: '⚡',
        desc: '100% on-time project completion',
        color: 'badge-success',
      });
    }

    // Verified skills from assessment
    verifiedSkills.forEach((skill) => {
      badges.push({
        id: `verified-${skill.toLowerCase()}`,
        label: `${skill} Verified`,
        icon: '🛡️',
        desc: `Passed CampusGig ${skill} MCQ assessment (80%+ score)`,
        color: 'badge-info',
      });
    });

    return badges;
  };

  const badges = getBadges();

  return (
    <div className="space-y-4">
      {showReputationCard && (
        <div className="bg-gradient-to-r from-primary/10 via-cyan-50/50 dark:via-cyan-950/20 to-emerald-50/40 p-4 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              {reputationScore}
            </div>
            <div>
              <div className="font-bold text-sm text-neutral flex items-center gap-1.5">
                <FiShield className="text-primary" /> Campus Reputation Score
              </div>
              <div className="text-xs text-base-content/70">
                Calculated from verified orders, peer ratings & on-time delivery
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <FiStar className="fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <FiClock />
              <span>99% On-Time</span>
            </div>
          </div>
        </div>
      )}

      {/* Badges List */}
      <div className="flex flex-wrap items-center gap-2">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`badge ${b.color} badge-outline gap-1.5 py-3 px-3 text-xs font-bold rounded-xl shadow-xs transition hover:scale-105 cursor-default`}
            title={b.desc}
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
