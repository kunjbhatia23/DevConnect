// server/models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    maxlength: [500, 'Post cannot exceed 500 characters']
  },
  images: { // Changed 'image' to 'images' and type to an array of Strings
    type: [String], 
    default: []
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Populate author information by default
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email profilePicture'
  });
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;