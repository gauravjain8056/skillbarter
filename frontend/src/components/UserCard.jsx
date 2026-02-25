import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendBarterRequest } from '../services/api';

const UserCard = ({ user }) => {
  const { user: currentUser, isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    skillRequested: '',
    skillOfferedInReturn: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const isSelf =
    currentUser && (currentUser.id === user._id || currentUser.id === user.id);

  const openModal = () => {
    setFeedback('');
    setError('');
    setForm({
      skillRequested: '',
      skillOfferedInReturn: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!submitting) {
      setIsModalOpen(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skillRequested || !form.skillOfferedInReturn) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setFeedback('');

      await sendBarterRequest({
        receiverId: user._id || user.id,
        skillRequested: form.skillRequested,
        skillOfferedInReturn: form.skillOfferedInReturn
      });

      setFeedback('Barter request sent!');
      setTimeout(() => {
        setIsModalOpen(false);
      }, 900);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || 'Failed to send barter request.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-500 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <span className="text-xs text-slate-400 truncate max-w-[140px] text-right">
            {user.email}
          </span>
        </div>

        {user.bio && <p className="text-sm text-slate-300 mb-3">{user.bio}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <h4 className="font-semibold text-indigo-400 mb-1">Skills Offered</h4>
            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {user.skillsOffered.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-full bg-slate-800 text-slate-100 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No skills listed.</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-emerald-400 mb-1">Skills Wanted</h4>
            {user.skillsWanted && user.skillsWanted.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {user.skillsWanted.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-full bg-slate-800 text-slate-100 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No skills requested.</p>
            )}
          </div>
        </div>

        {isAuthenticated && !isSelf && (
          <div className="flex justify-end">
            <button
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-sm"
              onClick={openModal}
            >
              Barter
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-1">
              Propose a barter with {user.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tell them what you want to learn and what you can offer in return.
            </p>

            {error && (
              <div className="mb-3 rounded-md bg-red-900/40 border border-red-500 text-red-100 px-3 py-1.5 text-xs">
                {error}
              </div>
            )}

            {feedback && (
              <div className="mb-3 rounded-md bg-emerald-900/30 border border-emerald-500 text-emerald-100 px-3 py-1.5 text-xs">
                {feedback}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  Skill you want from them
                </label>
                <input
                  type="text"
                  name="skillRequested"
                  value={form.skillRequested}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Advanced React, UI Design review"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  Skill you offer in return
                </label>
                <input
                  type="text"
                  name="skillOfferedInReturn"
                  value={form.skillOfferedInReturn}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. JavaScript mentoring, portfolio review"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 rounded-lg border border-slate-600 text-xs text-slate-200 hover:border-slate-400"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-xs font-medium text-white"
                >
                  {submitting ? 'Sending...' : 'Send request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;

