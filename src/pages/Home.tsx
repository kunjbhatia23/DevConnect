import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { MessageSquare, Users, Rss } from 'lucide-react';

interface Post {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      setPosts(response.data.data.posts);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to refresh posts');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-center space-x-4">
          <Users className="w-12 h-12 opacity-80" />
          <div>
            <h1 className="text-2xl font-bold">
              {user ? `Welcome back, ${user.name}!` : 'Welcome to DevConnect'}
            </h1>
            <p className="text-primary-200 mt-1">
              {user ? 'Share your thoughts with the professional community.' : 'Connect with developers and share your journey.'}
            </p>
          </div>
        </div>
      </div>

      {/* Post Form - Only show if logged in */}
      {user && <PostForm onPostCreated={fetchPosts} />}

      {/* Posts Feed */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 py-4">
          <Rss className="w-6 h-6 text-secondary-500" />
          <h2 className="text-xl font-bold text-secondary-800">Community Feed</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8 text-center">
            <MessageSquare className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">The feed is empty</h3>
            <p className="text-secondary-600">
              {user ? 'Be the first to share something!' : 'Sign in to see posts from the community.'}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;