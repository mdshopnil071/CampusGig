import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api/usersApi';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiUsers, FiSearch, FiTrash2, FiShield, FiDollarSign } from 'react-icons/fi';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.listUsers({ search: search.trim() || undefined, size: 50 });
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await usersApi.deleteUser(userToDelete.id);
      toast.success('User account deleted.');
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'User Directory' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral">User Directory</h1>
          <p className="text-xs text-base-content/70">
            View registered student freelancers, inspect wallet balances, and manage accounts
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or ID..."
            className="input input-sm input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/50"
          />
        </div>
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
                  <th>Student Name & Email</th>
                  <th>University Affiliation</th>
                  <th>Role</th>
                  <th>Wallet Balance</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-base-content/60">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-base-200/40 transition">
                      <td className="font-mono text-base-content/50">#{u.id}</td>
                      <td>
                        <div className="font-bold text-neutral">{u.full_name}</div>
                        <div className="text-[11px] text-base-content/60">{u.email}</div>
                      </td>
                      <td className="text-base-content/80 max-w-xs truncate">
                        {u.university_name || '—'}
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm text-[10px] font-bold capitalize ${
                            u.role === 'admin'
                              ? 'badge-error text-white'
                              : 'badge-primary badge-outline'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="font-bold text-success">
                        ${u.wallet_balance?.toFixed(2) || '0.00'}
                      </td>
                      <td className="text-base-content/50 text-[11px]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            setUserToDelete(u);
                            setDeleteModalOpen(true);
                          }}
                          className="btn btn-ghost btn-circle btn-xs text-error"
                          title="Delete User"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete User Account?"
        message={`Are you sure you want to delete user account "${userToDelete?.full_name}" (${userToDelete?.email})? This action is permanent.`}
        confirmText="Delete Account"
        confirmVariant="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
};
