import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileCard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return (names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2)).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary-500 to-indigo-600" />
      <div className="p-4 text-center border-b border-secondary-200 dark:border-secondary-700">
        <Link to={`/profile/${user._id}`} className="block mt-[-48px] mb-2">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-white dark:border-secondary-800 overflow-hidden bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400 shadow-md">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(user.name)}</span>
            )}
          </div>
        </Link>
        <Link to={`/profile/${user._id}`}>
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-200 hover:text-primary-600 transition-colors">{user.name}</h2>
        </Link>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 px-2 truncate">
          {user.bio || 'Welcome to DevConnect!'}
        </p>
      </div>
      <div className="p-4 text-center">
        <Link to={`/profile/${user._id}`} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
          View My Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;