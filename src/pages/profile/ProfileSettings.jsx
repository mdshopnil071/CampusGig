import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UNIVERSITIES } from '../../data/universityData';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiBookOpen, FiDollarSign, FiShield, FiSave } from 'react-icons/fi';

export const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [universityName, setUniversityName] = useState(user?.university_name || UNIVERSITIES[0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    try {
      setSaving(true);
      await updateUser({
        full_name: fullName.trim(),
        university_name: universityName,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Profile Settings' }]} />

      <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-neutral">
            Account & Wallet Settings
          </h1>
          <p className="text-xs text-base-content/70">
            Manage your personal profile information and view your student balance
          </p>
        </div>

        {/* Wallet Balance Widget */}
        <div className="p-6 bg-gradient-to-br from-primary via-sky-600 to-cyan-600 rounded-3xl text-white shadow-md shadow-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-white/70 tracking-wider">
              Current Available Wallet Balance
            </span>
            <div className="text-3xl font-black">
              ${user?.wallet_balance?.toFixed(2) || '0.00'} USD
            </div>
            <p className="text-[11px] text-white/80">
              Earnings from completed micro-tasks are credited automatically to your student wallet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-accent font-bold py-3 px-3 text-xs text-neutral">
              Instant Payouts Enabled
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input input-bordered w-full pl-10 rounded-2xl text-xs font-semibold"
              />
            </div>
          </div>

          {/* Email (Read only) */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Email Address (Cannot be changed)
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="input input-bordered w-full pl-10 rounded-2xl text-xs bg-base-200 text-base-content/60"
              />
            </div>
          </div>

          {/* University Name */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              University Affiliation
            </label>
            <div className="relative">
              <FiBookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <select
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                className="select select-bordered w-full pl-10 rounded-2xl text-xs font-semibold"
              >
                {UNIVERSITIES.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role (Read only) */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              Platform Role
            </label>
            <div className="relative">
              <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                disabled
                value={user?.role?.toUpperCase() || 'STUDENT'}
                className="input input-bordered w-full pl-10 rounded-2xl text-xs font-bold bg-base-200 text-primary capitalize"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm rounded-xl px-6 font-bold text-white shadow-md gap-2"
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
