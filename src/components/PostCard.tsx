// src/components/PostCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface Post {
  _id: string;
  text: string;
  image?: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <Link to={`/profile/${post.author._id}`} className="flex-shrink-0">
            {post.author.profilePicture ? (
              <img src={post.author.profilePicture} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-lg">
                {getInitials(post.author.name)}
              </div>
            )}
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <Link
                to={`/profile/${post.author._id}`}
                className="font-semibold text-secondary-900 hover:text-primary-600 transition-colors truncate"
              >
                {post.author.name}
              </Link>
              <span className="text-secondary-400">·</span>
              <div className="flex items-center text-secondary-500 text-sm">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            {post.text && 
                <p className="text-secondary-800 leading-relaxed whitespace-pre-wrap">
                    {post.text}
                </p>
            }
          </div>
        </div>
      </div>
      
      {post.image && (
        <div className="mt-2 -mb-2 bg-secondary-50">
            <img src={post.image} alt="Post content" className="w-full max-h-[600px] object-contain" />
        </div>
      )}
    </div>
  );
};

export default PostCard;