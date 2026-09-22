import React from 'react';
import { FiCheck, FiClock, FiFileText, FiThumbsUp, FiAlertCircle } from 'react-icons/fi';

export const OrderTimeline = ({ status }) => {
  const steps = [
    { id: 'pending', label: 'Order Placed', icon: FiClock },
    { id: 'in_progress', label: 'Working & Mentoring', icon: FiFileText },
    { id: 'delivered', label: 'Work Submitted', icon: FiCheck },
    { id: 'completed', label: 'Completed & Reviewed', icon: FiThumbsUp },
  ];

  if (status === 'cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700">
        <FiAlertCircle className="w-6 h-6 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">This order has been cancelled</h4>
          <p className="text-xs">No further actions or deliveries can be submitted for this order.</p>
        </div>
      </div>
    );
  }

  const getStepStatus = (stepId) => {
    const orderIndex = {
      pending: 0,
      in_progress: 1,
      delivered: 2,
      completed: 3,
    };

    const currentIndex = orderIndex[status] ?? 0;
    const targetIndex = orderIndex[stepId] ?? 0;

    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm">
      <h4 className="text-xs font-bold uppercase text-base-content/60 tracking-wider mb-6">
        Order Progress Tracker
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const state = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center text-center space-y-2 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  state === 'completed'
                    ? 'bg-success text-white shadow-sm'
                    : state === 'current'
                    ? 'bg-primary text-white ring-4 ring-primary/20 shadow-md animate-pulse'
                    : 'bg-base-200 text-base-content/40 border border-base-300'
                }`}
              >
                {state === 'completed' ? <FiCheck className="w-5 h-5 stroke-[3]" /> : <Icon />}
              </div>
              <div>
                <span
                  className={`text-xs font-bold block ${
                    state === 'current'
                      ? 'text-primary'
                      : state === 'completed'
                      ? 'text-neutral'
                      : 'text-base-content/50'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-base-content/50 capitalize block">
                  Step {idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
