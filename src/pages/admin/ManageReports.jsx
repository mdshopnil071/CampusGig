import React, { useState, useEffect } from 'react';
import { reportsApi } from '../../api/reportsApi';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FiAlertTriangle, FiCheckCircle, FiXCircle, FiFilter, FiTrash2 } from 'react-icons/fi';

export const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = { size: 50 };
      if (statusFilter !== 'all') {
        params.status_filter = statusFilter;
      }
      const data = await reportsApi.getAdminReports(params);
      if (Array.isArray(data)) setReports(data);
    } catch (err) {
      console.error('Failed to load admin reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await reportsApi.updateReportStatus(id, newStatus);
      toast.success(`Report status marked as ${newStatus}!`);
      fetchReports();
    } catch (err) {
      toast.error('Failed to update report status');
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await reportsApi.deleteReport(id);
      toast.success('Report deleted.');
      fetchReports();
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  const statusBadges = {
    pending: 'badge-warning text-neutral',
    resolved: 'badge-success text-white',
    dismissed: 'badge-ghost text-base-content/50',
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'Disputes & Reports' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral">Disputes & Reports</h1>
          <p className="text-xs text-base-content/70">
            Moderate academic misconduct, scam claims, or peer disputes
          </p>
        </div>

        {/* Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select select-sm select-bordered rounded-xl text-xs"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Only</option>
          <option value="resolved">Resolved Only</option>
          <option value="dismissed">Dismissed Only</option>
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FiAlertTriangle}
          title="No Reports Found"
          description="There are currently no disputed items or misconduct reports matching this filter."
        />
      ) : (
        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-neutral">
                    Report #{rep.id}
                  </span>
                  <span
                    className={`badge badge-sm font-bold text-[10px] capitalize ${
                      statusBadges[rep.status] || 'badge-ghost'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
                <span className="text-[11px] text-base-content/50">
                  {new Date(rep.created_at).toLocaleString()}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-error">
                  Reason: {rep.reason}
                </div>
                <p className="text-xs text-base-content/80 mt-1 leading-relaxed bg-base-200/50 p-3 rounded-xl border border-base-200">
                  {rep.details}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-base-200 text-xs">
                <div className="text-[11px] text-base-content/60">
                  Reported by User #{rep.reporter_id}{' '}
                  {rep.reported_user_id && `• Target User: #${rep.reported_user_id}`}
                </div>

                <div className="flex items-center gap-2">
                  {rep.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(rep.id, 'resolved')}
                      className="btn btn-xs btn-success text-white rounded-lg font-bold gap-1"
                    >
                      <FiCheckCircle /> Mark Resolved
                    </button>
                  )}
                  {rep.status !== 'dismissed' && (
                    <button
                      onClick={() => handleUpdateStatus(rep.id, 'dismissed')}
                      className="btn btn-xs btn-ghost text-base-content/60 rounded-lg"
                    >
                      Dismiss
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReport(rep.id)}
                    className="btn btn-xs btn-ghost text-error"
                    title="Delete Record"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
