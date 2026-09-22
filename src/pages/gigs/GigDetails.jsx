import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gigsApi } from '../../api/gigsApi';
import { ordersApi } from '../../api/ordersApi';
import { reviewsApi } from '../../api/reviewsApi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSavedGigs } from '../../context/SavedGigsContext';
import { GigPackagesTable } from '../../components/gigs/GigPackagesTable';
import { BadgeDisplay } from '../../components/common/BadgeDisplay';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ReportModal } from '../../components/orders/ReportModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  FiHeart,
  FiShare2,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiStar,
  FiAlertTriangle,
  FiDollarSign,
  FiShoppingBag,
} from 'react-icons/fi';

export const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isSaved, toggleSave } = useSavedGigs();
  const { notifyUser, fetchNotifications } = useNotifications();

  const [gig, setGig] = useState(null);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const loadGig = async () => {
      try {
        setLoading(true);
        const data = await gigsApi.getGigById(id);
        setGig(data);

        // Fetch seller reviews if seller_id is present
        if (data.seller_id) {
          try {
            const revs = await reviewsApi.getSellerReviews(data.seller_id, { size: 10 });
            if (Array.isArray(revs)) setSellerReviews(revs);
          } catch (e) {
            console.error('Failed to load seller reviews:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load gig:', err);
        toast.error('Gig not found or removed');
      } finally {
        setLoading(false);
      }
    };

    loadGig();
  }, [id]);

  const handlePlaceOrder = async (pkg) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order.');
      navigate('/login', { state: { from: { pathname: `/gigs/${id}` } } });
      return;
    }

    if (user.id === gig.seller_id) {
      toast.error('You cannot order your own gig.');
      return;
    }

    setSelectedPackage(pkg);
    setOrderModalOpen(true);
  };

  const confirmOrder = async () => {
    try {
      setOrdering(true);
      const amount = selectedPackage ? selectedPackage.price : gig.price;

      const order = await ordersApi.createOrder({
        gig_id: Number(gig.id),
        seller_id: Number(gig.seller_id),
        amount: parseFloat(amount),
      });

      // Best-effort immediate notification dispatch and re-fetch
      notifyUser(
        gig.seller_id,
        'New Order Received! 🛒',
        `${user?.full_name || 'A student'} placed Order #${order.id} on '${gig.title}' for $${parseFloat(amount).toFixed(2)}.`
      );
      fetchNotifications(true);

      toast.success('Order placed successfully! Redirecting to workspace...');
      setOrderModalOpen(false);
      navigate(`/orders/${order.id}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to place order';
      toast.error(msg);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="cards" count={3} />;
  }

  if (!gig) {
    return (
      <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-200">
        <h2 className="text-xl font-bold text-neutral">Gig Not Found</h2>
        <p className="text-xs text-base-content/60 mt-1 mb-4">This listing may have been deleted or does not exist.</p>
        <Link to="/gigs" className="btn btn-primary btn-sm rounded-xl">
          Browse Other Gigs
        </Link>
      </div>
    );
  }

  const seller = gig.seller || {};
  const category = gig.category || {};
  const saved = isSaved(gig.id);

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: 'Browse Gigs', href: '/gigs' },
          { label: category.name || 'Category', href: `/gigs?category_id=${gig.category_id}` },
          { label: gig.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gig Details & Seller Profile */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Gig Header */}
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="badge badge-primary badge-outline text-xs font-bold py-3 px-3 rounded-xl">
                {category.name || 'Micro-Task'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSave(gig)}
                  className={`btn btn-circle btn-sm ${
                    saved ? 'text-red-500 bg-red-50 border-red-200' : 'btn-ghost'
                  }`}
                  title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <FiHeart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-error"
                  title="Report Academic Misconduct or Scam"
                >
                  <FiAlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-neutral leading-tight">
              {gig.title}
            </h1>

            {/* Seller Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-base-200">
              <Link to={`/profile/${seller.id}`}>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-sky-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {seller.full_name ? seller.full_name.charAt(0).toUpperCase() : 'S'}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${seller.id}`}
                  className="font-bold text-sm text-neutral hover:text-primary transition truncate block"
                >
                  {seller.full_name || 'Campus Student'}
                </Link>
                <span className="text-xs text-base-content/60 truncate block">
                  {seller.university_name || 'Verified University Peer'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <FiStar className="fill-amber-400 text-amber-400" />
                <span>4.9 (12 reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-neutral border-b border-base-200 pb-3">
              About This Service
            </h3>
            <div className="text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
              {gig.description}
            </div>
          </div>

          {/* Seller Reputation & Badges */}
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-neutral flex items-center gap-2">
              <FiShield className="text-primary" /> Verified Peer Reputation
            </h3>
            <BadgeDisplay
              reputationScore={98}
              completedCount={14}
              rating={4.9}
              verifiedSkills={['React', 'Python']}
              showReputationCard={true}
            />
          </div>

          {/* Seller Reviews List */}
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="font-extrabold text-lg text-neutral">
                Peer Reviews ({sellerReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <FiStar className="fill-current" /> 4.9 Average
              </div>
            </div>

            {sellerReviews.length === 0 ? (
              <p className="text-xs text-base-content/60 py-4 text-center">
                No reviews yet for this student seller. Be the first to order!
              </p>
            ) : (
              <div className="space-y-4">
                {sellerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-base-200/40 rounded-2xl border border-base-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <FiStar key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-base-content/50">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/80 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Packages & Order Action */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <GigPackagesTable
            basePrice={gig.price}
            onSelectPackage={handlePlaceOrder}
          />

          {/* Safe Purchase Guarantee */}
          <div className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm space-y-2 text-xs text-base-content/70">
            <div className="font-bold text-neutral flex items-center gap-1.5">
              <FiCheckCircle className="text-success" /> CampusGig Peer Protection
            </div>
            <p className="leading-relaxed">
              Funds are safely held until you inspect the delivered files and mark the order complete.
            </p>
          </div>
        </div>
      </div>

      {/* Place Order Confirmation Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-base-100 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-base-200 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                <FiShoppingBag />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-neutral">Confirm Your Order</h3>
                <span className="text-xs text-base-content/60">Peer freelance micro-task</span>
              </div>
            </div>

            <div className="p-4 bg-base-200/60 rounded-2xl border border-base-200 space-y-2">
              <div className="text-xs font-bold text-neutral line-clamp-1">{gig.title}</div>
              <div className="text-xs text-base-content/70 flex justify-between">
                <span>Selected Package:</span>
                <span className="font-bold text-neutral capitalize">
                  {selectedPackage?.name || 'Standard'}
                </span>
              </div>
              <div className="text-xs text-base-content/70 flex justify-between">
                <span>Turnaround:</span>
                <span className="font-bold text-neutral">
                  {selectedPackage?.deliveryDays || 2} Days
                </span>
              </div>
              <div className="divider my-1"></div>
              <div className="flex justify-between items-baseline font-black text-sm text-neutral">
                <span>Total Amount:</span>
                <span className="text-xl text-primary font-black">
                  ${(selectedPackage?.price || gig.price).toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-base-content/60 leading-relaxed">
              By confirming, an active order room will be initialized where you can share project specifications with your peer.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setOrderModalOpen(false)}
                disabled={ordering}
                className="btn btn-ghost btn-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                disabled={ordering}
                className="btn btn-primary btn-sm rounded-xl font-bold text-white gap-1.5"
              >
                {ordering ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  'Place Order Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedUserId={gig.seller_id}
        title={`Report Gig #${gig.id}`}
      />
    </div>
  );
};
