import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { MessageSquare, Users } from 'lucide-react';

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        setPosts(response.data.data.posts);
        setLoading(false);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        setPosts(response.data.data.posts);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to refresh posts');
      }
    };
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user ? `Welcome back, ${user.name}!` : 'Welcome to Mini LinkedIn'}
              </h1>
              <p className="text-gray-600">
                {user ? 'Share your thoughts with the community' : 'Connect with professionals and share your journey'}
              </p>
            </div>
          </div>
        </div>

        {/* Post Form - Only show if logged in */}
        {user && <PostForm onPostCreated={handlePostCreated} />}

        {/* Posts Feed */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {user ? 'Be the first to share something!' : 'Sign in to see posts from the community'}
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

export default Home;