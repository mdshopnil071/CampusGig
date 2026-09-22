import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { deliveriesApi } from '../../api/deliveriesApi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { OrderChatBox } from '../../components/orders/OrderChatBox';
import { DeliveryModal } from '../../components/orders/DeliveryModal';
import { ReviewModal } from '../../components/orders/ReviewModal';
import { ReportModal } from '../../components/orders/ReportModal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  FiCheck,
  FiUploadCloud,
  FiStar,
  FiAlertTriangle,
  FiExternalLink,
  FiClock,
  FiFileText,
  FiDollarSign,
  FiXCircle,
} from 'react-icons/fi';

export const OrderWorkspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { notifyUser, fetchNotifications } = useNotifications();

  const [order, setOrder] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const [orderData, delivsData] = await Promise.all([
        ordersApi.getOrderById(id),
        deliveriesApi.getDeliveriesByOrder(id).catch(() => []),
      ]);
      setOrder(orderData);
      if (Array.isArray(delivsData)) {
        setDeliveries(delivsData);
      }
    } catch (err) {
      console.error('Failed to load order workspace:', err);
      toast.error('Order not found or permission denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  if (loading) return <LoadingSkeleton type="cards" count={2} />;

  if (!order) {
    return (
      <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-200">
        <h2 className="text-xl font-bold text-neutral">Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary btn-sm rounded-xl mt-3">
          Back to Orders
        </Link>
      </div>
    );
  }

  const isSeller = order.seller_id === user?.id;
  const isBuyer = order.buyer_id === user?.id;

  // Status Actions
  const handleStartWorking = async () => {
    try {
      setActionLoading(true);
      await ordersApi.updateOrderStatus(order.id, 'in_progress');
      notifyUser(
        order.buyer_id,
        'Order Accepted! 🚀',
        `${user?.full_name || 'Seller'} accepted Order #${order.id} and started working.`
      );
      fetchNotifications(true);
      toast.success('Order is now in progress! Good luck with delivery.');
      fetchOrderData();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setActionLoading(true);
      await ordersApi.updateOrderStatus(order.id, 'cancelled');
      const otherId = isSeller ? order.buyer_id : order.seller_id;
      notifyUser(
        otherId,
        'Order Cancelled ⚠️',
        `Order #${order.id} was cancelled by ${user?.full_name || 'peer'}.`
      );
      fetchNotifications(true);
      toast.success('Order has been cancelled.');
      setCancelModalOpen(false);
      fetchOrderData();
    } catch (err) {
      toast.error('Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'My Orders', href: '/orders' },
          { label: `Order #${order.id} Workspace` },
        ]}
      />

      {/* Workspace Header */}
      <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-neutral">Order #{order.id}</h1>
            <OrderStatusBadge status={order.status} />
            <span className="badge badge-primary badge-outline text-xs font-bold">
              {isSeller ? 'You are the Seller' : 'You are the Buyer'}
            </span>
          </div>
          <p className="text-xs text-base-content/60">
            Placed on {new Date(order.created_at).toLocaleDateString()} • Total Escrow Amount: ${order.amount?.toFixed(2)}
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setReportModalOpen(true)}
            className="btn btn-ghost btn-sm text-error rounded-xl gap-1 text-xs"
            title="Report violation or dispute"
          >
            <FiAlertTriangle /> Dispute / Report
          </button>

          {order.status === 'pending' && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="btn btn-outline btn-error btn-sm rounded-xl text-xs"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Progress Timeline */}
      <OrderTimeline status={order.status} />

      {/* Main Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Action Panels & Deliveries */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Callout Box */}
          <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-neutral flex items-center gap-2">
              <FiCheck className="text-primary" /> Current Required Action
            </h3>

            {/* If Pending */}
            {order.status === 'pending' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  {isSeller
                    ? 'The buyer has placed this order. Accept the order to begin work.'
                    : 'Awaiting the seller to accept your order and begin working on deliverables.'}
                </p>
                {isSeller && (
                  <button
                    onClick={handleStartWorking}
                    disabled={actionLoading}
                    className="btn btn-primary btn-sm rounded-xl text-white font-bold"
                  >
                    Accept Order & Start Working
                  </button>
                )}
              </div>
            )}

            {/* If In Progress */}
            {order.status === 'in_progress' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  {isSeller
                    ? 'The order is in progress. Once you have finished the code or design, click below to deliver your work.'
                    : 'The student freelancer is actively working on your request. Use the discussion room on the right for updates.'}
                </p>
                {isSeller && (
                  <button
                    onClick={() => setDeliveryModalOpen(true)}
                    className="btn btn-primary btn-sm rounded-xl text-white font-bold gap-1.5"
                  >
                    <FiUploadCloud /> Submit Completed Work
                  </button>
                )}
              </div>
            )}

            {/* If Delivered */}
            {order.status === 'delivered' && (
              <div className="p-4 bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl space-y-3">
                <p className="text-xs text-cyan-900 dark:text-cyan-200 leading-relaxed font-medium">
                  {isBuyer
                    ? 'The seller has submitted the delivery files. Please review the deliverables below and accept to release escrow payment.'
                    : 'Your delivery has been submitted! Awaiting the buyer to review and finalize.'}
                </p>
                {isBuyer && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="btn btn-success btn-sm rounded-xl text-white font-bold gap-1.5"
                    >
                      <FiCheck /> Accept Delivery & Complete Order
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* If Completed */}
            {order.status === 'completed' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <FiCheck className="w-4 h-4" /> Order Successfully Completed!
                </div>
                <p className="text-xs text-emerald-700">
                  Escrow payment has been credited to the student freelancer's wallet. Thank you for maintaining campus academic integrity!
                </p>
                {isBuyer && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="btn btn-outline btn-success btn-xs rounded-lg mt-2 font-bold"
                  >
                    <FiStar /> Edit / Submit Review
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Deliveries History List */}
          <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-neutral flex items-center justify-between border-b border-base-200 pb-3">
              <span>Submitted Deliveries</span>
              <span className="badge badge-ghost badge-sm">{deliveries.length}</span>
            </h3>

            {deliveries.length === 0 ? (
              <p className="text-xs text-base-content/60 py-4 text-center">
                No deliverables submitted yet.
              </p>
            ) : (
              <div className="space-y-4">
                {deliveries.map((deliv, idx) => (
                  <div
                    key={deliv.id}
                    className="p-4 bg-base-200/50 rounded-2xl border border-base-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-neutral">
                      <span>Delivery #{idx + 1}</span>
                      <span className="text-[10px] text-base-content/50">
                        {new Date(deliv.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-base-content/80 whitespace-pre-line leading-relaxed">
                      {deliv.submission_text}
                    </p>

                    {deliv.file_url && (
                      <div className="pt-2">
                        <a
                          href={deliv.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-xs btn-primary gap-1.5 rounded-lg"
                        >
                          <FiExternalLink /> Open Deliverable Link ({deliv.file_url})
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Order Live Discussion Room */}
        <div className="lg:col-span-5">
          <OrderChatBox orderId={order.id} />
        </div>
      </div>

      {/* Modals */}
      <DeliveryModal
        isOpen={deliveryModalOpen}
        orderId={order.id}
        onClose={() => setDeliveryModalOpen(false)}
        onDelivered={fetchOrderData}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        order={order}
        onClose={() => setReviewModalOpen(false)}
        onReviewed={fetchOrderData}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedUserId={isSeller ? order.buyer_id : order.seller_id}
        title={`Report Dispute for Order #${order.id}`}
      />

      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? This action will terminate escrow and stop project tracking."
        confirmText="Yes, Cancel Order"
        confirmVariant="error"
        loading={actionLoading}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};
