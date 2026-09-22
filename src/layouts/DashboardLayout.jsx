import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import {
  FiGrid,
  FiBriefcase,
  FiCheckSquare,
  FiSend,
  FiHeart,
  FiSettings,
  FiShield,
  FiUsers,
  FiLayers,
  FiAlertTriangle,
} from 'react-icons/fi';

export const DashboardLayout = () => {
  const { user, isAdmin } = useAuth();

  const userNavLinks = [
    { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
    { to: '/my-gigs', label: 'My Gigs', icon: FiBriefcase },
    { to: '/orders', label: 'My Orders', icon: FiCheckSquare },
    { to: '/my-tasks', label: 'My Posted Tasks', icon: FiLayers },
    { to: '/my-proposals', label: 'My Proposals', icon: FiSend },
    { to: '/saved-gigs', label: 'Saved Gigs', icon: FiHeart },
    { to: '/settings', label: 'Profile & Wallet', icon: FiSettings },
  ];

  const adminNavLinks = [
    { to: '/admin', label: 'Admin Metrics', icon: FiShield, end: true },
    { to: '/admin/categories', label: 'Categories CRUD', icon: FiLayers },
    { to: '/admin/reports', label: 'Disputes & Reports', icon: FiAlertTriangle },
    { to: '/admin/users', label: 'User Management', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-base-200 text-base-content">
      <Toaster position="top-right" />
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm space-y-6 sticky top-24">
            {/* User Mini Profile Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-base-200">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-sky-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-neutral truncate">
                  {user?.full_name}
                </h3>
                <span className="text-xs text-base-content/60 truncate block">
                  {user?.university_name || 'Campus Student'}
                </span>
                <span className="badge badge-primary badge-outline badge-xs capitalize font-semibold mt-1">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Student Freelancer Links */}
            <div>
              <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-wider block mb-2 px-2">
                Student Menu
              </span>
              <ul className="space-y-1">
                {userNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-base-content/70 hover:bg-base-200 hover:text-neutral'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Admin Links */}
            {isAdmin && (
              <div className="pt-4 border-t border-base-200">
                <span className="text-[11px] font-bold text-error uppercase tracking-wider block mb-2 px-2 flex items-center gap-1">
                  <FiShield /> Admin Controls
                </span>
                <ul className="space-y-1">
                  {adminNavLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          end={link.end}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-error text-white shadow-sm'
                                : 'text-base-content/70 hover:bg-error/10 hover:text-error'
                            }`
                          }
                        >
                          <Icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>

          {/* Main Dashboard Content Area */}
          <main className="lg:col-span-9 min-w-0 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};
