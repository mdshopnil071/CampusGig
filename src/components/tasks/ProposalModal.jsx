import React, { useState } from 'react';
import { proposalsApi } from '../../api/proposalsApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSend, FiX, FiDollarSign } from 'react-icons/fi';

export const ProposalModal = ({ isOpen, onClose, task, onSubmitted }) => {
  const { isAuthenticated } = useAuth();
  const [bidAmount, setBidAmount] = useState(task?.budget || 10);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to submit a proposal.');
      return;
    }

    if (!bidAmount || bidAmount <= 0) {
      toast.error('Please enter a valid bid amount.');
      return;
    }

    if (!coverLetter || coverLetter.trim().length < 10) {
      toast.error('Cover letter must be at least 10 characters long.');
      return;
    }

    try {
      setLoading(true);
      await proposalsApi.createProposal({
        task_id: task.id,
        bid_amount: parseFloat(bidAmount),
        cover_letter: coverLetter.trim(),
      });

      toast.success('Your proposal has been submitted to the client! 🎉');
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit proposal';
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
              📝
            </span>
            <h3 className="font-bold text-lg text-neutral">Submit Task Proposal</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <FiX />
          </button>
        </div>

        {/* Task Summary Banner */}
        <div className="p-3.5 bg-base-200/60 rounded-xl border border-base-200 space-y-1">
          <div className="font-bold text-xs text-neutral truncate">{task.title}</div>
          <div className="text-xs text-base-content/70 flex items-center justify-between">
            <span>Client's Target Budget:</span>
            <span className="font-extrabold text-emerald-600">${task.budget?.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bid Amount Input */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Your Proposed Bid ($ USD)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="number"
                step="1"
                min="1"
                required
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="input input-bordered w-full pl-9 rounded-xl text-sm font-bold"
                placeholder="Enter bid amount"
              />
            </div>
            <span className="text-[11px] text-base-content/60 mt-1 block">
              You can match the client's budget or propose your own student rate.
            </span>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Cover Letter / Solution Pitch (Min 10 characters)
            </label>
            <textarea
              rows={4}
              required
              minLength={10}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain how your technical skills, relevant coursework, or past projects will help solve this task quickly..."
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
                <>
                  <FiSend /> Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
