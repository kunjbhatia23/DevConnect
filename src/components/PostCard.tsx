// src/components/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from './CommentSection';
import EditPostModal from './EditPostModal';
import toast from 'react-hot-toast';
import { Clock, X, ThumbsUp, MessageCircle, MoreHorizontal, ChevronLeft, ChevronRight, Repeat, Send, AlertTriangle } from 'lucide-react';

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
  onPostUpdate: (updatedPost: Post) => void;
  onPostDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [currentPost, setCurrentPost] = useState<Post>(post);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [isLiked, setIsLiked] = useState(false); // Initialize to false
  const [showComments, setShowComments] = useState(false);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    setCurrentPost(post);
    setLikes(post.likes);
    // Safely check for user and update liked state
    if (user) {
      setIsLiked(post.likes.includes(user._id));
    } else {
      setIsLiked(false);
    }
  }, [post, user]); // Add user to dependency array

  const handleLike = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!user) {
      toast.error('Please log in to like a post.', { id: 'login-toast' });
      return;
    }
    const originalLikes = likes;
    const newIsLiked = !isLiked;
    
    // Optimistically update the UI
    const newLikes = newIsLiked 
      ? [...likes, user._id] 
      : likes.filter(id => id !== user._id);
    setLikes(newLikes);
    setIsLiked(newIsLiked);

    try {
      const response = await axios.put(`/posts/${post._id}/like`);
      // Update state from server response to ensure consistency
      onPostUpdate(response.data.data.post);
    } catch (error) {
      console.error('Failed to like post', error);
      // Revert on error
      setLikes(originalLikes);
      setIsLiked(!newIsLiked);
    }
  };

  const handleDelete = () => {
    setMenuOpen(false);
    setIsConfirmingDelete(true);
  };
  
  const confirmDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      onPostDelete(post._id);
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
      onPostUpdate(updatedPost);
  };
  
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

  const hasImages = currentPost.images && currentPost.images.length > 0;

  return (
    <>
      {isConfirmingDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => setIsConfirmingDelete(false)}
        >
          <div 
            className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-200" id="modal-title">
                            Delete post
                        </h3>
                        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-secondary-50 dark:bg-secondary-900/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 rounded-b-xl">
              <button
                type="button"
                className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-secondary-300 dark:border-secondary-600 shadow-sm px-4 py-2 bg-white dark:bg-secondary-700 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800 sm:w-auto sm:text-sm transition-colors"
                onClick={() => setIsConfirmingDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-secondary-800 sm:w-auto sm:text-sm transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && <EditPostModal post={currentPost} onClose={() => setIsEditing(false)} onPostUpdated={handlePostUpdated} />}
      
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
            <div className="w-full lg:w-1/3 h-1/2 lg:h-full flex flex-col bg-white dark:bg-secondary-800 overflow-y-auto">
              <div className="p-4 border-b dark:border-secondary-700">
                 <div className="flex items-center space-x-3">
                  <Link to={`/profile/${viewingPost.author._id}`} className="flex-shrink-0">
                    {viewingPost.author.profilePicture ? <img src={viewingPost.author.profilePicture} alt={viewingPost.author.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-md">{getInitials(viewingPost.author.name)}</div>}
                  </Link>
                  <div>
                    <Link to={`/profile/${viewingPost.author._id}`} className="font-semibold text-secondary-900 dark:text-secondary-200 hover:text-primary-600 text-sm">{viewingPost.author.name}</Link>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{formatDate(viewingPost.createdAt)}</p>
                  </div>
                </div>
                {viewingPost.text && <p className="text-secondary-800 dark:text-secondary-300 text-sm mt-3 whitespace-pre-wrap">{viewingPost.text}</p>}
              </div>
              <div className="p-4 border-b dark:border-secondary-700">
                <div className="flex justify-around text-secondary-600 dark:text-secondary-400">
                  <button onClick={handleLike} className={`flex items-center space-x-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-3 rounded-md ${isLiked ? 'text-primary-600 dark:text-primary-400 font-semibold' : ''}`}><ThumbsUp size={20} /><span>Like</span></button>
                  <button className="flex items-center space-x-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-3 rounded-md"><MessageCircle size={20} /><span>Comment</span></button>
                  <button className="flex items-center space-x-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-3 rounded-md"><Repeat size={20} /><span>Repost</span></button>
                  <button className="flex items-center space-x-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-3 rounded-md"><Send size={20} /><span>Send</span></button>
                </div>
              </div>
              <div className="flex-grow">
                <CommentSection postId={viewingPost._id} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden transition-shadow hover:shadow-lg">
        <div className="p-6">
            <div className="flex items-start space-x-4">
            <Link to={`/profile/${currentPost.author._id}`} className="flex-shrink-0">
                {currentPost.author.profilePicture ? <img src={currentPost.author.profilePicture} alt={currentPost.author.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-lg">{getInitials(currentPost.author.name)}</div>}
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                <Link to={`/profile/${currentPost.author._id}`} className="font-semibold text-secondary-900 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate">{currentPost.author.name}</Link>
                <span className="text-secondary-400 dark:text-secondary-500">·</span>
                <div className="flex items-center text-secondary-500 dark:text-secondary-400 text-sm"><Clock className="w-4 h-4 mr-1.5" /><span>{formatDate(currentPost.createdAt)}</span></div>
                </div>
                {currentPost.text && <p className="text-secondary-800 dark:text-secondary-300 leading-relaxed whitespace-pre-wrap">{currentPost.text}</p>}
            </div>
            {user && user._id === currentPost.author._id && (
                <div className="relative flex-shrink-0">
                    <button onClick={() => setMenuOpen(!menuOpen)} onBlur={() => setTimeout(() => setMenuOpen(false), 150)} className="p-1 rounded-full text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700">
                        <MoreHorizontal />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-secondary-700 rounded-md shadow-lg z-10 border border-secondary-200 dark:border-secondary-600">
                            <button onClick={() => { setIsEditing(true); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-secondary-800 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-600">Edit Post</button>
                            <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-secondary-100 dark:hover:bg-secondary-600">Delete Post</button>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
        {hasImages && (
          <div className={`mt-2 ${currentPost.images && currentPost.images.length > 1 ? 'grid grid-cols-2 gap-px' : ''}`}>
            {currentPost.images && currentPost.images.map((image, index) => (
               <div key={index} className="bg-secondary-50 dark:bg-secondary-900 cursor-pointer relative group" onClick={() => openImageViewer(currentPost, index)}>
                  <img src={image} alt={`Post content ${index + 1}`} className="w-full h-full object-cover max-h-[500px]" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors"></div>
               </div>
            ))}
          </div>
        )}
        <div className="px-6 pt-3">
          {likes.length > 0 && (
            <div className="flex items-center space-x-1 text-secondary-500 dark:text-secondary-400 pb-2 border-b border-secondary-100 dark:border-secondary-700">
              <ThumbsUp size={14} className="text-primary-500" />
              <span className="text-sm">{likes.length}</span>
            </div>
          )}
        </div>
        <div className="px-4 py-1 flex justify-around text-secondary-600 dark:text-secondary-400">
            <button onClick={handleLike} className={`flex-1 flex items-center justify-center space-x-2 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 p-2 rounded-md transition-colors ${isLiked ? 'text-primary-600 dark:text-primary-400 font-semibold' : ''}`}><ThumbsUp size={20} /><span>Like</span></button>
            <button onClick={() => setShowComments(!showComments)} className="flex-1 flex items-center justify-center space-x-2 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 p-2 rounded-md transition-colors"><MessageCircle size={20} /><span>Comment</span></button>
        </div>
        {showComments && <CommentSection postId={currentPost._id} />}
      </div>
    </>
  );
};

export default PostCard;