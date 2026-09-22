import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { gigsApi } from '../../api/gigsApi';
import { proposalsApi } from '../../api/proposalsApi';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { BadgeDisplay } from '../../components/common/BadgeDisplay';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  FiDollarSign,
  FiBriefcase,
  FiCheckSquare,
  FiSend,
  FiPlusCircle,
  FiArrowRight,
  FiAward,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [gigsCount, setGigsCount] = useState(0);
  const [proposalsCount, setProposalsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, gigsRes, proposalsRes] = await Promise.allSettled([
          ordersApi.getOrders({ size: 5 }),
          gigsApi.getGigs({ size: 100 }),
          proposalsApi.getMyProposals({ size: 100 }),
        ]);

        if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
          setOrders(ordersRes.value);
        }

        if (gigsRes.status === 'fulfilled' && gigsRes.value?.items) {
          const myGigs = gigsRes.value.items.filter((g) => g.seller_id === user?.id);
          setGigsCount(myGigs.length);
        }

        if (proposalsRes.status === 'fulfilled' && Array.isArray(proposalsRes.value)) {
          setProposalsCount(proposalsRes.value.length);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <LoadingSkeleton type="cards" count={4} />;

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'in_progress' || o.status === 'delivered'
  );

  return (
    <div className="space-y-8">
      {/* Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-base-content/70">
            Student Freelance & Micro-Task Overview • {user?.university_name || 'Campus Student'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/gigs/create"
            className="btn btn-primary btn-sm rounded-xl font-bold gap-1.5 text-white shadow-sm"
          >
            <FiPlusCircle /> Post New Gig
          </Link>
          <Link
            to="/skills"
            className="btn btn-outline btn-sm rounded-xl font-bold gap-1.5"
          >
            <FiAward /> Take Skill Quiz
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wallet Balance"
          value={`$${user?.wallet_balance?.toFixed(2) || '0.00'}`}
          subtitle="Available for withdrawal"
          icon={FiDollarSign}
          color="success"
        />

        <StatCard
          title="Active Orders"
          value={activeOrders.length}
          subtitle="Orders in progress"
          icon={FiCheckSquare}
          color="primary"
        />

        <StatCard
          title="My Published Gigs"
          value={gigsCount}
          subtitle="Active campus services"
          icon={FiBriefcase}
          color="info"
        />

        <StatCard
          title="Submitted Proposals"
          value={proposalsCount}
          subtitle="Bids on micro-tasks"
          icon={FiSend}
          color="accent"
        />
      </div>

      {/* Campus Reputation Card */}
      <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-neutral uppercase tracking-wider">
            Your Campus Standing & Badges
          </h3>
          <Link to="/skills" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <HiSparkles /> Unlock More Badges
          </Link>
        </div>
        <BadgeDisplay
          reputationScore={98}
          completedCount={orders.filter((o) => o.status === 'completed').length}
          rating={4.9}
          verifiedSkills={['React', 'Python']}
          showReputationCard={true}
        />
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-base-200 pb-3">
          <h3 className="font-extrabold text-base text-neutral">
            Recent Active Orders ({orders.length})
          </h3>
          <Link
            to="/orders"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All <FiArrowRight />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-xs text-base-content/60">
            No orders found. Browse services or post a micro-task to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => {
              const isSeller = order.seller_id === user?.id;
              return (
                <div
                  key={order.id}
                  className="p-4 bg-base-200/50 hover:bg-base-200/80 rounded-2xl border border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral">
                        Order #{order.id}
                      </span>
                      <OrderStatusBadge status={order.status} />
                      <span className="badge badge-ghost badge-xs font-semibold">
                        {isSeller ? 'Seller' : 'Buyer'}
                      </span>
                    </div>
                    <span className="text-[11px] text-base-content/50 block">
                      Placed: {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-sm font-black text-primary">
                      ${order.amount?.toFixed(2)}
                    </span>
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn btn-primary btn-xs rounded-lg text-white font-bold"
                    >
                      Room →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
