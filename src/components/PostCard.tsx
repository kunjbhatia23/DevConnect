import React from 'react';
import { Link } from 'react-router-dom';
import { User, Clock } from 'lucide-react';

interface Post {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link
              to={`/profile/${post.author._id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {post.author.name}
            </Link>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;