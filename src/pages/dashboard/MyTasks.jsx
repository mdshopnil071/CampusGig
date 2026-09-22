import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksApi } from '../../api/tasksApi';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiLayers, FiPlusCircle, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

export const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getTasks({ size: 100 });
      if (data && data.items) {
        // Filter tasks owned by current user (loose comparison by ID or email)
        const myItems = data.items.filter((t) => {
          if (!user) return false;
          const matchId = String(t.client_id) === String(user.id) || String(t.client?.id) === String(user.id);
          const matchEmail = user.email && t.client?.email === user.email;
          return matchId || matchEmail;
        });
        setTasks(myItems);
      }
    } catch (err) {
      console.error('Failed to load my tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyTasks();
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      setDeleting(true);
      await tasksApi.deleteTask(taskToDelete.id);
      toast.success('Task removed from board.');
      setDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchMyTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'My Posted Tasks' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral">My Posted Tasks</h1>
          <p className="text-xs text-base-content/70">
            Micro-tasks you posted for students to bid on and solve
          </p>
        </div>

        <Link
          to="/tasks/create"
          className="btn btn-primary btn-sm rounded-xl font-bold text-white shadow-sm gap-1.5"
        >
          <FiPlusCircle /> Post a Micro-Task
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={FiLayers}
          title="No Tasks Posted"
          description="Have a coding bug, research task, or design need? Post a micro-task to get peer bids."
          actionLabel="Post a Task"
          onAction={() => window.location.assign('/tasks/create')}
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-sm font-bold capitalize text-[10px] badge-primary">
                    {task.status}
                  </span>
                  <span className="text-xs text-base-content/50">
                    Task #{task.id} • Posted {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-neutral">{task.title}</h3>
                <p className="text-xs text-base-content/60 line-clamp-1">
                  {task.description}
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-base-content/50 uppercase font-semibold block">
                    Budget
                  </span>
                  <span className="text-base font-black text-emerald-600">
                    ${task.budget?.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary"
                    title="View Task"
                  >
                    <FiEye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-info"
                    title="Edit Task"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setTaskToDelete(task);
                      setDeleteModalOpen(true);
                    }}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-error"
                    title="Delete Task"
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
        title="Delete Micro-Task?"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmText="Delete Task"
        confirmVariant="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
};
