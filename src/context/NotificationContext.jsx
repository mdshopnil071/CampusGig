import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notificationsApi } from '../api/notificationsApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const knownIdsRef = useRef(new Set());
  const initialLoadRef = useRef(true);

  // Synthesize a pleasant chime sound using Web Audio API (zero external assets)
  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio might be blocked if user has not interacted with DOM yet
    }
  }, []);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      knownIdsRef.current.clear();
      initialLoadRef.current = true;
      return;
    }

    try {
      if (!silent) setLoading(true);
      const data = await notificationsApi.getNotifications({ size: 50 });
      if (Array.isArray(data)) {
        // Check for new incoming unread notifications after initial load
        if (!initialLoadRef.current) {
          const brandNew = data.filter(
            (n) => !n.is_read && !knownIdsRef.current.has(n.id)
          );

          if (brandNew.length > 0) {
            playChime();
            // Show toast alert for the most recent notification
            const latest = brandNew[0];
            toast(
              (t) => (
                <div
                  onClick={() => {
                    toast.dismiss(t.id);
                    // Match order ID if present and dispatch event or let user know
                    const match = latest.message.match(/Order #(\d+)/i) || latest.title.match(/Order #(\d+)/i);
                    if (match && match[1]) {
                      window.location.href = `/orders/${match[1]}`;
                    } else {
                      window.location.href = '/notifications';
                    }
                  }}
                  className="cursor-pointer"
                >
                  <p className="font-bold text-xs text-neutral">{latest.title}</p>
                  <p className="text-[11px] text-base-content/80 line-clamp-2 mt-0.5">
                    {latest.message}
                  </p>
                </div>
              ),
              {
                icon: '🔔',
                duration: 6000,
                position: 'top-right',
                style: {
                  borderRadius: '16px',
                  background: 'var(--color-base-100, #ffffff)',
                  color: 'var(--color-neutral, #1e293b)',
                  border: '1px solid var(--color-base-300, #e2e8f0)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px',
                },
              }
            );
          }
        }

        // Update known IDs
        data.forEach((n) => knownIdsRef.current.add(n.id));
        if (initialLoadRef.current) {
          initialLoadRef.current = false;
        }

        setNotifications(data);
        const unread = data.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [isAuthenticated, playChime]);

  // Periodic polling every 8 seconds for responsive alerts
  useEffect(() => {
    fetchNotifications();

    const timer = setInterval(() => {
      if (isAuthenticated) {
        fetchNotifications(true);
      }
    }, 8000);

    const handleFocus = () => {
      if (isAuthenticated) {
        fetchNotifications(true);
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchNotifications, isAuthenticated]);

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read', { icon: '✓', id: 'mark-all-read' });
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications((prev) => {
        const item = prev.find((n) => n.id === id);
        if (item && !item.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
      toast.success('Notification removed');
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  // Helper for immediate notification dispatch
  const notifyUser = async (userId, title, message) => {
    try {
      await notificationsApi.createNotification({
        user_id: Number(userId),
        title,
        message,
      });
      // If current user is also the target, refresh right away
      if (user && user.id === Number(userId)) {
        fetchNotifications(true);
      }
    } catch (err) {
      // Backend automatically handles notifications; client call is best-effort
      console.debug('Direct notification dispatch notice:', err?.response?.data || err.message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        notifyUser,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

