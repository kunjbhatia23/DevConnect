import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length + imageFiles.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews: string[] = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
            setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && imageFiles.length === 0) {
      setError('Post must contain text or at least one image.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('text', text);
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      await axios.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText('');
      setImageFiles([]);
      setImagePreviews([]);
      toast.success('Post created successfully!');
      onPostCreated();
    } catch (err: any) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setError('Authentication error. Your session may have expired. Please log out and log back in.');
            setTimeout(() => logout(), 5000);
        } else {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 rounded-lg resize-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-shadow"
            rows={3}
            maxLength={500}
        />
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img src={preview} alt={`Preview ${index}`} className="rounded-lg w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 hover:bg-opacity-75 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-full transition-colors">
            <ImageIcon size={24} />
          </button>
          <input type="file" multiple accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary-500 dark:text-secondary-400">{text.length}/500</span>
            <button
              type="submit"
              disabled={isSubmitting || (!text.trim() && imageFiles.length === 0)}
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