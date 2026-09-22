import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigsApi } from '../../api/gigsApi';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiBriefcase, FiPlusCircle, FiEdit2, FiTrash2, FiEye, FiClock } from 'react-icons/fi';

export const MyGigs = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyGigs = async () => {
    try {
      setLoading(true);
      const data = await gigsApi.getGigs({ size: 100 });
      if (data && data.items) {
        // Filter gigs owned by current user (loose comparison by ID or email)
        const myItems = data.items.filter((g) => {
          if (!user) return false;
          const matchId = String(g.seller_id) === String(user.id) || String(g.seller?.id) === String(user.id);
          const matchEmail = user.email && g.seller?.email === user.email;
          return matchId || matchEmail;
        });
        setGigs(myItems);
      }
    } catch (err) {
      console.error('Failed to load my gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyGigs();
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!gigToDelete) return;

    try {
      setDeleting(true);
      await gigsApi.deleteGig(gigToDelete.id);
      toast.success('Gig listing deleted successfully.');
      setDeleteModalOpen(false);
      setGigToDelete(null);
      fetchMyGigs();
    } catch (err) {
      toast.error('Failed to delete gig');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'My Gigs' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral">My Published Gigs</h1>
          <p className="text-xs text-base-content/70">
            Manage your service listings, update pricing tiers, or post new campus offerings
          </p>
        </div>

        <Link
          to="/gigs/create"
          className="btn btn-primary btn-sm rounded-xl font-bold text-white shadow-sm gap-1.5"
        >
          <FiPlusCircle /> Post New Gig
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : gigs.length === 0 ? (
        <EmptyState
          icon={FiBriefcase}
          title="No Gigs Published Yet"
          description="Monetize your coding, design, or tutoring skills by posting your first gig!"
          actionLabel="Create a Gig Now"
          onAction={() => window.location.assign('/gigs/create')}
        />
      ) : (
        <div className="space-y-3">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary badge-outline text-[11px] font-bold">
                    {gig.category?.name || 'Service'}
                  </span>
                  <span className="text-xs text-base-content/50">
                    Created {new Date(gig.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-neutral">{gig.title}</h3>
                <p className="text-xs text-base-content/60 line-clamp-1">
                  {gig.description}
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="text-lg font-black text-primary">
                  ${gig.price?.toFixed(2)}
                </span>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/gigs/${gig.id}`}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary"
                    title="View Listing"
                  >
                    <FiEye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/gigs/${gig.id}/edit`}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-info"
                    title="Edit Listing"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setGigToDelete(gig);
                      setDeleteModalOpen(true);
                    }}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-error"
                    title="Delete Listing"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Gig Listing?"
        message={`Are you sure you want to delete "${gigToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Listing"
        confirmVariant="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setGigToDelete(null);
        }}
      />
    </div>
  );
};
