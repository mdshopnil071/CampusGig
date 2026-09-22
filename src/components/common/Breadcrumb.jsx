import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-base-content/60 my-4 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="hover:text-primary transition flex items-center gap-1">
        <FiHome />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <FiChevronRight className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-neutral">{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-primary transition">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
