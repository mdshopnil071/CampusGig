import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UNIVERSITIES } from '../../data/universityData';
import { FiUser, FiMail, FiLock, FiBookOpen, FiArrowRight, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    university_name: UNIVERSITIES[0],
    agreeTerms: true,
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      toast.error('You must agree to the Academic Integrity pledge.');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    const res = await signup({
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      university_name: formData.university_name,
    });
    setLoading(false);

    if (res.success) {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-base-100 rounded-3xl border border-base-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-sky-600 to-cyan-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md shadow-primary/20">
          🎓
        </span>
        <h2 className="text-2xl font-black text-neutral tracking-tight">
          Join CampusGig
        </h2>
        <p className="text-xs text-base-content/70">
          Sign up to monetize your technical skills or hire fellow university peers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Full Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Tanvir Ahmed"
              className="input input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            University / Personal Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              className="input input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
            />
          </div>
        </div>

        {/* University Name */}
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Your University / College
          </label>
          <div className="relative">
            <FiBookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <select
              name="university_name"
              value={formData.university_name}
              onChange={handleChange}
              className="select select-bordered w-full pl-10 rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
            >
              {UNIVERSITIES.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Password (min 8 characters)
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/40 focus:bg-base-100"
            />
          </div>
        </div>

        {/* Academic Integrity Checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="checkbox checkbox-primary checkbox-xs mt-0.5"
            id="agreeTerms"
          />
          <label htmlFor="agreeTerms" className="text-xs text-base-content/70 leading-tight cursor-pointer">
            I pledge to uphold <span className="font-bold text-neutral">Academic Integrity</span> and agree not to ghostwrite graded exams or assignments.
          </label>
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
              Register as Student <FiArrowRight />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-base-content/70">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
};
