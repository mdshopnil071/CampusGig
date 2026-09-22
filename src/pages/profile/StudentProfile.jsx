import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import { gigsApi } from '../../api/gigsApi';
import { reviewsApi } from '../../api/reviewsApi';
import { GigCard } from '../../components/gigs/GigCard';
import { BadgeDisplay } from '../../components/common/BadgeDisplay';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ReportModal } from '../../components/orders/ReportModal';
import { FiStar, FiCalendar, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export const StudentProfile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userGigs, setUserGigs] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [uData, gData, rData] = await Promise.allSettled([
          usersApi.getUserById(id),
          gigsApi.getGigs({ size: 10 }),
          reviewsApi.getSellerReviews(id, { size: 20 }),
        ]);

        if (uData.status === 'fulfilled') setUserProfile(uData.value);
        if (gData.status === 'fulfilled' && gData.value?.items) {
          // Filter gigs for this user
          setUserGigs(gData.value.items.filter((g) => g.seller_id === Number(id)));
        }
        if (rData.status === 'fulfilled' && Array.isArray(rData.value)) {
          setUserReviews(rData.value);
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [id]);

  if (loading) return <LoadingSkeleton type="cards" count={3} />;

  if (!userProfile) {
    return (
      <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-200">
        <h2 className="text-xl font-bold text-neutral">Student Profile Not Found</h2>
        <Link to="/gigs" className="btn btn-primary btn-sm rounded-xl mt-3">
          Explore Campus Gigs
        </Link>
      </div>
    );
  }

  const initial = userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: 'Campus Students', href: '/gigs' },
          { label: userProfile.full_name },
        ]}
      />

      {/* Profile Banner Card */}
      <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-sky-600 to-cyan-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20 ring-4 ring-primary/10">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-neutral">{userProfile.full_name}</h1>
                <span className="badge badge-primary badge-outline text-[11px] font-bold capitalize">
                  {userProfile.role}
                </span>
              </div>
              <p className="text-xs font-semibold text-primary mt-0.5">
                {userProfile.university_name || 'Verified University Student'}
              </p>
              <span className="text-[11px] text-base-content/60 flex items-center gap-1 mt-1">
                <FiCalendar className="w-3 h-3" />
                Member since {new Date(userProfile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            className="btn btn-ghost btn-xs text-error rounded-lg gap-1 self-end sm:self-center"
          >
            <FiAlertTriangle /> Report Student
          </button>
        </div>

        {/* Reputation Score & Badges */}
        <div className="pt-6 border-t border-base-200">
          <BadgeDisplay
            reputationScore={98}
            completedCount={userReviews.length}
            rating={4.9}
            verifiedSkills={['React', 'Python', 'Git']}
            showReputationCard={true}
          />
        </div>
      </div>

      {/* Gigs by this student */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-neutral">
          Services Offered by {userProfile.full_name} ({userGigs.length})
        </h2>

        {userGigs.length === 0 ? (
          <p className="text-xs text-base-content/60 bg-base-100 p-6 rounded-2xl border border-base-200 text-center">
            No active public gigs currently published by this student.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userGigs.map((gig) => (
              <GigCard key={gig.id} gig={{ ...gig, seller: userProfile }} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-neutral border-b border-base-200 pb-3 flex items-center gap-2">
          <FiStar className="text-amber-500 fill-current" /> Peer Reviews ({userReviews.length})
        </h3>

        {userReviews.length === 0 ? (
          <p className="text-xs text-base-content/60 py-4 text-center">
            No peer reviews yet for this student.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-base-200/50 rounded-2xl border border-base-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-base-content/50">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-base-content/80 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedUserId={userProfile.id}
        title={`Report User: ${userProfile.full_name}`}
      />
    </div>
  );
};
