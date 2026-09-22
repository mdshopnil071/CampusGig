import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import { gigsApi } from '../../api/gigsApi';
import { ordersApi } from '../../api/ordersApi';
import { reportsApi } from '../../api/reportsApi';
import { notificationsApi } from '../../api/notificationsApi';
import { StatCard } from '../../components/common/StatCard';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  FiUsers,
  FiBriefcase,
  FiCheckSquare,
  FiAlertTriangle,
  FiLayers,
  FiBell,
  FiSend,
  FiShield,
  FiArrowRight,
} from 'react-icons/fi';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    usersCount: 0,
    gigsCount: 0,
    ordersCount: 0,
    reportsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Broadcast Notification Form
  const [broadcastTargetUserId, setBroadcastTargetUserId] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const [usersRes, gigsRes, ordersRes, reportsRes] = await Promise.allSettled([
          usersApi.listUsers({ size: 1 }),
          gigsApi.getGigs({ size: 1 }),
          ordersApi.getOrders({ size: 100 }),
          reportsApi.getAdminReports({ size: 100 }),
        ]);

        setMetrics({
          usersCount: usersRes.status === 'fulfilled' ? (usersRes.value?.length || 10) : 0,
          gigsCount: gigsRes.status === 'fulfilled' ? (gigsRes.value?.total || 0) : 0,
          ordersCount: ordersRes.status === 'fulfilled' ? (ordersRes.value?.length || 0) : 0,
          reportsCount:
            reportsRes.status === 'fulfilled'
              ? reportsRes.value.filter((r) => r.status === 'pending').length
              : 0,
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();

    if (!broadcastTargetUserId || !broadcastTitle || !broadcastMessage) {
      toast.error('Please fill in all notification broadcast fields');
      return;
    }

    try {
      setBroadcasting(true);
      await notificationsApi.createNotification({
        user_id: Number(broadcastTargetUserId),
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
      });

      toast.success('System notification sent to student user!');
      setBroadcastTargetUserId('');
      setBroadcastTitle('');
      setBroadcastMessage('');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to send notification';
      toast.error(msg);
    } finally {
      setBroadcasting(false);
    }
  };

  if (loading) return <LoadingSkeleton type="cards" count={4} />;

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Admin Dashboard' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-error font-bold text-xs uppercase tracking-wider mb-1">
            <FiShield /> Super Admin Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            Platform Overview & Moderation
          </h1>
          <p className="text-xs text-base-content/70">
            Monitor platform health, resolve academic integrity reports, and manage categories
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value={metrics.usersCount}
          subtitle="Registered platform users"
          icon={FiUsers}
          color="primary"
        />

        <StatCard
          title="Live Gigs"
          value={metrics.gigsCount}
          subtitle="Services in marketplace"
          icon={FiBriefcase}
          color="info"
        />

        <StatCard
          title="Total Orders"
          value={metrics.ordersCount}
          subtitle="Processed student orders"
          icon={FiCheckSquare}
          color="success"
        />

        <StatCard
          title="Pending Reports"
          value={metrics.reportsCount}
          subtitle="Requires admin resolution"
          icon={FiAlertTriangle}
          color="warning"
        />
      </div>

      {/* Quick Admin Modules Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/categories"
          className="p-6 bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-md transition space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <FiLayers />
          </div>
          <h3 className="font-extrabold text-sm text-neutral flex items-center justify-between">
            <span>Manage Categories</span>
            <FiArrowRight className="text-primary" />
          </h3>
          <p className="text-xs text-base-content/60">
            Create, edit, or delete platform service categories.
          </p>
        </Link>

        <Link
          to="/admin/reports"
          className="p-6 bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-md transition space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <FiAlertTriangle />
          </div>
          <h3 className="font-extrabold text-sm text-neutral flex items-center justify-between">
            <span>Disputes & Reports</span>
            <FiArrowRight className="text-amber-600" />
          </h3>
          <p className="text-xs text-base-content/60">
            Investigate cheating or scam complaints and update status.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="p-6 bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-md transition space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <FiUsers />
          </div>
          <h3 className="font-extrabold text-sm text-neutral flex items-center justify-between">
            <span>User Directory</span>
            <FiArrowRight className="text-sky-600 dark:text-sky-400" />
          </h3>
          <p className="text-xs text-base-content/60">
            Search users by university, verify roles, or remove accounts.
          </p>
        </Link>
      </div>

      {/* Admin Notification Broadcaster */}
      <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <FiBell /> Notification Dispatcher
        </div>
        <div>
          <h2 className="text-lg font-black text-neutral">
            Send System Notification to User
          </h2>
          <p className="text-xs text-base-content/70">
            Push an official notification directly to a student's notification bell (`/api/notifications`)
          </p>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                Target User ID
              </label>
              <input
                type="number"
                required
                min="1"
                value={broadcastTargetUserId}
                onChange={(e) => setBroadcastTargetUserId(e.target.value)}
                placeholder="e.g. 1"
                className="input input-bordered w-full rounded-2xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                Notification Title
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Account Verified / Policy Reminder"
                className="input input-bordered w-full rounded-2xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Message Body
            </label>
            <textarea
              rows={3}
              required
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type notification message..."
              className="textarea textarea-bordered w-full rounded-2xl text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={broadcasting}
              className="btn btn-primary btn-sm rounded-xl font-bold text-white shadow-sm gap-1.5"
            >
              {broadcasting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <FiSend /> Dispatch Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
