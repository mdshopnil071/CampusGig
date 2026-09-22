import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`join-item btn btn-sm font-semibold ${
            currentPage === i
              ? 'btn-primary text-white shadow-sm'
              : 'btn-ghost bg-base-100 hover:bg-base-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center my-8">
      <div className="join border border-base-300 shadow-sm bg-base-100 rounded-xl overflow-hidden p-0.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="join-item btn btn-sm btn-ghost gap-1 font-semibold disabled:bg-transparent"
        >
          <FiChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="join-item btn btn-sm btn-ghost gap-1 font-semibold disabled:bg-transparent"
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
