// server/routes/users.js
import express from 'express';
import User from '../models/User.js';
import protect from '../middleware/auth.js';
import { multerUploads } from '../middleware/multer.js';

const router = express.Router();

// GET user profile by ID (no changes needed here)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile picture
router.put('/pfp', protect, multerUploads, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided.' });
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const imageString = `data:${req.file.mimetype};base64,${b64}`;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.profilePicture = imageString;
    await user.save();

    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while updating profile picture.' });
  }
});

export default router;