import React, { useState } from 'react';
import { reportsApi } from '../../api/reportsApi';
import toast from 'react-hot-toast';
import { FiAlertTriangle, FiX, FiShield } from 'react-icons/fi';

export const ReportModal = ({ isOpen, onClose, reportedUserId, title = 'Report Issue or Violation' }) => {
  const [reason, setReason] = useState('Academic misconduct');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    'Academic misconduct / Assignment writing',
    'Fake service / Misleading claims',
    'Scam / Fraudulent transaction',
    'Harassment or abusive conduct',
    'Spam or duplicate listing',
    'Other violation',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!details.trim()) {
      toast.error('Please provide details about your report.');
      return;
    }

    try {
      setLoading(true);
      await reportsApi.createReport({
        reason,
        details: details.trim(),
        reported_user_id: reportedUserId ? Number(reportedUserId) : null,
      });

      toast.success('Your report has been submitted for administrative review.');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit report';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-base-100 max-w-md w-full rounded-2xl p-6 shadow-2xl border border-base-200 space-y-4">
        <div className="flex items-center justify-between border-b border-base-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center text-sm font-bold">
              <FiAlertTriangle />
            </span>
            <h3 className="font-bold text-lg text-neutral">{title}</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <FiX />
          </button>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <FiShield className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            CampusGig strictly upholds university academic integrity. Submissions involving contract cheating or harassment are investigated within 24 hours.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Select Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-xs"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Detailed Description & Evidence
            </label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain the incident, what policy was breached, or attach relevant message context..."
              className="textarea textarea-bordered w-full rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-base-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-ghost btn-sm rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-error btn-sm rounded-lg gap-2 text-white font-bold"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
