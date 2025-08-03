// server/middleware/multer.js
import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Set up multer to handle a single file upload with the field name 'image'
const multerUploads = multer({ 
  storage,
  limits: {
    // Limit file size to 5MB
    fileSize: 5 * 1024 * 1024, 
  }
}).single('image');

export { multerUploads };