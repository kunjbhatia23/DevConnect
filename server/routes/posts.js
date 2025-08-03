import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import protect from '../middleware/auth.js';
import { multipleUploads } from '../middleware/multer.js';

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: { posts } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get posts by a specific user ID
// @route   GET /api/posts/user/:userId
// @access  Public
// THIS ROUTE IS NOW PLACED BEFORE ANY ROUTES WITH A GENERAL '/:id' PARAMETER
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: { posts } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, multipleUploads, [
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

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.likes.some(like => like.equals(req.user._id))) {
      post.likes = post.likes.filter(like => !like.equals(req.user._id));
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    const updatedPost = await Post.findById(post._id);
    res.json({ success: true, data: { post: updatedPost } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: 'asc' });
    res.json({ success: true, data: { comments } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create a comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
router.post('/:id/comments', protect, [
  body('text').not().isEmpty().withMessage('Comment text cannot be empty')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = new Comment({
      text: req.body.text,
      author: req.user._id,
      post: req.params.id
    });

    const comment = await newComment.save();
    await comment.populate('author', 'name profilePicture');

    res.status(201).json({ success: true, data: { comment } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;