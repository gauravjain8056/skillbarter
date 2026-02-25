import React, { useEffect, useState } from 'react';
import api from '../services/api';
import UserCard from '../components/UserCard';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get('/users');
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || 'Failed to load users.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">SkillBarter Dashboard</h1>
          <p className="text-sm text-slate-400">
            Browse people offering and requesting skills. Reach out and start trading!
          </p>
        </div>
      </header>

      {loading && <p className="text-slate-300">Loading peers...</p>}

      {error && !loading && (
        <div className="mb-4 rounded-md bg-red-900/40 border border-red-500 text-red-100 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="text-slate-400">No users found yet. Be the first to create a profile!</p>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard key={user._id || user.id} user={user} />
        ))}
      </section>
    </main>
  );
};

export default Dashboard;

