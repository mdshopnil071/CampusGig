import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { FiMail, FiArrowRight, FiKey, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await authApi.forgotPassword(email.trim());
      toast.success(res.message || 'Password reset token generated!');
      if (res.reset_token) {
        setResetToken(res.reset_token);
      }
    } catch (err) {
      toast.error('Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (resetToken) {
      navigator.clipboard.writeText(resetToken);
      toast.success('Reset token copied to clipboard!');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-base-100 rounded-3xl border border-base-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <span className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto border border-amber-200">
          🔑
        </span>
        <h2 className="text-2xl font-black text-neutral tracking-tight">
          Forgot Password
        </h2>
        <p className="text-xs text-base-content/70">
          Enter your registered email address to receive your password reset token
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Registered Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="input input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full rounded-xl text-white font-bold gap-2 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              Request Reset Token <FiArrowRight />
            </>
          )}
        </button>
      </form>

      {/* Generated Token Box */}
      {resetToken && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Reset Token Generated:</span>
            <button
              onClick={copyToken}
              className="btn btn-ghost btn-xs text-emerald-700 gap-1 hover:bg-emerald-100"
            >
              <FiCopy /> Copy
            </button>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-emerald-300 font-mono text-[11px] break-all text-neutral select-all">
            {resetToken}
          </div>
          <button
            onClick={() => navigate('/reset-password', { state: { token: resetToken } })}
            className="btn btn-success btn-sm w-full rounded-xl text-white font-bold gap-1.5"
          >
            <FiKey /> Proceed to Set New Password
          </button>
        </div>
      )}

      <div className="text-center text-xs text-base-content/70 pt-2 border-t border-base-200">
        Remembered your password?{' '}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};
