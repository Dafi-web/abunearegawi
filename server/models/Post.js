const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['event', 'learning', 'bible', 'song'],
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
  },
  images: [{
    type: String,
  }],
  video: {
    type: String,
  },
  videos: [{
    url: String,
    videoType: {
      type: String,
      enum: ['youtube', 'vimeo', 'file'],
    },
  }],
  videoType: {
    type: String,
    enum: ['youtube', 'vimeo', 'file'],
  },
  attachments: [{
    name: String,
    url: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  eventDate: {
    type: Date,
  },
  eventEndDate: {
    type: Date,
  },
  location: {
    type: String,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);

