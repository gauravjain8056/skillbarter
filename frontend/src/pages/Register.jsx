import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skillsOffered: '',
    skillsWanted: '',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        skillsOffered: form.skillsOffered
          ? form.skillsOffered.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        skillsWanted: form.skillsWanted
          ? form.skillsWanted.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        bio: form.bio
      };

      const res = await api.post('/auth/register', payload);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || 'Registration failed. Please check your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-white">Create your SkillBarter account</h2>
        <p className="text-sm text-slate-400 mb-6">
          Offer your skills, discover peers, and start learning together.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-900/40 border border-red-500 text-red-100 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Alex Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Skills Offered (comma-separated)
            </label>
            <input
              type="text"
              name="skillsOffered"
              value={form.skillsOffered}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="JavaScript, UI Design, Public Speaking"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Skills Wanted (comma-separated)
            </label>
            <input
              type="text"
              name="skillsWanted"
              value={form.skillsWanted}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="React, Data Visualization"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Short Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell peers what you’re excited to teach and learn."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium mt-2"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

