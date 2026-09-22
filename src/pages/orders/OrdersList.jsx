import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { useAuth } from '../../context/AuthContext';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { FiCheckSquare, FiArrowRight, FiClock, FiDollarSign } from 'react-icons/fi';

export const OrdersList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { size: 50 };
      if (activeTab !== 'all') {
        params.status_filter = activeTab;
      }
      const data = await ordersApi.getOrders(params);
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'My Orders' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            My Orders & Project Rooms
          </h1>
          <p className="text-xs text-base-content/70">
            Track active freelance deliveries, manage payments, and collaborate with your peers
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-base-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'btn-primary text-white shadow-sm'
                : 'btn-ghost text-base-content/70 hover:bg-base-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={FiCheckSquare}
          title="No Orders Found"
          description={
            activeTab === 'all'
              ? 'You have not placed or received any orders yet.'
              : `No orders currently in "${activeTab}" status.`
          }
          actionLabel="Browse Marketplace"
          onAction={() => window.location.assign('/gigs')}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isSeller = order.seller_id === user?.id;
            const isBuyer = order.buyer_id === user?.id;

            return (
              <div
                key={order.id}
                className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-neutral">
                      Order #{order.id}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <span
                      className={`badge badge-sm text-[10px] font-bold ${
                        isSeller
                          ? 'badge-info text-white'
                          : 'badge-secondary text-white'
                      }`}
                    >
                      {isSeller ? 'You are Seller' : 'You are Buyer'}
                    </span>
                  </div>

                  <div className="text-xs text-base-content/60 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    {order.gig_id && (
                      <span>• Gig #{order.gig_id}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-base-content/60 uppercase font-semibold block -mb-0.5">
                      Amount
                    </span>
                    <span className="text-lg font-black text-primary">
                      ${order.amount?.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-primary btn-sm rounded-xl text-white font-bold gap-1 shadow-sm"
                  >
                    Open Room <FiArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
