import React from 'react';
import { FiInbox } from 'react-icons/fi';

export const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-base-100 rounded-2xl border border-dashed border-base-300 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 text-3xl">
        <Icon />
      </div>
      <h3 className="text-lg font-bold text-neutral mb-1">{title}</h3>
      <p className="text-sm text-base-content/70 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm rounded-lg px-5">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
