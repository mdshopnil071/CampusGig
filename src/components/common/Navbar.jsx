import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSavedGigs } from '../../context/SavedGigsContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  FiHeart, 
  FiBell, 
  FiPlusCircle, 
  FiMenu, 
  FiX, 
  FiAward, 
  FiCheckCircle, 
  FiLayers, 
  FiBriefcase, 
  FiSettings, 
  FiShield,
  FiLogOut
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { savedCount } = useSavedGigs();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-base-300 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-sky-600 to-cyan-500 flex items-center justify-center text-white text-xl shadow-md shadow-primary/25 group-hover:scale-105 group-hover:shadow-primary/40 transition-all duration-300">
                  🎓
                </span>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-base-100 flex items-center justify-center text-[8px] text-white">
                  ✓
                </span>
              </div>
              <div className="flex flex-col">
                <div className="font-extrabold text-xl tracking-tight text-neutral flex items-center gap-1 leading-none">
                  Campus<span className="text-gradient-electric font-black">Gig</span>
                </div>
                <span className="text-[10px] text-base-content/60 font-semibold tracking-wider uppercase mt-1">
                  Student Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              <Link
                to="/gigs"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/gigs')
                    ? 'text-primary bg-primary/10 font-bold shadow-xs'
                    : 'text-base-content/80 hover:text-primary hover:bg-base-300/60'
                }`}
              >
                Browse Gigs
              </Link>
              <Link
                to="/tasks"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/tasks')
                    ? 'text-primary bg-primary/10 font-bold shadow-xs'
                    : 'text-base-content/80 hover:text-primary hover:bg-base-300/60'
                }`}
              >
                Micro-Tasks
              </Link>
              <Link
                to="/skills"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  isActive('/skills')
                    ? 'text-primary bg-primary/10 font-bold shadow-xs'
                    : 'text-base-content/80 hover:text-primary hover:bg-base-300/60'
                }`}
              >
                <FiAward className="text-amber-500" />
                <span>Skill Tests</span>
                <span className="badge badge-accent badge-xs font-bold uppercase text-[9px] px-1.5 py-0.5">MCQ</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            {/* Prominent Theme Switcher Toggle */}
            <ThemeToggle showLabel={false} />

            {/* Wishlist Link */}
            <Link
              to="/saved-gigs"
              className="btn btn-ghost btn-circle btn-sm relative text-base-content/70 hover:text-primary hover:bg-base-300/60 transition-colors"
              title="Saved Gigs / Wishlist"
            >
              <FiHeart className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="badge badge-primary badge-xs absolute -top-1 -right-1 font-bold shadow-xs">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            {isAuthenticated && (
              <div className="dropdown dropdown-end">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="btn btn-ghost btn-circle btn-sm relative text-base-content/70 hover:text-primary hover:bg-base-300/60 transition-colors"
                  title="Notifications"
                >
                  <FiBell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="badge badge-error text-white badge-xs absolute -top-1 -right-1 font-bold animate-pulse shadow-xs">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="dropdown-content z-50 menu p-3 shadow-2xl bg-base-100 rounded-2xl w-80 sm:w-96 border border-base-300 mt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-base-300 mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-neutral">
                        <FiBell className="text-primary" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="badge badge-primary badge-sm font-semibold ml-1">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="btn btn-ghost btn-xs text-primary text-[11px] font-bold hover:bg-primary/10 rounded-lg px-2"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-sm text-base-content/60">
                          <FiBell className="w-8 h-8 mx-auto mb-2 text-base-content/30 stroke-1" />
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((notif) => {
                          const orderMatch = (notif.message + ' ' + notif.title).match(/Order #(\d+)/i);
                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                if (!notif.is_read) markAsRead(notif.id);
                                setNotificationsOpen(false);
                                if (orderMatch && orderMatch[1]) {
                                  navigate(`/orders/${orderMatch[1]}`);
                                } else {
                                  navigate('/notifications');
                                }
                              }}
                              className={`p-2.5 rounded-xl transition cursor-pointer text-xs relative ${
                                notif.is_read
                                  ? 'bg-base-200/40 hover:bg-base-200/80 text-base-content/70'
                                  : 'bg-primary/10 hover:bg-primary/15 text-neutral font-medium border border-primary/20 shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-xs mb-1">
                                <span className="line-clamp-1">{notif.title}</span>
                                {!notif.is_read && (
                                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 ml-2"></span>
                                )}
                              </div>
                              <p className="text-base-content/80 text-[11px] line-clamp-2 leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="mt-1 flex items-center justify-between text-[10px] text-base-content/50">
                                <span>{new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                {orderMatch && (
                                  <span className="text-primary font-semibold hover:underline">
                                    Go to Order →
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="pt-2 border-t border-base-300 mt-2 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-primary font-bold hover:underline block py-1"
                      >
                        View All Notifications ({notifications.length}) →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Button & User Profile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/gigs/create"
                  className="btn btn-primary btn-sm rounded-xl shadow-md shadow-primary/20 gap-1.5 font-bold hover:shadow-lg hover:shadow-primary/30 text-white transition-all"
                >
                  <FiPlusCircle className="w-4 h-4" />
                  Post Gig
                </Link>

                {/* User Profile Avatar Dropdown */}
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar btn-sm ring-2 ring-primary/30 hover:ring-primary transition-all">
                    <div className="w-8 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 text-primary flex items-center justify-center font-bold text-sm">
                      {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-base-100 rounded-2xl w-64 border border-base-300"
                  >
                    <li className="menu-title px-2 py-1.5 border-b border-base-300 mb-2">
                      <div className="font-bold text-neutral text-sm truncate">{user?.full_name}</div>
                      <div className="text-xs text-base-content/60 truncate">{user?.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="badge badge-primary badge-outline text-[11px] font-semibold capitalize">
                          {user?.role}
                        </span>
                        <span className="text-xs font-bold text-emerald-500">
                          ${user?.wallet_balance?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </li>

                    <li>
                      <Link to="/dashboard" className="flex items-center gap-2 py-2">
                        <FiLayers className="text-primary" /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-gigs" className="flex items-center gap-2 py-2">
                        <FiBriefcase className="text-cyan-500" /> My Gigs
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders" className="flex items-center gap-2 py-2">
                        <FiCheckCircle className="text-emerald-500" /> My Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-proposals" className="flex items-center gap-2 py-2">
                        <HiSparkles className="text-amber-500" /> My Proposals
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" className="flex items-center gap-2 py-2">
                        <FiSettings className="text-base-content/70" /> Settings
                      </Link>
                    </li>

                    {isAdmin && (
                      <>
                        <div className="divider my-1"></div>
                        <li className="menu-title text-error text-[11px] uppercase font-bold">Admin Panel</li>
                        <li>
                          <Link to="/admin" className="text-error font-medium flex items-center gap-2 py-2">
                            <FiShield /> Admin Dashboard
                          </Link>
                        </li>
                      </>
                    )}

                    <div className="divider my-1"></div>
                    <li>
                      <button onClick={handleLogout} className="text-error flex items-center gap-2 py-2 font-medium">
                        <FiLogOut /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm font-semibold text-base-content/80 hover:text-primary hover:bg-base-300/60 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm rounded-xl shadow-md shadow-primary/20 font-bold hover:shadow-lg hover:shadow-primary/30 text-white transition-all"
                >
                  Join CampusGig
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Theme Toggle + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle showLabel={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-circle btn-sm text-base-content"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-base-300 space-y-2 animate-fadeIn">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-base-content/60">Appearance</span>
              <ThemeToggle showLabel={true} />
            </div>

            <Link
              to="/gigs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-base-content hover:bg-base-300"
            >
              Browse Gigs
            </Link>
            <Link
              to="/tasks"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-base-content hover:bg-base-300"
            >
              Micro-Tasks
            </Link>
            <Link
              to="/skills"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-base-content hover:bg-base-300 flex items-center gap-2"
            >
              <FiAward className="text-amber-500" /> Skill Tests
            </Link>
            <Link
              to="/saved-gigs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-base-content hover:bg-base-300 flex items-center gap-2"
            >
              <FiHeart className="text-primary" /> Saved Gigs ({savedCount})
            </Link>

            <div className="divider my-2"></div>

            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 font-bold text-sm text-primary flex items-center justify-between">
                  <span>{user?.full_name}</span>
                  <span className="text-xs text-emerald-500 font-bold">${user?.wallet_balance?.toFixed(2)}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-base-content hover:bg-base-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-base-content hover:bg-base-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FiBell className="text-primary" /> Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="badge badge-primary badge-xs font-bold">{unreadCount}</span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-base-content hover:bg-base-300"
                >
                  My Orders
                </Link>
                <Link
                  to="/gigs/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-bold bg-primary text-white text-center shadow-md"
                >
                  + Post a Gig
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/10"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-sm w-full rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm w-full rounded-xl text-white font-bold"
                >
                  Join CampusGig
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
