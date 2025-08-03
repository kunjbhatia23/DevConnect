// src/components/EditPostModal.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Image as ImageIcon, X } from 'lucide-react';

interface Post {
  _id: string;
  text: string;
  images?: string[];
}

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onPostUpdated: (updatedPost: any) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onPostUpdated }) => {
  const [text, setText] = useState(post.text);
  const [existingImages, setExistingImages] = useState<string[]>(post.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setNewImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };
  
  const removeNewImage = (index: number) => {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('text', text);
    existingImages.forEach(img => formData.append('existingImages', img));
    newImageFiles.forEach(file => formData.append('images', file));

    try {
      // The 'headers' configuration has been removed from this API call
      const res = await axios.put(`/posts/${post._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      onPostUpdated(res.data.data.post);
      toast.success('Post updated successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b dark:border-secondary-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-secondary-900 dark:text-secondary-200">Edit Post</h2>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 focus:ring-primary-500 focus:border-primary-500"
            rows={4}
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {existingImages.map((img, i) => (
              <div key={`existing-${i}`} className="relative group"><img src={img} className="w-full h-24 object-cover rounded-md" /><button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button></div>
            ))}
            {newImagePreviews.map((img, i) => (
              <div key={`new-${i}`} className="relative group"><img src={img} className="w-full h-24 object-cover rounded-md" /><button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button></div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"><ImageIcon /></button>
            <input type="file" multiple onChange={handleNewImageChange} ref={fileInputRef} className="hidden" />
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;