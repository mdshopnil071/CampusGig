import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tasksApi } from '../../api/tasksApi';
import { ProposalModal } from '../../components/tasks/ProposalModal';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { FiDollarSign, FiCalendar, FiTag, FiSend, FiShield, FiClock } from 'react-icons/fi';

export const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await tasksApi.getTaskById(id);
        setTask(data);
      } catch (err) {
        console.error('Failed to load task:', err);
        toast.error('Task not found');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <LoadingSkeleton type="cards" count={2} />;

  if (!task) {
    return (
      <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-200">
        <h2 className="text-xl font-bold text-neutral">Task Not Found</h2>
        <Link to="/tasks" className="btn btn-primary btn-sm rounded-xl mt-3">
          Browse All Tasks
        </Link>
      </div>
    );
  }

  const isClosed = task.status !== 'open';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumb
        items={[
          { label: 'Micro-Tasks', href: '/tasks' },
          { label: `Task #${task.id}` },
        ]}
      />

      <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-200 shadow-sm space-y-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="badge badge-primary badge-outline text-xs font-bold py-2.5 px-3 rounded-xl">
            Task #{task.id}
          </span>
          <span
            className={`badge text-xs font-bold capitalize py-2.5 px-3 rounded-xl ${
              task.status === 'open'
                ? 'badge-success text-white'
                : 'badge-neutral text-white'
            }`}
          >
            {task.status.replace('_', ' ')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-neutral leading-tight">
          {task.title}
        </h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-base-content/60 block">
              Offered Budget
            </span>
            <div className="text-xl font-black text-emerald-600 flex items-center">
              ${task.budget?.toFixed(2)}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-base-content/60 block">
              Posted Date
            </span>
            <div className="text-xs font-bold text-neutral flex items-center gap-1 mt-1">
              <FiCalendar className="text-primary" />
              {new Date(task.created_at).toLocaleDateString()}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-base-content/60 block">
              Status
            </span>
            <span className="text-xs font-bold capitalize mt-1 block text-neutral">
              {task.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-neutral border-b border-base-200 pb-2">
            Task Description & Requirements
          </h3>
          <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
            {task.description}
          </p>
        </div>

        {/* Integrity Note */}
        <div className="p-4 bg-base-200/60 rounded-2xl border border-base-300 flex items-start gap-3 text-xs text-base-content/70">
          <FiShield className="text-primary w-5 h-5 shrink-0 mt-0.5" />
          <p>
            CampusGig policy: Do not propose services that violate university academic honor codes. Acceptable proposals include code review, debugging assistance, UI design, and tutoring explanations.
          </p>
        </div>

        {/* Apply CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-base-200">
          <Link to="/tasks" className="btn btn-ghost btn-sm rounded-xl">
            ← Back to Tasks
          </Link>

          {!isClosed ? (
            <button
              onClick={() => setProposalModalOpen(true)}
              className="btn btn-primary btn-md rounded-2xl gap-2 font-bold text-white shadow-md hover:shadow-lg"
            >
              <FiSend /> Submit Proposal for ${task.budget?.toFixed(2)}
            </button>
          ) : (
            <span className="badge badge-neutral badge-lg py-4 px-4 font-bold text-xs">
              This task is currently {task.status}
            </span>
          )}
        </div>
      </div>

      {/* Proposal Modal */}
      <ProposalModal
        isOpen={proposalModalOpen}
        task={task}
        onClose={() => setProposalModalOpen(false)}
        onSubmitted={() => {
          setProposalModalOpen(false);
          toast.success('Your proposal has been logged!');
        }}
      />
    </div>
  );
};
