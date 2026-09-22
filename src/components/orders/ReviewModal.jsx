import React, { useState } from 'react';
import { reviewsApi } from '../../api/reviewsApi';
import { ordersApi } from '../../api/ordersApi';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';
import { FiStar, FiX } from 'react-icons/fi';

export const ReviewModal = ({ isOpen, onClose, order, onReviewed }) => {
  const { notifyUser, fetchNotifications } = useNotifications();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || comment.trim().length < 3) {
      toast.error('Please write a review of at least 3 characters.');
      return;
    }

    try {
      setLoading(true);
      await reviewsApi.createReview({
        order_id: Number(order.id),
        seller_id: Number(order.seller_id),
        rating: Number(rating),
        comment: comment.trim(),
      });

      // Mark order as completed if not already completed
      if (order.status !== 'completed') {
        await ordersApi.updateOrderStatus(order.id, 'completed');
      }

      notifyUser(
        order.seller_id,
        'Payment Received! 💰',
        `Escrow payment of $${order.amount?.toFixed(2)} for Order #${order.id} has been released to your wallet!`
      );
      fetchNotifications(true);

      toast.success('Thank you for rating your peer! ⭐');
      if (onReviewed) onReviewed();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit review';
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
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center text-sm font-bold border border-amber-200">
              ⭐
            </span>
            <h3 className="font-bold text-lg text-neutral">Rate & Review Peer</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <FiX />
          </button>
        </div>

        <p className="text-xs text-base-content/70">
          Your feedback helps build trusted student reputations on campus. Rate your peer's responsiveness, quality of work, and communication.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interactive Star Rating */}
          <div className="text-center py-2 bg-base-200/50 rounded-2xl border border-base-200">
            <span className="text-xs font-bold text-base-content/60 uppercase block mb-2">
              Select Star Rating
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <FiStar
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-base-content/20'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 block mt-2">
              {rating === 5 && 'Outstanding Work! 🌟'}
              {rating === 4 && 'Great Job! 👍'}
              {rating === 3 && 'Average Delivery 🤝'}
              {rating === 2 && 'Needs Improvement ⚠️'}
              {rating === 1 && 'Unsatisfactory ❌'}
            </span>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Your Review & Comments
            </label>
            <textarea
              rows={3}
              required
              minLength={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the code well-structured? Did they deliver on time? Share your honest thoughts..."
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
              className="btn btn-primary btn-sm rounded-lg gap-2 text-white font-bold"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
