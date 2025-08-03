// server/routes/posts.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import protect from '../middleware/auth.js';
// Import the correct middleware
import { multipleUploads } from '../middleware/multer.js';

const router = express.Router();

// GET all posts (no changes)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: { posts } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new post with multiple images
router.post('/', protect, multipleUploads, [ // Use multipleUploads here
  body('text').isLength({ max: 500 }).withMessage('Post cannot exceed 500 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { text } = req.body;
  if (!text && (!req.files || req.files.length === 0)) {
    return res.status(400).json({ success: false, message: 'Post must have text or at least one image.' });
  }

  try {
    const imageStrings = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        imageStrings.push(`data:${file.mimetype};base64,${b64}`);
      }
    }

    const post = await Post.create({
      text: text || '',
      images: imageStrings,
      author: req.user._id
    });

    await post.populate('author', 'name email profilePicture');
    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while creating post' });
  }
});

// GET posts by user ID (no changes)
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: { posts } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;