import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, {
  timestamps: true
});

// Pre-populate author details whenever a comment is found
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name profilePicture'
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;