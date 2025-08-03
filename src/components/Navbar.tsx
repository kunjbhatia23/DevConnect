// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, User, Home, Code2, Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-500 hover:text-primary-700 transition-colors">
            <Code2 className="w-8 h-8" />
            <span className="text-xl font-bold">DevConnect</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              // This block now safely handles the user object
              <div className="flex items-center space-x-2">
                <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
                <Link to={`/profile/${user._id}`} className="flex items-center space-x-2 px-3 py-2 rounded-md text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </div>
            ) : (
              // If there's no user, we don't render user-specific links.
              <div className="flex items-center space-x-2"></div>
            )}
            
            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-full text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400 hidden md:inline">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-full text-secondary-600 dark:text-secondary-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;