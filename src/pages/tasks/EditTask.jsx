import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksApi } from '../../api/tasksApi';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiEdit3, FiDollarSign } from 'react-icons/fi';

export const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: 20,
    status: 'open',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        const data = await tasksApi.getTaskById(id);
        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            budget: data.budget || 20,
            status: data.status || 'open',
          });
        }
      } catch (err) {
        console.error('Failed to load task:', err);
        toast.error('Task not found');
        navigate('/my-tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await tasksApi.updateTask(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: parseFloat(formData.budget),
        status: formData.status,
      });

      toast.success('Task updated successfully!');
      navigate(`/tasks/${id}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update task';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Breadcrumb
        items={[
          { label: 'My Tasks', href: '/my-tasks' },
          { label: 'Edit Task' },
        ]}
      />

      <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-200 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <FiEdit3 /> Manage Task
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            Edit Task Details
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl text-sm font-semibold"
            />
          </div>

          {/* Budget & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                Offered Budget ($ USD)
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="number"
                  name="budget"
                  required
                  min="1"
                  step="1"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-9 rounded-2xl text-sm font-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                Task Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered w-full rounded-2xl text-xs font-semibold"
              >
                <option value="open">Open (Accepting Proposals)</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              minLength={10}
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full rounded-2xl text-xs leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate('/my-tasks')}
              className="btn btn-ghost btn-sm rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm rounded-xl px-6 font-bold text-white shadow-md"
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
