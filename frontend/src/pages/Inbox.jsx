import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAcceptedBarters } from '../services/api';

const Inbox = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [barters, setBarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBarters = async () => {
            try {
                const { data } = await fetchAcceptedBarters();
                setBarters(data);
            } catch (err) {
                console.error('Failed to load barters:', err);
                setError('Could not load your active barters. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadBarters();
    }, []);

    // Determine the current user's id, supporting both id and _id shapes
    const myId = user?._id || user?.id;

    const getPartner = (barter) => {
        const senderId = barter.senderId?._id || barter.senderId?.id;
        return senderId === myId ? barter.receiverId : barter.senderId;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <svg
                        className="h-8 w-8 animate-spin text-indigo-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                    <span className="text-sm">Loading your active barters…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        📬 Inbox
                    </h1>
                    <p className="mt-1 text-slate-400 text-sm">
                        All your active barter agreements — click <strong>Chat Now</strong> to
                        continue the conversation.
                    </p>
                </div>

                {/* Error state */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-700 bg-red-900/20 px-4 py-3 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!error && barters.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 py-20 text-center">
                        <span className="text-5xl mb-4">🤝</span>
                        <h2 className="text-lg font-semibold text-slate-200">
                            No active barters yet
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 max-w-xs">
                            Once someone accepts one of your barter requests (or you accept
                            theirs), it will appear here.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors px-5 py-2 text-sm font-medium text-white"
                        >
                            Find Skills to Barter
                        </button>
                    </div>
                )}

                {/* Barter cards */}
                {barters.length > 0 && (
                    <ul className="space-y-4">
                        {barters.map((barter) => {
                            const partner = getPartner(barter);
                            const partnerId = partner?._id || partner?.id;

                            return (
                                <li
                                    key={barter._id}
                                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-indigo-700 transition-colors"
                                >
                                    {/* Partner info */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Avatar */}
                                        <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-700 flex items-center justify-center text-lg font-bold uppercase">
                                            {partner?.name?.[0] ?? '?'}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-white truncate">
                                                {partner?.name ?? 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {partner?.email}
                                            </p>

                                            {/* Skills being traded */}
                                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                <span className="rounded-full bg-emerald-900/40 border border-emerald-700 text-emerald-300 px-2.5 py-0.5">
                                                    🎓 You get: {barter.skillRequested}
                                                </span>
                                                <span className="rounded-full bg-sky-900/40 border border-sky-700 text-sky-300 px-2.5 py-0.5">
                                                    🛠️ You give: {barter.skillOfferedInReturn}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status badge + Chat button */}
                                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                        <span className="rounded-full bg-green-900/40 border border-green-700 text-green-300 text-xs px-2.5 py-0.5 font-medium">
                                            ✅ Active
                                        </span>
                                        <button
                                            onClick={() => navigate(`/chat/${partnerId}`)}
                                            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors px-4 py-2 text-sm font-medium text-white whitespace-nowrap"
                                        >
                                            💬 Chat Now
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Inbox;
