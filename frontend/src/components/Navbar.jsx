import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
            SB
          </span>
          <span className="font-semibold text-lg tracking-tight">SkillBarter</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <span className="text-sm text-slate-300 hidden sm:inline">
              Logged in as <span className="font-medium text-white">{user?.name}</span>
            </span>
          )}

          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'
              }`
            }
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/requests"
              className={({ isActive }) =>
                `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              My Requests
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              📬 Inbox
            </NavLink>
          )}

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

