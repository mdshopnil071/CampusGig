import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-base-100 rounded-3xl border border-base-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mx-auto shadow-xs">
          🎓
        </span>
        <h2 className="text-2xl font-black text-neutral tracking-tight">
          Welcome to CampusGig
        </h2>
        <p className="text-xs text-base-content/70">
          Sign in to access your student freelance dashboard & orders
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Email Address
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-base-content/70 uppercase">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-bold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Sign In <FiArrowRight />
            </>
          )}
        </button>
      </form>

      {/* Helper demo banner */}
      <div className="p-3.5 bg-base-200/70 rounded-2xl border border-base-300 text-xs text-base-content/70 space-y-1">
        <div className="font-bold text-neutral flex items-center gap-1.5">
          <FiShield className="text-primary" /> Test Credentials Tip:
        </div>
        <p className="text-[11px]">
          If you are new, click "Sign Up" below to create a verified student account with your university details.
        </p>
      </div>

      <div className="pt-2 text-center text-xs text-base-content/70">
        Don't have an account yet?{' '}
        <Link to="/signup" className="font-bold text-primary hover:underline">
          Create Student Account
        </Link>
      </div>
    </div>
  );
};
