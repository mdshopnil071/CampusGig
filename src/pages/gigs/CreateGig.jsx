import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigsApi } from '../../api/gigsApi';
import { categoriesApi } from '../../api/categoriesApi';
import { DEFAULT_CAMPUS_CATEGORIES } from '../../data/categoriesData';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiDollarSign, FiLayers, FiCheckCircle } from 'react-icons/fi';

export const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 15,
    category_id: DEFAULT_CAMPUS_CATEGORIES[0]?.id || 1,
  });
  const [categories, setCategories] = useState(DEFAULT_CAMPUS_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getCategories({ size: 100 });
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setFormData((prev) => ({
            ...prev,
            category_id: prev.category_id || data[0].id,
          }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'category_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long.');
      return;
    }

    if (formData.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters long.');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error('Price must be greater than 0.');
      return;
    }

    if (!formData.category_id) {
      toast.error('Please select a category.');
      return;
    }

    try {
      setLoading(true);
      const gig = await gigsApi.createGig({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: Number(formData.category_id),
      });

      toast.success('Your gig listing is now live! 🎉');
      navigate(`/gigs/${gig.id}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create gig listing';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Breadcrumb
        items={[
          { label: 'My Gigs', href: '/my-gigs' },
          { label: 'Create New Gig' },
        ]}
      />

      <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-200 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <FiPlusCircle /> Student Seller Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral">
            Publish a New Service Listing
          </h1>
          <p className="text-xs text-base-content/70">
            Showcase your skills to campus peers. State clearly what deliverables are included.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gig Title */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Gig Title (e.g. "I will build a responsive React component or fix styling bugs")
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              maxLength={200}
              value={formData.title}
              onChange={handleChange}
              placeholder="I will develop..."
              className="input input-bordered w-full rounded-2xl text-sm font-semibold bg-base-200/40 focus:bg-base-100"
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
                className="select select-bordered w-full rounded-2xl text-xs bg-base-200/40 focus:bg-base-100 font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon ? `${cat.icon} ` : ''}{cat.name}
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
                  className="input input-bordered w-full pl-9 rounded-2xl text-sm font-black bg-base-200/40 focus:bg-base-100"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Detailed Description & Deliverables (Min 10 characters)
            </label>
            <textarea
              name="description"
              required
              minLength={10}
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your tech stack, what the buyer will receive (e.g. clean code, documentation, walkthrough), and your average turnaround time..."
              className="textarea textarea-bordered w-full rounded-2xl text-xs leading-relaxed bg-base-200/40 focus:bg-base-100"
            />
          </div>

          {/* Integrity Note */}
          <div className="p-4 bg-base-200/60 rounded-2xl border border-base-300 text-xs text-base-content/70 space-y-1">
            <div className="font-bold text-neutral flex items-center gap-1.5">
              <FiCheckCircle className="text-success" /> Reminder on Academic Integrity
            </div>
            <p className="text-[11px]">
              Services offering to do university exams or assignment writeups are prohibited and will result in immediate profile suspension.
            </p>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-sm rounded-xl px-6 font-bold text-white shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                'Publish Gig'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
