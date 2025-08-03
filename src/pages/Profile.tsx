import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { Calendar, MessageSquare, Camera } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio: string;
  createdAt: string;
  profilePicture?: string;
}

interface Post {
  _id: string;
  text: string;
  images?: string[];
  likes: string[];
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, setUser: setCurrentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError('');
        const [profileResponse, postsResponse] = await Promise.all([
          axios.get(`/users/${id}`),
          axios.get(`/posts/user/${id}`)
        ]);
        setProfile(profileResponse.data.data.user);
        setPosts(postsResponse.data.data.posts);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);
  
  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(currentPosts => 
      currentPosts.map(p => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts(currentPosts => currentPosts.filter(p => p._id !== postId));
  };

  const handlePfpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 2) {
        alert("Profile picture cannot exceed 2MB.");
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.put('/users/pfp', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        const updatedUser = res.data.data.user;
        setProfile(updatedUser);
        if (currentUser && currentUser._id === updatedUser._id) {
            setCurrentUser(updatedUser);
        }
      }
    } catch (err) {
      console.error("Failed to update profile picture", err);
      alert("Failed to update profile picture. Please try again.");
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return (names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">{error || 'Profile not found.'}</h2>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === profile._id;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-primary-500 to-indigo-600" />
        <div className="px-6 pb-6 relative">
          <div className="flex items-end -mt-16">
            <input type="file" accept="image/png, image/jpeg" onChange={handlePfpChange} className="hidden" ref={fileInputRef} />
            <div
              onClick={() => isOwnProfile && fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-full border-4 border-white dark:border-secondary-800 overflow-hidden group relative bg-primary-100
                          flex items-center justify-center text-5xl font-bold text-primary-600 dark:text-primary-400
                          ${isOwnProfile ? 'cursor-pointer' : ''}`}
            >
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(profile.name)}</span>
              )}
              {isOwnProfile && 
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center text-white transition-opacity">
                    <Camera size={32} />
                </div>
              }
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-200">{profile.name}</h1>
              {isOwnProfile && <span className="px-3 py-1 bg-primary-100 dark:bg-primary-500/20 text-primary-800 dark:text-primary-300 text-xs font-medium rounded-full">This is you</span>}
            </div>
            
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed my-2">
              {profile.bio}
            </p>

            <div className="flex items-center space-x-6 text-sm text-secondary-500 dark:text-secondary-400 mt-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Joined in {formatJoinDate(profile.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1.5" />
                <span><span className="font-semibold text-secondary-800 dark:text-secondary-200">{posts.length}</span> {posts.length === 1 ? 'post' : 'posts'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 pb-4">
          {isOwnProfile ? 'Your Posts' : `Posts by ${profile.name}`}
        </h2>
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post._id} post={post} onPostUpdate={handlePostUpdate} onPostDelete={handlePostDelete} />)
        ) : (
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-8 text-center">
            <MessageSquare className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-200 mb-2">No posts yet</h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {isOwnProfile ? 'Share your first post to get started!' : `${profile.name} hasn't posted anything yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;