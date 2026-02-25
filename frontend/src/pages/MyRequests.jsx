import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchIncomingRequests, updateRequestStatus } from '../services/api';

const statusClasses = {
  pending: 'bg-amber-500/20 text-amber-300 border-amber-400/60',
  accepted: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60',
  declined: 'bg-red-500/20 text-red-300 border-red-400/60'
};

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchIncomingRequests();
        setRequests(res.data || []);
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message || 'Failed to load incoming requests.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setActionLoadingId(id);
      setError('');
      const res = await updateRequestStatus(id, status);
      const updated = res.data;

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || 'Failed to update request status.';
      setError(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">My Incoming Requests</h1>
        <p className="text-sm text-slate-400">
          These are barters other people have proposed to you. Accept or decline to keep
          your list tidy.
        </p>
      </header>

      {loading && <p className="text-slate-300">Loading requests...</p>}

      {error && !loading && (
        <div className="mb-4 rounded-md bg-red-900/40 border border-red-500 text-red-100 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <p className="text-slate-400 text-sm">
          No one has requested a barter yet. Once others discover your profile, their
          requests will show up here.
        </p>
      )}

      <section className="space-y-4">
        {requests.map((request) => {
          const sender = request.senderId || {};
          const badgeClass =
            statusClasses[request.status] || statusClasses.pending;

          return (
            <div
              key={request._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm md:text-base">
                    {sender.name || 'Unknown sender'}
                  </h3>
                  {sender.email && (
                    <span className="text-xs text-slate-400">{sender.email}</span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mb-1">
                  <span className="font-medium text-slate-100">They want:</span>{' '}
                  {request.skillRequested}
                </p>
                <p className="text-xs text-slate-300">
                  <span className="font-medium text-slate-100">They offer:</span>{' '}
                  {request.skillOfferedInReturn}
                </p>
              </div>

              <div className="flex items-center gap-3 justify-between md:justify-end">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide ${badgeClass}`}
                >
                  {request.status}
                </span>

                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'accepted')}
                        disabled={actionLoadingId === request._id}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white disabled:opacity-60"
                      >
                        {actionLoadingId === request._id && 'Accepting...'}
                        {actionLoadingId !== request._id && 'Accept'}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'declined')}
                        disabled={actionLoadingId === request._id}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-medium text-white disabled:opacity-60"
                      >
                        {actionLoadingId === request._id && 'Declining...'}
                        {actionLoadingId !== request._id && 'Decline'}
                      </button>
                    </>
                  )}

                  {request.status === 'accepted' && (
                    <button
                      onClick={() => {
                        const sender = request.senderId || {};
                        const otherId = sender._id || sender.id;
                        if (otherId) {
                          navigate(`/chat/${otherId}`);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white"
                    >
                      Chat Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default MyRequests;

