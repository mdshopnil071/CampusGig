import React from 'react';
import { Link } from 'react-router-dom';
import { useSavedGigs } from '../../context/SavedGigsContext';
import { GigCard } from '../../components/gigs/GigCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { FiHeart } from 'react-icons/fi';

export const SavedGigs = () => {
  const { savedGigs, savedCount } = useSavedGigs();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Saved Gigs' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            My Saved Gigs & Wishlist
          </h1>
          <p className="text-xs text-base-content/70">
            {savedCount} services bookmarked for your future academic and project needs
          </p>
        </div>
      </div>

      {savedCount === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="No Saved Gigs"
          description="You haven't bookmarked any peer gigs yet. Click the heart icon on any gig listing to save it here."
          actionLabel="Explore Gigs Marketplace"
          onAction={() => window.location.assign('/gigs')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedGigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};
