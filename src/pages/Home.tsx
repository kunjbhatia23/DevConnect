import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import ProfileCard from '../components/ProfileCard';
import NewsWidget from '../components/NewsWidget';
import { MessageSquare, Rss } from 'lucide-react';

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
          <p className="mt-4 text-secondary-600 dark:text-secondary-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
        <ProfileCard />
      </aside>

      <main className="col-span-1 lg:col-span-8 xl:col-span-6">
        {user && <PostForm onPostCreated={fetchPosts} />}

        <div className={`space-y-4 ${user ? 'mt-6' : ''}`}>
          <div className="flex items-center space-x-2">
            <Rss className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
            <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200">Community Feed</h2>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {posts.length === 0 && !loading ? (
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 p-8 text-center">
              <MessageSquare className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-200 mb-2">The feed is empty</h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                {user ? 'Be the first to share something!' : 'Sign in to see posts from the community.'}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </main>

       <aside className="hidden xl:block xl:col-span-3 sticky top-24">
         <NewsWidget />
       </aside>

    </div>
  );
};

export default Home;