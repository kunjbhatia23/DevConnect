// src/components/PostForm.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) { // 5MB limit
        setError('File size cannot exceed 5MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) {
      setError('Post must contain text or an image.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText('');
      removeImage();
      onPostCreated();
    } catch (err: any) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Authentication error. Your session may have expired. Please log out and log back in.');
        setTimeout(() => logout(), 5000);
      } else {
        setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-secondary-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow"
            rows={3}
            maxLength={500}
        />
        {imagePreview && (
          <div className="mt-4 relative">
            <img src={imagePreview} alt="Preview" className="rounded-lg max-h-80 w-auto" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-secondary-100 rounded-full transition-colors">
            <ImageIcon size={24} />
          </button>
          <input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary-500">{text.length}/500</span>
            <button
              type="submit"
              disabled={isSubmitting || (!text.trim() && !imageFile)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default PostForm;