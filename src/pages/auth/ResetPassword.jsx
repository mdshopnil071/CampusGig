import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { FiLock, FiKey, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const location = useLocation();
  const [resetToken, setResetToken] = useState(location.state?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resetToken.trim()) {
      toast.error('Please enter the reset token.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.resetPassword({
        reset_token: resetToken.trim(),
        new_password: newPassword,
      });

      toast.success(res.message || 'Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid or expired reset token';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-base-100 rounded-3xl border border-base-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mx-auto">
          🔒
        </span>
        <h2 className="text-2xl font-black text-neutral tracking-tight">
          Set New Password
        </h2>
        <p className="text-xs text-base-content/70">
          Enter your password reset token and choose a secure new password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Reset Token
          </label>
          <div className="relative">
            <FiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              required
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Paste reset token here"
              className="input input-bordered w-full pl-10 rounded-xl text-xs font-mono bg-base-200/40 focus:bg-base-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            New Password (min 8 chars)
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full rounded-xl text-white font-bold gap-2 shadow-md hover:shadow-lg mt-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <FiCheckCircle /> Reset Password
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-base-content/70 pt-2 border-t border-base-200">
        Back to{' '}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};
