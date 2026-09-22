import React, { useState } from 'react';
import { deliveriesApi } from '../../api/deliveriesApi';
import { ordersApi } from '../../api/ordersApi';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiX, FiLink, FiFileText } from 'react-icons/fi';

export const DeliveryModal = ({ isOpen, onClose, orderId, onDelivered }) => {
  const { fetchNotifications } = useNotifications();
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionText.trim()) {
      toast.error('Please describe what work you are delivering.');
      return;
    }

    try {
      setLoading(true);
      // 1. Create delivery record
      await deliveriesApi.createDelivery({
        order_id: Number(orderId),
        submission_text: submissionText.trim(),
        file_url: fileUrl.trim() || null,
      });

      // 2. Update order status to 'delivered'
      await ordersApi.updateOrderStatus(orderId, 'delivered');

      fetchNotifications(true);
      toast.success('Work delivered successfully! The buyer has been notified.');
      if (onDelivered) onDelivered();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit delivery';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-base-100 max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-base-200 space-y-4">
        <div className="flex items-center justify-between border-b border-base-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              🚀
            </span>
            <h3 className="font-bold text-lg text-neutral">Deliver Completed Work</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <FiX />
          </button>
        </div>

        <p className="text-xs text-base-content/70 leading-relaxed">
          Provide a summary of your completed work, source files, and links for your peer to review. Once submitted, the buyer can accept and finalize payment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Submission Notes */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Work Summary & Instructions
            </label>
            <div className="relative">
              <textarea
                rows={4}
                required
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Describe what you completed, how to test/run the code, or key deliverables..."
                className="textarea textarea-bordered w-full rounded-xl text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Deliverable File URL */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Deliverable URL (GitHub / Google Drive / Dropbox / Figma)
            </label>
            <div className="relative">
              <FiLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://github.com/your-username/project or drive link"
                className="input input-sm input-bordered w-full pl-10 rounded-xl text-xs"
              />
            </div>
            <span className="text-[11px] text-base-content/50 mt-1 block">
              Ensure the link has public viewing permissions enabled.
            </span>
          </div>

          {/* Action buttons */}
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
              className="btn btn-primary btn-sm rounded-lg gap-2 text-white font-bold"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <FiUploadCloud /> Submit Delivery
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
