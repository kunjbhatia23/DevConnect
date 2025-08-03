// src/components/CommentSection.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

interface Comment {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/posts/${postId}/comments`);
        setComments(res.data.data.comments);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/posts/${postId}/comments`, { text: newComment });
      setComments([...comments, res.data.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment', error);
      alert('Failed to post comment. Please try again.');
    }
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return (names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2)).toUpperCase();
  };

  return (
    <div className="px-6 py-4">
      {/* Form to add a new comment */}
      {user && (
        <form onSubmit={handleSubmitComment} className="flex items-start space-x-3 mb-4">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-sm">
              {getInitials(user.name)}
            </div>
          )}
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border border-secondary-300 rounded-full py-2 pl-4 pr-10 focus:ring-primary-400 focus:border-primary-400"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-800" disabled={!newComment.trim()}>
              <Send size={20} />
            </button>
          </div>
        </form>
      )}

      {/* List of existing comments */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-secondary-500 text-sm">Loading comments...</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="flex items-start space-x-3">
              <Link to={`/profile/${comment.author._id}`}>
                {comment.author.profilePicture ? (
                  <img src={comment.author.profilePicture} alt={comment.author.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-sm">
                    {getInitials(comment.author.name)}
                  </div>
                )}
              </Link>
              <div className="flex-1 bg-secondary-100 rounded-lg p-3">
                <Link to={`/profile/${comment.author._id}`} className="font-semibold text-secondary-800 text-sm hover:underline">
                  {comment.author.name}
                </Link>
                <p className="text-secondary-700 text-sm">{comment.text}</p>
              </div>
            </div>
          ))
        )}
        {!loading && comments.length === 0 && (
          <p className="text-secondary-500 text-sm">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;