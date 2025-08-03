// server/routes/posts.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import protect from '../middleware/auth.js';
import { multerUploads } from '../middleware/multer.js';

const router = express.Router();

// GET all posts (no changes needed here, but included for completeness)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: { posts } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new post
router.post('/', protect, multerUploads, [
  body('text').isLength({ max: 500 }).withMessage('Post cannot exceed 500 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { text } = req.body;
  if (!text && !req.file) {
    return res.status(400).json({ success: false, message: 'Post must have text or an image.' });
  }

  try {
    let imageString = '';
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      imageString = `data:${req.file.mimetype};base64,${b64}`;
    }

    const post = await Post.create({
      text: text || '',
      image: imageString,
      author: req.user._id
    });

    await post.populate('author', 'name email profilePicture');
    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while creating post' });
  }
});

// GET posts by user ID (no changes needed here)
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: { posts } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;