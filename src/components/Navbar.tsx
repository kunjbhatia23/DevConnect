import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Changed 'CodeXml' to 'Code2' which is a valid icon
import { LogOut, User, Home, Code2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            {/* Replaced the invalid icon with the new Code2 icon */}
            <Code2 className="w-8 h-8" />
            <span className="text-xl font-bold">DevConnect</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-100 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-100 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-secondary-600 hidden md:inline">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-secondary-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;