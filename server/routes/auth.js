import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// A helper function to create a clean user object for responses
const createCleanUserObject = (userDoc) => {
    return {
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        bio: userDoc.bio,
        profilePicture: userDoc.profilePicture,
        createdAt: userDoc.createdAt,
    };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, bio: bio || '' });
    const token = generateToken(user._id);

    // Send a clean user object in the response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: createCleanUserObject(user),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    
    // Send a clean user object in the response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: createCleanUserObject(user),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({
      success: true,
      data: { user: createCleanUserObject(user) }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching profile' });
  }
});

export default router;