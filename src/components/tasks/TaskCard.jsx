import React from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiClock, FiSend, FiTag } from 'react-icons/fi';

export const TaskCard = ({ task, onApply }) => {
  if (!task) return null;

  const statusColors = {
    open: 'badge-success text-white',
    in_progress: 'badge-info text-white',
    completed: 'badge-neutral text-white',
    cancelled: 'badge-error text-white',
  };

  const isClosed = task.status !== 'open';

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5">
      <div className="space-y-3">
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-ghost badge-sm text-[11px] font-semibold flex items-center gap-1">
            <FiTag className="text-primary" />
            Task #{task.id}
          </span>
          <span
            className={`badge badge-sm font-bold capitalize ${
              statusColors[task.status] || 'badge-ghost'
            }`}
          >
            {task.status.replace('_', ' ')}
          </span>
        </div>

        {/* Title */}
        <Link to={`/tasks/${task.id}`}>
          <h3 className="font-bold text-base text-neutral hover:text-primary transition-colors line-clamp-2">
            {task.title}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Footer Info: Budget & Action */}
      <div className="pt-4 mt-4 border-t border-base-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-base-content/60 block -mb-0.5">
            Budget
          </span>
          <div className="text-xl font-black text-emerald-600 flex items-center">
            ${task.budget?.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${task.id}`}
            className="btn btn-ghost btn-sm text-xs font-semibold rounded-lg"
          >
            Details
          </Link>
          {!isClosed && onApply && (
            <button
              onClick={() => onApply(task)}
              className="btn btn-primary btn-sm text-xs rounded-lg gap-1.5 shadow-sm hover:shadow text-white font-bold"
            >
              <FiSend className="w-3.5 h-3.5" />
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
