import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksApi } from '../../api/tasksApi';
import { categoriesApi } from '../../api/categoriesApi';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskFilter } from '../../components/tasks/TaskFilter';
import { ProposalModal } from '../../components/tasks/ProposalModal';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { FiLayers, FiPlusCircle } from 'react-icons/fi';

export const BrowseTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('open');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Proposal modal state
  const [selectedTask, setSelectedTask] = useState(null);

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          size: 8,
          sort_by: sortBy,
        };
        if (search.trim()) params.search = search.trim();
        if (categoryId) params.category_id = categoryId;
        if (statusFilter) params.status_filter = statusFilter;

        const data = await tasksApi.getTasks(params);
        if (data && data.items) {
          setTasks(data.items);
          setTotalPages(data.pages || 1);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [search, categoryId, statusFilter, sortBy, page]);

  const handleReset = () => {
    setSearch('');
    setCategoryId(null);
    setStatusFilter('open');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Micro-Tasks' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            Student Micro-Task Board
          </h1>
          <p className="text-xs text-base-content/70">
            Browse {totalCount} open tasks looking for peer solutions, code debugging, and design
          </p>
        </div>

        <Link
          to="/tasks/create"
          className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-white shadow-sm hover:shadow self-start sm:self-auto"
        >
          <FiPlusCircle /> Post a Micro-Task
        </Link>
      </div>

      <TaskFilter
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        categoryId={categoryId}
        onCategoryChange={(c) => {
          setCategoryId(c);
          setPage(1);
        }}
        categories={categories}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(sb) => {
          setSortBy(sb);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {loading ? (
        <LoadingSkeleton type="cards" count={6} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={FiLayers}
          title="No Tasks Found"
          description="There are no micro-tasks matching your filters right now."
          actionLabel="Clear Filters"
          onAction={handleReset}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onApply={(t) => setSelectedTask(t)}
              />
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

      {/* Proposal Submission Modal */}
      {selectedTask && (
        <ProposalModal
          isOpen={!!selectedTask}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmitted={() => {
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};
