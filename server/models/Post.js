// server/models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    maxlength: [500, 'Post cannot exceed 500 characters']
  },
  images: {
    type: [String], 
    default: []
  },
  likes: [{ // Add this likes array
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email profilePicture'
  });
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;