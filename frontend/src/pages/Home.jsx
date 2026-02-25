import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Trade Skills, Not Money.
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          SkillBarter connects people who want to learn with those who love to teach.
          Offer your strengths, request your dream skills, and grow together.
        </p>
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg border border-slate-700 hover:border-indigo-500 text-slate-100 font-medium"
              >
                I already have an account
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;

