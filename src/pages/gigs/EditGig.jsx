import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigsApi } from '../../api/gigsApi';
import { categoriesApi } from '../../api/categoriesApi';
import { DEFAULT_CAMPUS_CATEGORIES } from '../../data/categoriesData';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { FiEdit2, FiDollarSign } from 'react-icons/fi';

export const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 10,
    category_id: DEFAULT_CAMPUS_CATEGORIES[0]?.id || 1,
  });
  const [categories, setCategories] = useState(DEFAULT_CAMPUS_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gigData, catsData] = await Promise.all([
          gigsApi.getGigById(id),
          categoriesApi.getCategories({ size: 100 }),
        ]);

        if (Array.isArray(catsData)) setCategories(catsData);
        if (gigData) {
          setFormData({
            title: gigData.title || '',
            description: gigData.description || '',
            price: gigData.price || 10,
            category_id: gigData.category_id || (catsData[0]?.id || ''),
          });
        }
      } catch (err) {
        console.error('Failed to load gig data:', err);
        toast.error('Failed to load gig for editing');
        navigate('/my-gigs');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'category_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await gigsApi.updateGig(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: Number(formData.category_id),
      });

      toast.success('Gig updated successfully!');
      navigate(`/gigs/${id}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update gig';
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
          { label: 'My Gigs', href: '/my-gigs' },
          { label: 'Edit Gig' },
        ]}
      />

      <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-200 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <FiEdit3 /> Manage Listing
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            Edit Gig Details
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Gig Title
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              maxLength={200}
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl text-sm font-semibold"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                Category
              </label>
              <select
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="select select-bordered w-full rounded-2xl text-xs font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                Starting Base Price ($ USD)
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-9 rounded-2xl text-sm font-black"
                />
              </div>
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
              onClick={() => navigate('/my-gigs')}
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
