import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { User, Calendar, MessageSquare } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio: string;
  createdAt: string;
}

interface Post {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError('');

        // Fetch user profile and posts in parallel
        const [profileResponse, postsResponse] = await Promise.all([
          axios.get(`/users/${id}`),
          axios.get(`/posts/user/${id}`)
        ]);

        setProfile(profileResponse.data.data.user);
        setPosts(postsResponse.data.data.posts);
        setLoading(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError('User not found');
        } else {
          setError(error.response?.data?.message || 'Failed to load profile');
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">{error || 'The user you\'re looking for doesn\'t exist.'}</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === profile._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                {isOwnProfile && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Your Profile
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Joined {formatJoinDate(profile.createdAt)}</span>
              </div>
              
              {profile.bio && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {isOwnProfile ? 'Your Posts' : `Posts by ${profile.name}`}
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {isOwnProfile ? 'Share your first post to get started!' : `${profile.name} hasn't posted anything yet.`}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;