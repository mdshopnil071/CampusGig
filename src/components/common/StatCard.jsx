import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary', // 'primary' | 'success' | 'warning' | 'info' | 'accent'
}) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-info/10 text-info border-info/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm flex items-center justify-between transition hover:shadow-md">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-neutral tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-base-content/70 flex items-center gap-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${colorMap[color] || colorMap.primary}`}
        >
          <Icon />
        </div>
      )}
    </div>
  );
};
