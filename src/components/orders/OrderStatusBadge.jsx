import React from 'react';

export const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pending Acceptance',
      className: 'bg-amber-100 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
    },
    in_progress: {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-800 border-blue-300',
      dot: 'bg-blue-500',
    },
    delivered: {
      label: 'Delivered / In Review',
      className: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
      dot: 'bg-cyan-500',
    },
    completed: {
      label: 'Completed',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-500',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-rose-100 text-rose-800 border-rose-300',
      dot: 'bg-rose-500',
    },
  };

  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      <span>{config.label}</span>
    </span>
  );
};
