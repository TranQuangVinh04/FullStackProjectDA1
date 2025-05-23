// models/ShortVideo.js

const mongoose = require('mongoose');

const shortVideoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    maxlength: 300
  },
  music: {
    type: String,
    default: ''
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  tags: [
    {
      type: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ShortVideo', shortVideoSchema);
