import React from 'react';
import { FiSearch, FiFilter, FiRotateCcw } from 'react-icons/fi';

export const GigFilter = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categories = [],
  sortBy,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onReset,
}) => {
  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-5 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by gig title, skill, or student name..."
            className="input input-sm input-bordered w-full pl-10 rounded-xl bg-base-200/50 focus:bg-base-100 text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:col-span-3">
          <select
            value={categoryId || ''}
            onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
            className="select select-sm select-bordered w-full rounded-xl text-xs bg-base-200/50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon ? `${cat.icon} ` : ''}{cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="lg:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="select select-sm select-bordered w-full rounded-xl text-xs bg-base-200/50 font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="alphabetical">Title (A-Z)</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="lg:col-span-1 flex justify-end">
          <button
            onClick={onReset}
            className="btn btn-sm btn-ghost rounded-xl text-xs gap-1 text-base-content/60 hover:text-error w-full"
            title="Reset Filters"
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
            <span className="lg:hidden">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
