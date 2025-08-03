import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .limit(50);

    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts'
    });
  }
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Post content must be between 1 and 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text } = req.body;

    // Create post
    const post = await Post.create({
      text,
      author: req.user._id
    });

    // Populate author information
    await post.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post'
    });
  }
});

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'name email');

    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user posts'
    });
  }
});

export default router;