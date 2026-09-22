import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { proposalsApi } from '../../api/proposalsApi';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiSend, FiClock, FiTrash2, FiExternalLink } from 'react-icons/fi';

export const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const data = await proposalsApi.getMyProposals({ size: 50 });
      if (Array.isArray(data)) {
        setProposals(data);
      }
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleWithdrawConfirm = async () => {
    if (!selectedProposal) return;

    try {
      setDeleting(true);
      await proposalsApi.deleteProposal(selectedProposal.id);
      toast.success('Proposal withdrawn successfully.');
      setDeleteModalOpen(false);
      setSelectedProposal(null);
      fetchProposals();
    } catch (err) {
      toast.error('Failed to withdraw proposal');
    } finally {
      setDeleting(false);
    }
  };

  const statusColors = {
    pending: 'badge-warning text-neutral',
    accepted: 'badge-success text-white',
    rejected: 'badge-error text-white',
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'My Proposals' }]} />

      <div>
        <h1 className="text-2xl font-black text-neutral">My Submitted Proposals</h1>
        <p className="text-xs text-base-content/70">
          Track the status of bids and cover letters you submitted for campus micro-tasks
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : proposals.length === 0 ? (
        <EmptyState
          icon={FiSend}
          title="No Proposals Submitted"
          description="Browse the open task board and submit competitive bids with your cover letter."
          actionLabel="Browse Open Tasks"
          onAction={() => window.location.assign('/tasks')}
        />
      ) : (
        <div className="space-y-3">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-sm font-bold capitalize text-[10px] ${
                      statusColors[prop.status] || 'badge-ghost'
                    }`}
                  >
                    {prop.status}
                  </span>
                  <span className="text-xs text-base-content/50">
                    Proposal #{prop.id} • Submitted {new Date(prop.created_at).toLocaleDateString()}
                  </span>
                </div>

                <Link
                  to={`/tasks/${prop.task_id}`}
                  className="font-bold text-sm text-neutral hover:text-primary transition flex items-center gap-1"
                >
                  <span>Task #{prop.task_id}</span>
                  <FiExternalLink className="w-3.5 h-3.5 text-base-content/40" />
                </Link>

                <p className="text-xs text-base-content/70 italic line-clamp-2">
                  "{prop.cover_letter}"
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-base-content/50 uppercase font-semibold block">
                    Your Bid
                  </span>
                  <span className="text-base font-black text-primary">
                    ${prop.bid_amount?.toFixed(2)}
                  </span>
                </div>

                {prop.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedProposal(prop);
                      setDeleteModalOpen(true);
                    }}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-error"
                    title="Withdraw Proposal"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Withdraw Proposal?"
        message="Are you sure you want to withdraw this proposal? You can re-apply if the task remains open."
        confirmText="Withdraw"
        confirmVariant="error"
        loading={deleting}
        onConfirm={handleWithdrawConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedProposal(null);
        }}
      />
    </div>
  );
};
