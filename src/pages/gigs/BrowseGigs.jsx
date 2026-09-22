import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gigsApi } from '../../api/gigsApi';
import { categoriesApi } from '../../api/categoriesApi';
import { GigCard } from '../../components/gigs/GigCard';
import { GigFilter } from '../../components/gigs/GigFilter';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { SkillMatcherModal } from '../../components/matching/SkillMatcherModal';
import { FiBriefcase } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export const BrowseGigs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : null;

  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matcherOpen, setMatcherOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesApi.getCategories({ size: 100 });
        if (Array.isArray(res)) setCategories(res);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Gigs when filters or page changes
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          size: 9,
          sort_by: sortBy,
        };
        if (search.trim()) params.search = search.trim();
        if (categoryId) params.category_id = categoryId;

        const data = await gigsApi.getGigs(params);
        if (data && data.items) {
          setGigs(data.items);
          setTotalPages(data.pages || 1);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Failed to load gigs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [search, categoryId, sortBy, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId(null);
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Browse Gigs' }]} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            Explore Campus Services & Gigs
          </h1>
          <p className="text-xs text-base-content/70">
            Showing {totalCount} verified student service listings across universities
          </p>
        </div>

        <button
          onClick={() => setMatcherOpen(true)}
          className="btn btn-accent btn-sm rounded-xl font-bold gap-1.5 shadow-sm hover:shadow text-neutral self-start sm:self-auto"
        >
          <HiSparkles /> Smart Matcher
        </button>
      </div>

      {/* Filter Bar */}
      <GigFilter
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setPage(1);
        }}
        categories={categories}
        sortBy={sortBy}
        onSortChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Gigs Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={9} />
      ) : gigs.length === 0 ? (
        <EmptyState
          icon={FiBriefcase}
          title="No Gigs Found"
          description="We couldn't find any student gigs matching your filters. Try clearing your search or category."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 150, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Skill Matcher Modal */}
      <SkillMatcherModal
        isOpen={matcherOpen}
        onClose={() => setMatcherOpen(false)}
        gigs={gigs}
      />
    </div>
  );
};
