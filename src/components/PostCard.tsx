import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from './CommentSection';
import { Clock, X, ThumbsUp, MessageCircle, Send, Repeat, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user._id) : false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setIsLiked(user ? likes.includes(user._id) : false);
  }, [user, likes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewingPost) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') setViewingPost(null);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    if (viewingPost) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [viewingPost]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const newLikes = isLiked ? likes.filter(id => id !== user._id) : [...likes, user._id];
      setLikes(newLikes);
      setIsLiked(!isLiked);
      await axios.put(`/posts/${post._id}/like`);
    } catch (error) {
      console.error('Failed to like post', error);
      setLikes(post.likes);
    }
  };
  
  const openImageViewer = (postToView: Post, index: number) => {
    setViewingPost(postToView);
    setCurrentImageIndex(index);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewingPost && viewingPost.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % viewingPost.images!.length);
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewingPost && viewingPost.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + viewingPost.images!.length) % viewingPost.images!.length);
    }
  };

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

  const hasImages = post.images && post.images.length > 0;

  return (
    <>
      {viewingPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={() => setViewingPost(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-secondary-300 z-[60]"
            onClick={() => setViewingPost(null)}
          >
            <X size={32} />
          </button>
          <div 
            className="w-full h-full lg:h-[90%] lg:w-[90%] max-w-[1400px] flex flex-col lg:flex-row shadow-2xl lg:rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full lg:w-2/3 h-1/2 lg:h-full bg-black flex items-center justify-center relative">
              <img src={viewingPost.images?.[currentImageIndex]} alt="Post content" className="max-w-full max-h-full object-contain" />
              {viewingPost.images && viewingPost.images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-colors"><ChevronLeft size={28} /></button>
                  <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-colors"><ChevronRight size={28} /></button>
                </>
              )}
            </div>
            <div className="w-full lg:w-1/3 h-1/2 lg:h-full flex flex-col bg-white overflow-y-auto">
              <div className="p-4 border-b">
                 <div className="flex items-center space-x-3">
                  <Link to={`/profile/${viewingPost.author._id}`} className="flex-shrink-0">
                    {viewingPost.author.profilePicture ? <img src={viewingPost.author.profilePicture} alt={viewingPost.author.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-md">{getInitials(viewingPost.author.name)}</div>}
                  </Link>
                  <div>
                    <Link to={`/profile/${viewingPost.author._id}`} className="font-semibold text-secondary-900 hover:text-primary-600 text-sm">{viewingPost.author.name}</Link>
                    <p className="text-xs text-secondary-500">{formatDate(viewingPost.createdAt)}</p>
                  </div>
                </div>
                {viewingPost.text && <p className="text-secondary-800 text-sm mt-3 whitespace-pre-wrap">{viewingPost.text}</p>}
              </div>
              <div className="p-4 border-b">
                <div className="flex justify-around text-secondary-600">
                  <button className="flex items-center space-x-2 hover:text-primary-600 transition-colors py-2 px-3 rounded-md"><ThumbsUp size={20} /><span>Like</span></button>
                  <button className="flex items-center space-x-2 hover:text-primary-600 transition-colors py-2 px-3 rounded-md"><MessageCircle size={20} /><span>Comment</span></button>
                  <button className="flex items-center space-x-2 hover:text-primary-600 transition-colors py-2 px-3 rounded-md"><Repeat size={20} /><span>Repost</span></button>
                  <button className="flex items-center space-x-2 hover:text-primary-600 transition-colors py-2 px-3 rounded-md"><Send size={20} /><span>Send</span></button>
                </div>
              </div>
              <div className="flex-grow p-4"><p className="text-center text-secondary-400 text-sm">Comments will be shown here.</p></div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden transition-shadow hover:shadow-lg">
        <div className="p-6">
            <div className="flex items-start space-x-4">
            <Link to={`/profile/${post.author._id}`} className="flex-shrink-0">
                {post.author.profilePicture ? <img src={post.author.profilePicture} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-lg">{getInitials(post.author.name)}</div>}
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                <Link to={`/profile/${post.author._id}`} className="font-semibold text-secondary-900 hover:text-primary-600 transition-colors truncate">{post.author.name}</Link>
                <span className="text-secondary-400">·</span>
                <div className="flex items-center text-secondary-500 text-sm"><Clock className="w-4 h-4 mr-1.5" /><span>{formatDate(post.createdAt)}</span></div>
                </div>
                {post.text && <p className="text-secondary-800 leading-relaxed whitespace-pre-wrap">{post.text}</p>}
            </div>
            </div>
        </div>
        {hasImages && (
          <div className={`mt-2 ${post.images && post.images.length > 1 ? 'grid grid-cols-2 gap-px' : ''}`}>
            {post.images && post.images.map((image, index) => (
               <div key={index} className="bg-secondary-50 cursor-pointer relative group" onClick={() => openImageViewer(post, index)}>
                  <img src={image} alt={`Post content ${index + 1}`} className="w-full h-full object-cover max-h-[500px]" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors"></div>
               </div>
            ))}
          </div>
        )}
        <div className="px-6 pt-3">
          {likes.length > 0 && (
            <div className="flex items-center space-x-1 text-secondary-500 pb-2 border-b border-secondary-100">
              <ThumbsUp size={14} className="text-primary-500" />
              <span className="text-sm">{likes.length}</span>
            </div>
          )}
        </div>
        <div className="px-4 py-1 flex justify-around text-secondary-600">
            <button onClick={handleLike} className={`flex-1 flex items-center justify-center space-x-2 hover:bg-secondary-100 p-2 rounded-md transition-colors ${isLiked ? 'text-primary-600 font-semibold' : ''}`}><ThumbsUp size={20} /><span>Like</span></button>
            <button onClick={() => setShowComments(!showComments)} className="flex-1 flex items-center justify-center space-x-2 hover:bg-secondary-100 p-2 rounded-md transition-colors"><MessageCircle size={20} /><span>Comment</span></button>
        </div>
        {showComments && <CommentSection postId={post._id} />}
      </div>
    </>
  );
};

export default PostCard;