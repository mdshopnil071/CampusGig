import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../api/categoriesApi';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getCategories({ size: 100 });
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Category name is required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
        });
        toast.success('Category updated successfully!');
      } else {
        await categoriesApi.createCategory({
          name: name.trim(),
          description: description.trim(),
        });
        toast.success('Category created successfully!');
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save category';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      await categoriesApi.deleteCategory(categoryToDelete.id);
      toast.success('Category deleted successfully.');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'Manage Categories' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral">Category Management</h1>
          <p className="text-xs text-base-content/70">
            Create, update, or remove marketplace service categories
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn btn-primary btn-sm rounded-xl font-bold text-white shadow-sm gap-1.5"
        >
          <FiPlus /> Add New Category
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : (
        <div className="bg-base-100 rounded-3xl border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead className="bg-base-200/60 text-base-content/70 text-[11px] uppercase">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-base-content/60">
                      No categories found. Click "Add New Category" above.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-base-200/40 transition">
                      <td className="font-mono text-base-content/50">#{cat.id}</td>
                      <td className="font-bold text-neutral">{cat.name}</td>
                      <td className="text-base-content/70 max-w-xs truncate">
                        {cat.description || '—'}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            className="btn btn-ghost btn-circle btn-xs text-info"
                            title="Edit Category"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setDeleteModalOpen(true);
                            }}
                            className="btn btn-ghost btn-circle btn-xs text-error"
                            title="Delete Category"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-base-100 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-base-200 space-y-4">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="font-bold text-lg text-neutral">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="btn btn-ghost btn-circle btn-sm">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Web Development"
                  className="input input-bordered w-full rounded-2xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of tasks under this category..."
                  className="textarea textarea-bordered w-full rounded-2xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-ghost btn-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-sm rounded-xl font-bold text-white shadow-sm"
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : editingCategory ? (
                    'Save Changes'
                  ) : (
                    'Create Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Category?"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
        confirmText="Delete"
        confirmVariant="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
};
