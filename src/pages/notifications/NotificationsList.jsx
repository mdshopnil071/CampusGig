import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiShoppingBag,
  FiMessageSquare,
  FiDollarSign,
  FiPackage,
  FiStar,
  FiInfo,
  FiFilter,
  FiRefreshCw,
  FiArrowRight,
} from 'react-icons/fi';

export const NotificationsList = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'orders' | 'messages' | 'payments'
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(true);
    setRefreshing(false);
  };

  // Helper to determine notification category and icon
  const getCategoryInfo = (notif) => {
    const text = (notif.title + ' ' + notif.message).toLowerCase();
    if (text.includes('payment') || text.includes('wallet') || text.includes('escrow') || text.includes('$')) {
      return {
        category: 'payments',
        icon: <FiDollarSign className="w-4 h-4 text-emerald-500" />,
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
        badge: 'Payment',
      };
    }
    if (text.includes('message') || text.includes('chat') || text.includes('discussion')) {
      return {
        category: 'messages',
        icon: <FiMessageSquare className="w-4 h-4 text-cyan-500" />,
        bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600',
        badge: 'Message',
      };
    }
    if (text.includes('delivered') || text.includes('deliverable') || text.includes('delivery')) {
      return {
        category: 'orders',
        icon: <FiPackage className="w-4 h-4 text-indigo-500" />,
        bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600',
        badge: 'Delivery',
      };
    }
    if (text.includes('review') || text.includes('rating') || text.includes('star')) {
      return {
        category: 'orders',
        icon: <FiStar className="w-4 h-4 text-amber-500" />,
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
        badge: 'Review',
      };
    }
    if (text.includes('order') || text.includes('gig')) {
      return {
        category: 'orders',
        icon: <FiShoppingBag className="w-4 h-4 text-primary" />,
        bg: 'bg-primary/10 border-primary/20 text-primary',
        badge: 'Order',
      };
    }
    return {
      category: 'system',
      icon: <FiInfo className="w-4 h-4 text-purple-500" />,
      bg: 'bg-purple-500/10 border-purple-500/20 text-purple-600',
      badge: 'System',
    };
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Tab filter
      if (activeTab === 'unread' && notif.is_read) return false;
      if (activeTab === 'orders') {
        const cat = getCategoryInfo(notif).category;
        if (cat !== 'orders') return false;
      }
      if (activeTab === 'messages') {
        const cat = getCategoryInfo(notif).category;
        if (cat !== 'messages') return false;
      }
      if (activeTab === 'payments') {
        const cat = getCategoryInfo(notif).category;
        if (cat !== 'payments') return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = notif.title.toLowerCase().includes(query);
        const matchMsg = notif.message.toLowerCase().includes(query);
        return matchTitle || matchMsg;
      }

      return true;
    });
  }, [notifications, activeTab, searchTerm]);

  // Click on a notification row
  const handleItemClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    const orderMatch = (notif.message + ' ' + notif.title).match(/Order #(\d+)/i);
    if (orderMatch && orderMatch[1]) {
      navigate(`/orders/${orderMatch[1]}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Notifications Inbox' }]} />

      {/* Header Banner */}
      <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
              <FiBell />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral">Notifications Inbox</h1>
              <p className="text-xs text-base-content/60">
                Live updates for your gig orders, peer messages, deliverables, and wallet payments
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="btn btn-ghost btn-sm rounded-xl border border-base-200 gap-1.5 text-xs"
            title="Refresh notifications"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-primary btn-sm rounded-xl text-white font-bold gap-1.5 text-xs shadow-sm hover:shadow-md transition-all"
            >
              <FiCheckCircle className="w-4 h-4" />
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-base-100 rounded-2xl p-4 border border-base-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`btn btn-sm rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'btn-primary text-white shadow-xs'
                : 'btn-ghost text-base-content/70 hover:bg-base-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`btn btn-sm rounded-xl text-xs font-bold transition ${
              activeTab === 'unread'
                ? 'btn-primary text-white shadow-xs'
                : 'btn-ghost text-base-content/70 hover:bg-base-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn btn-sm rounded-xl text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'btn-primary text-white shadow-xs'
                : 'btn-ghost text-base-content/70 hover:bg-base-200'
            }`}
          >
            Orders & Delivery
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`btn btn-sm rounded-xl text-xs font-bold transition ${
              activeTab === 'messages'
                ? 'btn-primary text-white shadow-xs'
                : 'btn-ghost text-base-content/70 hover:bg-base-200'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`btn btn-sm rounded-xl text-xs font-bold transition ${
              activeTab === 'payments'
                ? 'btn-primary text-white shadow-xs'
                : 'btn-ghost text-base-content/70 hover:bg-base-200'
            }`}
          >
            Payments
          </button>
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm input-bordered w-full rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <LoadingSkeleton type="cards" count={3} />
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-base-200/60 mx-auto flex items-center justify-center text-2xl text-base-content/40">
              <FiBell />
            </div>
            <h3 className="font-extrabold text-base text-neutral">No notifications found</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {activeTab === 'unread'
                ? "You're all caught up! No unread notifications right now."
                : searchTerm
                ? `No notifications matched '${searchTerm}'. Try clear your search.`
                : 'When you receive gig orders, messages, or payments, they will show up here in real time.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const cat = getCategoryInfo(notif);
            const orderMatch = (notif.message + ' ' + notif.title).match(/Order #(\d+)/i);

            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  notif.is_read
                    ? 'bg-base-100 border-base-200 hover:border-base-300'
                    : 'bg-primary/5 border-primary/20 hover:border-primary/40 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${cat.bg}`}>
                    {cat.icon}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-neutral">{notif.title}</span>
                      <span className="badge badge-ghost badge-xs font-semibold">{cat.badge}</span>
                      {!notif.is_read && (
                        <span className="badge badge-primary badge-xs font-bold text-white">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-base-content/80 leading-relaxed break-words">
                      {notif.message}
                    </p>

                    <div className="text-[11px] text-base-content/50 pt-1 flex items-center gap-3">
                      <span>{new Date(notif.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      {orderMatch && (
                        <button
                          onClick={() => handleItemClick(notif)}
                          className="text-primary font-bold hover:underline flex items-center gap-1"
                        >
                          View Order #{orderMatch[1]} <FiArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!notif.is_read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10 rounded-lg gap-1"
                      title="Mark as read"
                    >
                      <FiCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="btn btn-ghost btn-xs text-base-content/40 hover:text-error hover:bg-error/10 rounded-lg"
                    title="Delete notification"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
