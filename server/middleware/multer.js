// server/middleware/multer.js
import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Create a multer instance with storage and file size limits
const multerInstance = multer({ 
  storage,
  limits: {
    // Limit file size to 5MB per file
    fileSize: 3 * 1024 * 1024, 
  }
});

// Middleware for a SINGLE file upload with field name 'image'
const singleUpload = multerInstance.single('image');

// Middleware for MULTIPLE file uploads (up to 5) with field name 'images'
const multipleUploads = multerInstance.array('images', 5);

export { singleUpload, multipleUploads };