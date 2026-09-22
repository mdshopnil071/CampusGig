import React, { useState } from 'react';
import { FiCheck, FiClock, FiRefreshCw } from 'react-icons/fi';

export const GigPackagesTable = ({ basePrice = 10, onSelectPackage }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const packages = {
    basic: {
      name: 'Basic Starter',
      price: basePrice,
      deliveryDays: 2,
      revisions: 1,
      description: 'Core task completion with clean code, standard output, and basic documentation.',
      features: [
        'Single task or module delivery',
        'Clean, commented source code',
        'Basic setup instructions',
        '1 minor revision included',
      ],
    },
    standard: {
      name: 'Standard Pro',
      price: Math.round(basePrice * 1.8),
      deliveryDays: 3,
      revisions: 2,
      description: 'Complete multi-component solution with testing, detailed documentation, and peer review.',
      features: [
        'Full micro-feature implementation',
        'Comprehensive documentation',
        'Testing & verification check',
        '2 rounds of revisions',
        'Faster peer response time',
      ],
      popular: true,
    },
    premium: {
      name: 'Premium Complete',
      price: Math.round(basePrice * 2.6),
      deliveryDays: 5,
      revisions: 4,
      description: 'End-to-end full solution with 1-on-1 walkthrough session, prioritized delivery, and extended support.',
      features: [
        'End-to-end complete architecture',
        'Video or 1-on-1 walkthrough explanation',
        'Priority peer turnaround',
        'Unlimited minor bug fixes (up to 4 revisions)',
        'Free deployment guidance',
      ],
    },
  };

  const selectedPkg = packages[activeTab];

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
      {/* Package Tabs */}
      <div className="grid grid-cols-3 border-b border-base-200 text-center font-bold text-xs sm:text-sm">
        {Object.keys(packages).map((key) => {
          const pkg = packages[key];
          const isCurrent = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-3.5 px-2 transition relative ${
                isCurrent
                  ? 'bg-base-100 text-primary border-b-2 border-primary'
                  : 'bg-base-200/50 text-base-content/60 hover:text-base-content hover:bg-base-200'
              }`}
            >
              {pkg.popular && (
                <span className="badge badge-primary badge-xs absolute -top-1 right-2 text-[9px] font-extrabold uppercase">
                  Popular
                </span>
              )}
              <span className="capitalize">{key}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Package Details */}
      <div className="p-6 space-y-5">
        <div className="flex items-baseline justify-between">
          <h4 className="font-bold text-lg text-neutral">{selectedPkg.name}</h4>
          <div className="text-2xl font-black text-primary">
            ${selectedPkg.price.toFixed(2)}
          </div>
        </div>

        <p className="text-xs text-base-content/70 leading-relaxed">
          {selectedPkg.description}
        </p>

        <div className="flex items-center gap-6 text-xs font-semibold text-base-content/80 py-2 border-y border-base-200">
          <div className="flex items-center gap-1.5">
            <FiClock className="text-primary" />
            <span>{selectedPkg.deliveryDays} Days Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiRefreshCw className="text-info" />
            <span>{selectedPkg.revisions} Revisions</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-bold text-base-content/60 tracking-wider">
            What's Included:
          </span>
          <ul className="space-y-2 text-xs text-base-content/80">
            {selectedPkg.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <FiCheck className="text-success w-4 h-4 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Button */}
        <button
          onClick={() => onSelectPackage(selectedPkg)}
          className="btn btn-primary w-full rounded-xl font-bold shadow-md hover:shadow-lg gap-2 text-white"
        >
          Continue (${selectedPkg.price.toFixed(2)})
        </button>
      </div>
    </div>
  );
};
